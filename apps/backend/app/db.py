from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Iterator

from sqlmodel import Session, create_engine


def get_database_url() -> str:
    # Example: postgresql+psycopg://postgres:postgres@127.0.0.1:5432/my_card
    return os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:postgres@127.0.0.1:5432/postgres",
    )


engine = create_engine(get_database_url(), pool_pre_ping=True)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session

