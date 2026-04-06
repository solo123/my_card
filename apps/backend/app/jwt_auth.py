"""JWT access / refresh token helpers (HS256)."""
from __future__ import annotations

from . import config  # noqa: F401 - loads .env before JWT_* is read

import os
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_EXPIRE_SECONDS = int(os.getenv("JWT_ACCESS_EXPIRE_SECONDS", "7200"))
REFRESH_EXPIRE_SECONDS = int(os.getenv("JWT_REFRESH_EXPIRE_SECONDS", str(7 * 24 * 3600)))


def _now() -> datetime:
    return datetime.now(timezone.utc)


def sub_to_user_id(sub: Any) -> int | None:
    """Parse JWT `sub` claim to integer user id (accepts int or numeric string)."""
    if sub is None:
        return None
    if isinstance(sub, int):
        return sub
    if isinstance(sub, str):
        try:
            return int(sub)
        except ValueError:
            return None
    return None


def create_access_token(user_id: int) -> str:
    now = _now()
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "typ": "access",
        "iat": now,
        "exp": now + timedelta(seconds=ACCESS_EXPIRE_SECONDS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: int) -> str:
    now = _now()
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "typ": "refresh",
        "iat": now,
        "exp": now + timedelta(seconds=REFRESH_EXPIRE_SECONDS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
