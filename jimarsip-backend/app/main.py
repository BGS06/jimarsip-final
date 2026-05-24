from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from . import models

# 1. Import semua router di satu tempat agar rapi
from .routers import auth, penduduk, arsip, kk

# Memerintahkan SQLAlchemy untuk men-generate tabel di database 
# berdasarkan class yang ada di models.py (jika tabel belum ada)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JIMARSIP API",
    description="Sistem Backend Digitalisasi Pengelolaan Arsip Desa Jimbaran Kulon",
    version="1.0.0"
)

# 2. Pengaturan CORS (Cross-Origin Resource Sharing)
# Menggunakan ["*"] agar semua port frontend (termasuk localhost:3000) diizinkan masuk saat tahap development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Mengizinkan semua method (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Mengizinkan semua headers
)

@app.get("/")
def root():
    return {"message": "Selamat datang! Server Backend JIMARSIP berhasil berjalan."}

# ==========================================
# 3. DAFTARKAN ROUTERS (Endpoint API)
# ==========================================
app.include_router(auth.router)
app.include_router(penduduk.router)
app.include_router(arsip.router)
app.include_router(kk.router)  # <-- Router KK berhasil didaftarkan di sini!