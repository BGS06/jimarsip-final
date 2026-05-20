from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from . import models


# Memerintahkan SQLAlchemy untuk men-generate tabel di MySQL 
# berdasarkan class yang ada di models.py (jika tabel belum ada)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JIMARSIP API",
    description="Sistem Backend Digitalisasi Pengelolaan Arsip Desa Jimbaran Kulon",
    version="1.0.0"
)

# Pengaturan CORS (Cross-Origin Resource Sharing)
# Mengizinkan Next.js (port 3000) untuk berkomunikasi dengan FastAPI (port 8000)
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Mengizinkan semua method (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Mengizinkan semua headers
)

@app.get("/")
def root():
    return {"message": "Selamat datang! Server Backend JIMARSIP berhasil berjalan."}

# ==========================================
# IMPORT ROUTERS (Endpoint API)
# ==========================================
# Bagian ini masih di-comment karena file routernya belum kita isi.
# Nanti kalau auth.py, penduduk.py, dan arsip.py sudah siap, tinggal buka comment-nya!

from .routers import auth, penduduk, arsip

app.include_router(auth.router)
app.include_router(penduduk.router)
app.include_router(arsip.router)