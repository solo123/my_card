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


def create_access_token(user_id: str) -> str:
    now = _now()
    payload: dict[str, Any] = {
        "sub": user_id,
        "typ": "access",
        "iat": now,
        "exp": now + timedelta(seconds=ACCESS_EXPIRE_SECONDS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    now = _now()
    payload: dict[str, Any] = {
        "sub": user_id,
        "typ": "refresh",
        "iat": now,
        "exp": now + timedelta(seconds=REFRESH_EXPIRE_SECONDS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
