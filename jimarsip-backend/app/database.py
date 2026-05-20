import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load variabel dari file .env
load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Buat engine koneksi. Khusus SQLite, kita butuh check_same_thread=False
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Buat session lokal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class untuk models kita
Base = declarative_base()

# Dependency untuk mendapatkan session DB di setiap request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()