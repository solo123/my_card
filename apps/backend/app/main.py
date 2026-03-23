from __future__ import annotations

from datetime import datetime, timedelta, timezone
from decimal import Decimal
from pathlib import Path
from typing import Any, Optional
from uuid import uuid4

import jwt

from fastapi import (
    APIRouter,
    Depends,
    FastAPI,
    File,
    Header,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from sqlmodel import SQLModel, Session, select

from .db import get_session, engine
from .jwt_auth import (
    ACCESS_EXPIRE_SECONDS,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from .models import (
    AccountSecurity,
    Announcement,
    Card,
    Cardholder,
    FeeDetail,
    FundTransfer,
    RechargeRecord,
    RefundDetail,
    SubAccount,
    Transaction,
    TransferManagement,
    User,
    WalletAccountDetail,
    WalletCardStat,
    WalletOverview,
)
from .seed import seed_if_empty


APP_TITLE = "道生匯 API"
APP_VERSION = "0.1.0"
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"


def iso_now() -> str:
    return datetime.now(timezone.utc).astimezone().strftime("%Y-%m-%d %H:%M:%S")


def fmt_date(value: str) -> str:
    return value


def money(value: Any) -> str:
    return f"{Decimal(str(value)):.2f}"


def api_ok(data: Any = None, message: str = "success") -> JSONResponse:
    return JSONResponse(content={"code": 0, "message": message, "data": data})


def api_fail(message: str, code: int = 400) -> JSONResponse:
    return JSONResponse(status_code=code, content={"code": code, "message": message, "data": None})


def paginate(items: list[dict[str, Any]], page: int = 1, page_size: int = 10) -> dict[str, Any]:
    start = max(page - 1, 0) * page_size
    end = start + page_size
    return {"list": items[start:end], "total": len(items)}


def contains(value: Optional[str], needle: Optional[str]) -> bool:
    if not needle:
        return True
    if value is None:
        return False
    return needle.lower() in str(value).lower()


def parse_bearer_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="unauthorized")
    return authorization.removeprefix("Bearer ").strip()


def get_current_user(
    authorization: Optional[str] = Header(default=None),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    token = parse_bearer_token(authorization)
    try:
        payload = decode_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token")
    if payload.get("typ") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token type")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="unauthorized")
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="unauthorized")
    return {"id": user.id, "account": user.account, "realName": user.real_name, "avatar": user.avatar}


class LoginRequest(BaseModel):
    account: str = Field(min_length=1)
    password: str = Field(min_length=1)


class ForgotPasswordRequest(BaseModel):
    email: str = Field(min_length=3)


class FundTransferCreate(BaseModel):
    recipientAccount: str = Field(min_length=1)
    amount: Decimal = Field(gt=0)
    remark: Optional[str] = None


class CardAliasUpdate(BaseModel):
    alias: str = Field(min_length=1)


class OpenCardRequest(BaseModel):
    validityStart: str
    validityEnd: str
    rechargeAmount: Decimal = Field(gt=0)
    scope: str
    region: str
    cardPrefix: str
    cardType: str


class VerifyRequest(BaseModel):
    step: int = Field(ge=1, le=3)
    enterpriseType: Optional[str] = None
    businessLicenseUrl: Optional[str] = None
    registrationAddress: Optional[str] = None
    legalPersonName: Optional[str] = None
    idType: Optional[str] = None
    idNumber: Optional[str] = None
    idFrontUrl: Optional[str] = None
    idBackUrl: Optional[str] = None


class PasswordUpdateRequest(BaseModel):
    oldPassword: str
    newPassword: str


class SecurityToggleRequest(BaseModel):
    enabled: bool


class CardholderUpdateRequest(BaseModel):
    subAccount: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    countryCode: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    zip: Optional[str] = None
    remark: Optional[str] = None


class CardUpdateRequest(BaseModel):
    alias: Optional[str] = None
    status: Optional[str] = None


app = FastAPI(title=APP_TITLE, version=APP_VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")

@app.on_event("startup")
def on_startup() -> None:
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_if_empty(session)


@app.exception_handler(HTTPException)
async def http_exception_handler(_, exc: HTTPException) -> JSONResponse:
    return api_fail(str(exc.detail), code=exc.status_code)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_, exc: RequestValidationError) -> JSONResponse:
    return api_fail("; ".join(item["msg"] for item in exc.errors()), code=400)


@app.exception_handler(Exception)
async def generic_exception_handler(_, exc: Exception) -> JSONResponse:
    return api_fail(f"internal error: {exc}", code=500)


@app.get("/health")
async def health() -> JSONResponse:
    return api_ok({"status": "ok"})


@api.post("/auth/login")
async def login(payload: LoginRequest, session: Session = Depends(get_session)) -> JSONResponse:
    if not payload.account or not payload.password:
        raise HTTPException(status_code=400, detail="account and password are required")
    user = session.exec(select(User).where(User.account == payload.account)).first()
    if not user or user.password != payload.password:
        raise HTTPException(status_code=400, detail="账号或密码错误")
    access = create_access_token(user.id)
    refresh = create_refresh_token(user.id)
    return api_ok(
        {
            "token": access,
            "refreshToken": refresh,
            "expiresIn": ACCESS_EXPIRE_SECONDS,
            "user": {"id": user.id, "account": user.account, "realName": user.real_name, "avatar": user.avatar},
        }
    )


@api.post("/auth/logout")
async def logout(
    current_user: dict[str, Any] = Depends(get_current_user),
) -> JSONResponse:
    # JWT 无状态：客户端删除 token 即可；服务端不维护黑名单（可按需扩展）
    return api_ok({"success": True, "userId": current_user["id"]})


@api.post("/auth/forgot-password")
async def forgot_password(_: ForgotPasswordRequest) -> JSONResponse:
    return api_ok({"sent": True})


@api.post("/auth/refresh")
async def refresh_token(
    authorization: Optional[str] = Header(default=None),
    session: Session = Depends(get_session),
) -> JSONResponse:
    """使用 `Authorization: Bearer <refreshToken>` 换取新的 access / refresh token。"""
    raw = parse_bearer_token(authorization)
    try:
        payload = decode_token(raw)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid refresh token")
    if payload.get("typ") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token type")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="unauthorized")
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="unauthorized")
    access = create_access_token(user.id)
    refresh = create_refresh_token(user.id)
    return api_ok(
        {
            "token": access,
            "refreshToken": refresh,
            "expiresIn": ACCESS_EXPIRE_SECONDS,
        }
    )


