from sqlalchemy import Column, Integer, String, Date, Text
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(20), default="admin") # Untuk membedakan hak akses admin/staff

class Penduduk(Base):
    __tablename__ = "penduduk"
    
    id = Column(Integer, primary_key=True, index=True)
    nik = Column(String(16), unique=True, index=True)
    nama = Column(String(100), index=True)
    jenis_kelamin = Column(String(20))
    tempat_lahir = Column(String(50))
    tanggal_lahir = Column(Date)
    alamat = Column(Text)
    agama = Column(String(50))
    pekerjaan = Column(String(100))

class ArsipDokumen(Base):
    __tablename__ = "arsip_dokumen"
    
    id = Column(Integer, primary_key=True, index=True)
    nama_pemilik = Column(String(100), index=True)
    jenis_dokumen = Column(String(100))
    nomor_surat = Column(String(100), unique=True, index=True)
    tanggal_dokumen = Column(Date)
    file_path = Column(String(255)) # Menyimpan lokasi/nama file arsip yang di-upload