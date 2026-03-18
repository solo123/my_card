from __future__ import annotations

from sqlmodel import Session, select

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


def seed_if_empty(session: Session) -> None:
    has_user = session.exec(select(User)).first() is not None
    if has_user:
        return

    session.add(
        User(
            id="u-1",
            account="18759270938",
            password="dev",
            real_name="Jimmy",
            avatar=None,
        )
    )

    session.add(
        WalletOverview(
            wallet_account_id="32683826",
            masked_card_number="6666 **** **** 8888",
            balance="55.70",
            frozen_amount="0.00",
            total_recharge="77250.00",
            total_consume="0.00",
            total_withdraw="0.00",
        )
    )

    session.add_all(
        [
            WalletCardStat(
                card_type="regular",
                label="常规卡",
                balance="8910.00",
                transfer_in="0.00",
                consume="0.00",
                refund="0.00",
                dispute_rate="0%",
                dispute_count="0",
                dispute_total="6791",
                refund_rate="0%",
                refund_amount_rate="0%",
            ),
            WalletCardStat(
                card_type="3d",
                label="3D卡",
                balance="0.00",
                transfer_in="0.00",
                consume="0.00",
                refund="0.00",
                dispute_rate="0%",
                dispute_count="0",
                dispute_total="0",
                refund_rate="0%",
                refund_amount_rate="0%",
            ),
            WalletCardStat(
                card_type="3d1",
                label="3D-1卡",
                balance="0.00",
                transfer_in="0.00",
                consume="0.00",
                refund="0.00",
                dispute_rate="0%",
                dispute_count="0",
                dispute_total="0",
                refund_rate="0%",
                refund_amount_rate="0%",
            ),
        ]
    )

    session.add_all(
        [
            WalletAccountDetail(
                type="income",
                amount="1000.00",
                balance_after="655.70",
                remark="充值到账",
                created_at="2026-03-07 11:20:01",
            ),
            WalletAccountDetail(
                type="expense",
                amount="200.00",
                balance_after="455.70",
                remark="转账支出",
                created_at="2026-03-08 09:05:44",
            ),
        ]
    )

    session.add(
        FundTransfer(
            initiator="Jimmy",
            recipient="Alice",
            amount="200.00",
            fee="2.00",
            actual="198.00",
            status="pending",
            reviewer="Admin",
            review_time="2026-03-08 12:00:00",
            create_time="2026-03-08 11:48:30",
            remark=None,
        )
    )

    session.add(
        TransferManagement(
            real_name="Sheri McKay",
            account="446612345678",
            amount="10.00",
            rate="1.5%",
            type="manual",
            payment_status="pending",
            approval_time="2026-03-08 12:10:00",
            payment_time="",
            update_time="2026-03-08 12:10:00",
        )
    )

    session.add_all(
        [
            Cardholder(
                id=389,
                sub_account="44661234",
                first_name="Sheri",
                last_name="McKay",
                country_code="US",
                state="CA",
                city="Merced",
                address="123 Main St",
                zip="95340",
                remark="",
            ),
            Cardholder(
                id=388,
                sub_account="44661235",
                first_name="Josh",
                last_name="Aukes",
                country_code="US",
                state="NC",
                city="Lexington",
                address="456 Oak Ave",
                zip="27292",
                remark="",
            ),
        ]
    )

    session.add_all(
        [
            Card(
                id=1566,
                card_type="visa",
                sub_account="",
                effective_date="2026/02/23",
                expire_date="2026/05/23",
                balance="916.07",
                recharge_amount="1000.00",
                alias="点击设置别名",
                cardholder="Sheri",
                status="active",
            ),
            Card(
                id=1567,
                card_type="mastercard",
                sub_account="",
                effective_date="2026/03/01",
                expire_date="2026/06/01",
                balance="0.00",
                recharge_amount="0.00",
                alias="点击设置别名",
                cardholder="Josh",
                status="active",
            ),
        ]
    )

    session.add_all(
        [
            RechargeRecord(
                id=1,
                sub_account="44661234",
                card_number="44661***",
                request_id="REQ001",
                order_no="ORD001",
                status="账户转卡",
                amount="8000.00",
                create_time="2026-03-07 13:08:30",
            ),
            RechargeRecord(
                id=2,
                sub_account="44661235",
                card_number="44662***",
                request_id="REQ002",
                order_no="ORD002",
                status="卡转账户",
                amount="1200.00",
                create_time="2026-03-08 18:14:21",
            ),
        ]
    )

    session.add(
        Transaction(
            id="274001",
            sub_account="44661234",
            card_number="44661***",
            transaction_time="2026-03-08 00:30:42",
            currency="USD",
            amount="10.59",
            base_currency="USD",
            base_amount="10.59",
            description="Approved or...",
            merchant="AM***",
            mcc="5942",
            type="授权",
            status="待",
        )
    )

    session.add_all(
        [
            RefundDetail(
                id=3819,
                sub_account="44661234",
                record_no="RN001",
                card_number="44661***",
                card_id="CID001",
                bill_date="2026-03-08",
                tx_currency="USD",
                tx_amount="10.00",
                bill_currency="USD",
                bill_amount="10.00",
                fee="0.00",
                create_time="2026-03-08 10:00:00",
                update_time="2026-03-08 10:05:00",
            ),
            RefundDetail(
                id=3818,
                sub_account="44661235",
                record_no="RN002",
                card_number="44662***",
                card_id="CID002",
                bill_date="2026-03-07",
                tx_currency="USD",
                tx_amount="4.20",
                bill_currency="USD",
                bill_amount="4.20",
                fee="0.10",
                create_time="2026-03-07 14:00:00",
                update_time="2026-03-07 14:02:00",
            ),
        ]
    )

    session.add(
        FeeDetail(
            id=1,
            card_number="44661***",
            fee_type="service_fee",
            amount="0.10",
            created_at="2026-03-07 14:00:00",
        )
    )

    session.add(
        SubAccount(
            id=1,
            account="44661234",
            role="member",
            real_name="Sheri McKay",
            created_at="2026-03-01 10:00:00",
            status="active",
        )
    )
    session.add(
        SubAccount(
            id=2,
            account="44661235",
            role="member",
            real_name="Josh Aukes",
            created_at="2026-03-02 10:00:00",
            status="active",
        )
    )

    session.add_all(
        [
            Announcement(
                id=1,
                title="公告测试2",
                summary="时间戳转换工具说明",
                content="时间戳转换工具说明：自1970年1月1日（UTC/GMT午夜）起经过的秒数无法直接阅读，需要转换为日期时间格式。本工具支持正向与反向转换。",
                published_at="2026-03-08 12:00:00",
            ),
            Announcement(
                id=2,
                title="系统维护通知",
                summary="计划内维护",
                content="系统将在深夜进行短时维护。",
                published_at="2026-03-07 22:00:00",
            ),
        ]
    )

    session.add(AccountSecurity(id=1, two_factor_enabled=True))

    session.commit()

