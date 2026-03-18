from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    account: str = Field(index=True, unique=True)
    password: str
    real_name: str
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AuthToken(SQLModel, table=True):
    token: str = Field(primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class WalletOverview(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    wallet_account_id: str
    masked_card_number: str
    balance: str
    frozen_amount: str
    total_recharge: str
    total_consume: str
    total_withdraw: str


class WalletCardStat(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    card_type: str = Field(index=True)  # regular / 3d / 3d1
    label: str
    balance: str
    transfer_in: str
    consume: str
    refund: str
    dispute_rate: str
    dispute_count: str
    dispute_total: str
    refund_rate: str
    refund_amount_rate: str


class WalletAccountDetail(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    type: str  # income/expense
    amount: str
    balance_after: str
    remark: str
    created_at: str  # keep as formatted string to match existing frontend


class FundTransfer(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    initiator: str
    recipient: str
    amount: str
    fee: str
    actual: str
    status: str
    reviewer: str
    review_time: str
    create_time: str
    remark: Optional[str] = None


class TransferManagement(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    real_name: str
    account: str
    amount: str
    rate: str
    type: str
    payment_status: str
    approval_time: str
    payment_time: str
    update_time: str


class Cardholder(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    sub_account: str
    first_name: str
    last_name: str
    country_code: str
    state: str
    city: str
    address: str
    zip: str
    remark: str = ""


class Card(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    card_type: str  # visa/mastercard/3d/3d1 etc
    sub_account: str
    effective_date: str
    expire_date: str
    balance: str
    recharge_amount: str
    alias: str
    cardholder: str
    status: str
    scope: Optional[str] = None
    region: Optional[str] = None
    card_prefix: Optional[str] = None


class RechargeRecord(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    sub_account: str
    card_number: str
    request_id: str
    order_no: str
    status: str
    amount: str
    create_time: str


class Transaction(SQLModel, table=True):
    id: str = Field(primary_key=True)
    sub_account: str
    card_number: str
    transaction_time: str
    currency: str
    amount: str
    base_currency: str
    base_amount: str
    description: str
    merchant: str
    mcc: str
    type: str
    status: str


class RefundDetail(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    sub_account: str
    record_no: str
    card_number: str
    card_id: str
    bill_date: str
    tx_currency: str
    tx_amount: str
    bill_currency: str
    bill_amount: str
    fee: str
    create_time: str
    update_time: str


class FeeDetail(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    card_number: str
    fee_type: str
    amount: str
    created_at: str


class CancelledCard(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    card_type: str
    card_number: str
    alias: str
    cancelled_at: str
    reason: str
    status: str


class SubAccount(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    account: str
    role: str
    real_name: str
    created_at: str
    status: str


class Announcement(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    summary: str
    content: str
    published_at: str


class AccountSecurity(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    two_factor_enabled: bool = True

