import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY", "change-me-in-production")
DEBUG = os.environ.get("DEBUG", "False").lower() in ("true", "1", "yes")
DB_PATH = os.environ.get("DB_PATH", "loja.db")