@api.get("/auth/me")
async def me(current_user: dict[str, Any] = Depends(get_current_user)) -> JSONResponse:
    return api_ok(current_user)


@api.get("/wallet/overview")
async def wallet_overview(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> JSONResponse:
    _ = current_user
    overview = session.exec(select(WalletOverview)).first()
    if not overview:
        raise HTTPException(status_code=404, detail="wallet not found")
    stats = session.exec(select(WalletCardStat)).all()
    data = {
        "walletAccountId": overview.wallet_account_id,
        "maskedCardNumber": overview.masked_card_number,
        "balance": overview.balance,
        "frozenAmount": overview.frozen_amount,
        "totalRecharge": overview.total_recharge,
        "totalConsume": overview.total_consume,
        "totalWithdraw": overview.total_withdraw,
        "cardStats": [
            {
                "cardType": s.card_type,
                "label": s.label,
                "balance": s.balance,
                "transferIn": s.transfer_in,
                "consume": s.consume,
                "refund": s.refund,
                "disputeRate": s.dispute_rate,
                "disputeCount": s.dispute_count,
                "disputeTotal": s.dispute_total,
                "refundRate": s.refund_rate,
                "refundAmountRate": s.refund_amount_rate,
            }
            for s in stats
        ],
    }
    return api_ok(data)


@api.get("/wallet/account-details")
async def wallet_account_details(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    type: Optional[str] = None,
) -> JSONResponse:
    _ = current_user
    rows = session.exec(select(WalletAccountDetail).order_by(WalletAccountDetail.id.desc())).all()
    items = [
        {
            "id": r.id,
            "type": r.type,
            "amount": r.amount,
            "balanceAfter": r.balance_after,
            "remark": r.remark,
            "createdAt": r.created_at,
        }
        for r in rows
        if contains(r.type, type) and contains(r.created_at, startDate) and contains(r.created_at, endDate)
    ]
    return api_ok(paginate(items, page, pageSize))


@api.get("/wallet/fund-transfers")
async def list_fund_transfers(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    status: Optional[str] = None,
) -> JSONResponse:
    _ = current_user
    rows = session.exec(select(FundTransfer).order_by(FundTransfer.id.desc())).all()
    items = [
        {
            "id": r.id,
            "initiator": r.initiator,
            "recipient": r.recipient,
            "amount": r.amount,
            "fee": r.fee,
            "actual": r.actual,
            "status": r.status,
            "reviewer": r.reviewer,
            "reviewTime": r.review_time,
            "createTime": r.create_time,
        }
        for r in rows
        if contains(r.status, status) and contains(r.create_time, startDate) and contains(r.create_time, endDate)
    ]
    return api_ok(paginate(items, page, pageSize))


@api.post("/wallet/fund-transfers")
async def create_fund_transfer(
    payload: FundTransferCreate,
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> JSONResponse:
    row = FundTransfer(
        initiator=current_user["realName"],
        recipient=payload.recipientAccount,
        amount=money(payload.amount),
        fee=money(Decimal("0.00")),
        actual=money(payload.amount),
        status="pending",
        reviewer="",
        review_time="",
        create_time=iso_now(),
        remark=payload.remark,
    )
    session.add(row)
    session.commit()
    session.refresh(row)
    return api_ok(
        {
            "id": row.id,
            "initiator": row.initiator,
            "recipient": row.recipient,
            "amount": row.amount,
            "fee": row.fee,
            "actual": row.actual,
            "status": row.status,
            "reviewer": row.reviewer,
            "reviewTime": row.review_time,
            "createTime": row.create_time,
        },
        message="created",
    )


@api.get("/wallet/transfer-management")
async def transfer_management(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    realName: Optional[str] = None,
    account: Optional[str] = None,
    paymentStatus: Optional[str] = None,
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
) -> JSONResponse:
    _ = current_user
    rows = session.exec(select(TransferManagement).order_by(TransferManagement.id.desc())).all()
    items = [
        {
            "id": r.id,
            "realName": r.real_name,
            "account": r.account,
            "amount": r.amount,
            "rate": r.rate,
            "type": r.type,
            "paymentStatus": r.payment_status,
            "approvalTime": r.approval_time,
            "paymentTime": r.payment_time,
            "updateTime": r.update_time,
        }
        for r in rows
        if contains(r.real_name, realName)
        and contains(r.account, account)
        and contains(r.payment_status, paymentStatus)
        and contains(r.update_time, startDate)
        and contains(r.update_time, endDate)
    ]
    return api_ok(paginate(items, page, pageSize))


@api.get("/cards/cardholders")
async def list_cardholders(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    subAccount: Optional[str] = None,
    firstName: Optional[str] = None,
    lastName: Optional[str] = None,
) -> JSONResponse:
    _ = current_user
    rows = session.exec(select(Cardholder).order_by(Cardholder.id.desc())).all()
    items = [
        {
            "id": r.id,
            "subAccount": r.sub_account,
            "firstName": r.first_name,
            "lastName": r.last_name,
            "countryCode": r.country_code,
            "state": r.state,
            "city": r.city,
            "address": r.address,
            "zip": r.zip,
            "remark": r.remark,
        }
        for r in rows
        if contains(r.sub_account, subAccount) and contains(r.first_name, firstName) and contains(r.last_name, lastName)
    ]
    return api_ok(paginate(items, page, pageSize))


@api.put("/cards/cardholders/{cardholder_id}")
async def update_cardholder(
    cardholder_id: int,
    payload: CardholderUpdateRequest,
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> JSONResponse:
    _ = current_user
    row = session.get(Cardholder, cardholder_id)
    if not row:
        raise HTTPException(status_code=404, detail="cardholder not found")
    data = payload.model_dump(exclude_unset=True)
    if "subAccount" in data:
        row.sub_account = data["subAccount"]
    if "firstName" in data:
        row.first_name = data["firstName"]
    if "lastName" in data:
        row.last_name = data["lastName"]
    if "countryCode" in data:
        row.country_code = data["countryCode"]
    if "state" in data:
        row.state = data["state"]
    if "city" in data:
        row.city = data["city"]
    if "address" in data:
        row.address = data["address"]
    if "zip" in data:
        row.zip = data["zip"]
    if "remark" in data:
        row.remark = data["remark"]
    session.add(row)
    session.commit()
    session.refresh(row)
    return api_ok(
        {
            "id": row.id,
            "subAccount": row.sub_account,
            "firstName": row.first_name,
            "lastName": row.last_name,
            "countryCode": row.country_code,
            "state": row.state,
            "city": row.city,
            "address": row.address,
            "zip": row.zip,
            "remark": row.remark,
        }
    )


@api.get("/cards/list")
async def list_cards(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    cardNumber: Optional[str] = None,
    balanceMin: Optional[Decimal] = None,
    status: Optional[str] = None,
    cardType: Optional[str] = None,
) -> JSONResponse:
    _ = current_user
    rows = session.exec(select(Card).order_by(Card.id.desc())).all()
    items = [
        {
            "id": r.id,
            "subAccount": r.sub_account,
            "effectiveDate": r.effective_date,
            "expireDate": r.expire_date,
            "balance": r.balance,
            "rechargeAmount": r.recharge_amount,
            "alias": r.alias,
            "cardholder": r.cardholder,
            "status": r.status,
            "cardType": r.card_type,
        }
        for r in rows
        if contains(r.alias, cardNumber)
        and contains(r.status, status)
        and contains(r.card_type, cardType)
        and (balanceMin is None or Decimal(r.balance) >= balanceMin)
    ]
    return api_ok(paginate(items, page, pageSize))


@api.get("/cards/{card_id}")
async def get_card(
    card_id: int,
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> JSONResponse:
    _ = current_user
    row = session.get(Card, card_id)
    if not row:
        raise HTTPException(status_code=404, detail="card not found")
    return api_ok(
        {
            "id": row.id,
            "subAccount": row.sub_account,
            "effectiveDate": row.effective_date,
            "expireDate": row.expire_date,
            "balance": row.balance,
            "rechargeAmount": row.recharge_amount,
            "alias": row.alias,
            "cardholder": row.cardholder,
            "status": row.status,
            "cardType": row.card_type,
        }
    )


@api.get("/cards/{card_id}/balance")
async def get_card_balance(
    card_id: int,
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> JSONResponse:
    _ = current_user
    row = session.get(Card, card_id)
    if not row:
        raise HTTPException(status_code=404, detail="card not found")
    return api_ok({"balance": row.balance, "currency": "USD"})


@api.get("/cards/{card_id}/cvv")
async def get_card_cvv(
    card_id: int,
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> JSONResponse:
    _ = current_user
    if not session.get(Card, card_id):
        raise HTTPException(status_code=404, detail="card not found")
    return api_ok({"cvv": "123"})


@api.patch("/cards/{card_id}")
async def patch_card(
    card_id: int,
    payload: CardUpdateRequest,
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> JSONResponse:
    _ = current_user
    row = session.get(Card, card_id)
    if not row:
        raise HTTPException(status_code=404, detail="card not found")
    data = payload.model_dump(exclude_unset=True)
    if "alias" in data and data["alias"] is not None:
        row.alias = data["alias"]
    if "status" in data and data["status"] is not None:
        row.status = data["status"]
    session.add(row)
    session.commit()
    session.refresh(row)
    return api_ok(
        {
            "id": row.id,
            "subAccount": row.sub_account,
            "effectiveDate": row.effective_date,
            "expireDate": row.expire_date,
            "balance": row.balance,
            "rechargeAmount": row.recharge_amount,
            "alias": row.alias,
            "cardholder": row.cardholder,
            "status": row.status,
            "cardType": row.card_type,
        }
    )


@api.post("/cards/{card_id}/cancel")
@api.delete("/cards/{card_id}")
async def cancel_card(
    card_id: int,
    reason: Optional[str] = None,
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> JSONResponse:
    _ = current_user
    row = session.get(Card, card_id)
    if not row:
        raise HTTPException(status_code=404, detail="card not found")
    row.status = "cancelled"
    session.add(row)
    cancelled = CancelledCard(
        card_type=row.card_type,
        card_number=f"{card_id}***",
        alias=row.alias,
        cancelled_at=iso_now(),
        reason=reason or "user_request",
        status="cancelled",
    )
    session.add(cancelled)
    session.commit()
    session.refresh(cancelled)
    return api_ok(
        {
            "id": cancelled.id,
            "cardType": cancelled.card_type,
            "cardNumber": cancelled.card_number,
            "alias": cancelled.alias,
            "cancelledAt": cancelled.cancelled_at,
            "reason": cancelled.reason,
            "status": cancelled.status,
        }
    )


@api.post("/cards/open")
async def open_card(
    payload: OpenCardRequest,
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> JSONResponse:
    _ = current_user
    card = Card(
        card_type=payload.cardType,
        sub_account="",
        effective_date=payload.validityStart.replace("-", "/"),
        expire_date=payload.validityEnd.replace("-", "/"),
        balance=money(payload.rechargeAmount),
        recharge_amount=money(payload.rechargeAmount),
        alias="点击设置别名",
        cardholder=current_user["realName"],
        status="pending",
        scope=payload.scope,
        region=payload.region,
        card_prefix=payload.cardPrefix,
    )
    session.add(card)
    session.commit()
    session.refresh(card)
    return api_ok({"cardId": card.id, "status": "pending"})


@api.get("/cards/recharge-records")
async def recharge_records(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    cardNumber: Optional[str] = None,
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    status: Optional[str] = None,
) -> JSONResponse:
    _ = current_user
    rows = session.exec(select(RechargeRecord).order_by(RechargeRecord.id.desc())).all()
    items = [
        {
            "id": r.id,
            "subAccount": r.sub_account,
            "cardNumber": r.card_number,
            "requestId": r.request_id,
            "orderNo": r.order_no,
            "status": r.status,
            "amount": r.amount,
            "createTime": r.create_time,
        }
        for r in rows
        if contains(r.card_number, cardNumber)
        and contains(r.create_time, startDate)
        and contains(r.create_time, endDate)
        and contains(r.status, status)
    ]
    return api_ok(paginate(items, page, pageSize))


@api.get("/cards/transactions")
async def transactions(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    cardNumber: Optional[str] = None,
    transactionType: Optional[str] = None,
    status: Optional[str] = None,
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
) -> JSONResponse:
    _ = current_user
    rows = session.exec(select(Transaction).order_by(Transaction.transaction_time.desc())).all()
    items = [
        {
            "id": r.id,
            "subAccount": r.sub_account,
            "cardNumber": r.card_number,
            "transactionTime": r.transaction_time,
            "currency": r.currency,
            "amount": r.amount,
            "baseCurrency": r.base_currency,
            "baseAmount": r.base_amount,
            "description": r.description,
            "merchant": r.merchant,
            "mcc": r.mcc,
            "type": r.type,
            "status": r.status,
        }
        for r in rows
        if contains(r.card_number, cardNumber)
        and contains(r.type, transactionType)
        and contains(r.status, status)
        and contains(r.transaction_time, startDate)
        and contains(r.transaction_time, endDate)
    ]
    return api_ok(paginate(items, page, pageSize))


@api.get("/cards/refund-details")
async def refund_details(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    cardNumber: Optional[str] = None,
    billDateStart: Optional[str] = None,
    billDateEnd: Optional[str] = None,
    createStart: Optional[str] = None,
    createEnd: Optional[str] = None,
) -> JSONResponse:
    _ = current_user
    rows = session.exec(select(RefundDetail).order_by(RefundDetail.id.desc())).all()
    items = [
        {
            "id": r.id,
            "subAccount": r.sub_account,
            "recordNo": r.record_no,
            "cardNumber": r.card_number,
            "cardId": r.card_id,
            "billDate": r.bill_date,
            "txCurrency": r.tx_currency,
            "txAmount": r.tx_amount,
            "billCurrency": r.bill_currency,
            "billAmount": r.bill_amount,
            "fee": r.fee,
            "createTime": r.create_time,
            "updateTime": r.update_time,
        }
        for r in rows
        if contains(r.card_number, cardNumber)
        and contains(r.bill_date, billDateStart)
        and contains(r.bill_date, billDateEnd)
        and contains(r.create_time, createStart)
        and contains(r.create_time, createEnd)
    ]
    return api_ok(paginate(items, page, pageSize))


@api.get("/cards/fee-details")
async def fee_details(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    cardNumber: Optional[str] = None,
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
) -> JSONResponse:
    _ = current_user
    rows = session.exec(select(FeeDetail).order_by(FeeDetail.id.desc())).all()
    items = [
        {"id": r.id, "cardNumber": r.card_number, "feeType": r.fee_type, "amount": r.amount, "createdAt": r.created_at}
        for r in rows
        if contains(r.card_number, cardNumber) and contains(r.created_at, startDate) and contains(r.created_at, endDate)
    ]
    return api_ok(paginate(items, page, pageSize))


@api.get("/cards/cancelled")
async def cancelled_cards(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    cardNumber: Optional[str] = None,
    cancelStart: Optional[str] = None,
    cancelEnd: Optional[str] = None,
) -> JSONResponse:
    _ = current_user
    rows = session.exec(select(CancelledCard).order_by(CancelledCard.id.desc())).all()
    items = [
        {
            "id": r.id,
            "cardType": r.card_type,
            "cardNumber": r.card_number,
            "alias": r.alias,
            "cancelledAt": r.cancelled_at,
            "reason": r.reason,
            "status": r.status,
        }
        for r in rows
        if contains(r.card_number, cardNumber) and contains(r.cancelled_at, cancelStart) and contains(r.cancelled_at, cancelEnd)
    ]
    return api_ok(paginate(items, page, pageSize))


@api.post("/account/verify")
async def account_verify(
    payload: VerifyRequest,
    current_user: dict[str, Any] = Depends(get_current_user),
) -> JSONResponse:
    _ = current_user
    if payload.step < 3:
        return api_ok({"nextStep": payload.step + 1})
    return api_ok({"verified": True})


@api.put("/account/password")
async def update_password(
    payload: PasswordUpdateRequest,
    current_user: dict[str, Any] = Depends(get_current_user),
) -> JSONResponse:
    _ = current_user
    if payload.oldPassword == payload.newPassword:
        raise HTTPException(status_code=400, detail="new password must be different from old password")
    return api_ok({"updated": True})


@api.get("/account/sub-accounts")
async def sub_accounts(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
) -> JSONResponse:
    _ = current_user
    rows = session.exec(select(SubAccount).order_by(SubAccount.id.desc())).all()
    items = [
        {"id": r.id, "account": r.account, "role": r.role, "realName": r.real_name, "createdAt": r.created_at, "status": r.status}
        for r in rows
    ]
    return api_ok(paginate(items, page, pageSize))


@api.get("/account/security")
async def get_security(
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> JSONResponse:
    _ = current_user
    sec = session.get(AccountSecurity, 1)
    if not sec:
        sec = AccountSecurity(id=1, two_factor_enabled=True)
        session.add(sec)
        session.commit()
        session.refresh(sec)
    # trustedDevices 仍为示例（可扩展成表）
    return api_ok(
        {
            "twoFactorEnabled": sec.two_factor_enabled,
            "trustedDevices": [{"deviceId": "dev-1", "name": "MacBook Pro", "lastSeenAt": "2026-03-08 09:00:00"}],
        }
    )


@api.post("/account/security/2fa")
async def toggle_2fa(
    payload: SecurityToggleRequest,
    current_user: dict[str, Any] = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> JSONResponse:
    _ = current_user
    sec = session.get(AccountSecurity, 1)
    if not sec:
        sec = AccountSecurity(id=1, two_factor_enabled=payload.enabled)
    else:
        sec.two_factor_enabled = payload.enabled
    session.add(sec)
    session.commit()
    return api_ok({"twoFactorEnabled": payload.enabled})


@api.get("/announcements")
async def announcements(
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
) -> JSONResponse:
    rows = session.exec(select(Announcement).order_by(Announcement.id.desc())).all()
    items = [{"id": r.id, "title": r.title, "summary": r.summary, "content": r.content, "publishedAt": r.published_at} for r in rows]
    return api_ok(paginate(items, page, pageSize))


@api.get("/announcements/{announcement_id}")
async def announcement_detail(announcement_id: int, session: Session = Depends(get_session)) -> JSONResponse:
    row = session.get(Announcement, announcement_id)
    if not row:
        raise HTTPException(status_code=404, detail="announcement not found")
    return api_ok({"id": row.id, "title": row.title, "content": row.content, "publishedAt": row.published_at})


@api.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: dict[str, Any] = Depends(get_current_user)) -> JSONResponse:
    _ = current_user
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    target_name = f"{uuid4().hex}_{file.filename or 'upload.bin'}"
    target_path = UPLOAD_DIR / target_name
    contents = await file.read()
    target_path.write_bytes(contents)
    return api_ok(
        {
            "filename": file.filename,
            "contentType": file.content_type,
            "size": len(contents),
            "url": f"/uploads/{target_name}",
        },
        message="uploaded",
    )


app.include_router(api)

