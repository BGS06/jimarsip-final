from pydantic import BaseModel
from datetime import date
from typing import Optional

# ==========================================
# SCHEMAS UNTUK TOKEN & OTENTIKASI
# ==========================================
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# ==========================================
# SCHEMAS UNTUK USER
# ==========================================
class UserBase(BaseModel):
    username: str
    role: Optional[str] = "admin"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True  # Pydantic v2 untuk membaca dari object ORM (SQLAlchemy)

# ==========================================
# SCHEMAS UNTUK DATA PENDUDUK
# ==========================================
class PendudukBase(BaseModel):
    nik: str
    nama: str
    jenis_kelamin: Optional[str] = None
    tempat_lahir: Optional[str] = None
    tanggal_lahir: Optional[date] = None
    alamat: Optional[str] = None
    agama: Optional[str] = None
    pekerjaan: Optional[str] = None

class PendudukCreate(PendudukBase):
    pass # Sama persis dengan PendudukBase untuk request buat data baru

class PendudukResponse(PendudukBase):
    id: int

    class Config:
        from_attributes = True

# ==========================================
# SCHEMAS UNTUK ARSIP DOKUMEN
# ==========================================
class ArsipDokumenBase(BaseModel):
    nama_pemilik: str
    jenis_dokumen: str
    nomor_surat: str
    tanggal_dokumen: Optional[date] = None

class ArsipDokumenCreate(ArsipDokumenBase):
    pass
    # Catatan: file_path tidak dimasukkan ke sini karena user
    # tidak mengirimkan teks path, melainkan mengupload file fisiknya
    # Path akan di-generate otomatis oleh backend

class ArsipDokumenResponse(ArsipDokumenBase):
    id: int
    file_path: Optional[str] = None

    class Config:
        from_attributes = True