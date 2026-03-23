"""Load environment from apps/backend/.env before other modules read os.environ."""
from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv

# apps/backend/.env (sibling of app/)
_BACKEND_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(_BACKEND_ROOT / ".env", override=False)
