import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from datetime import date
import tempfile
from .. import models, schemas, database
from ..core import google_service

router = APIRouter(prefix="/arsip", tags=["Arsip Dokumen"])

# Buat folder 'uploads' secara otomatis jika belum ada
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=schemas.ArsipDokumenResponse, status_code=status.HTTP_201_CREATED)
def upload_arsip(
    # Kita pakai Form(...) karena data dikirim menggunakan multipart/form-data bersamaan dengan file
    nama_pemilik: str = Form(...),
    jenis_dokumen: str = Form(...),
    nomor_surat: str = Form(...),
    tanggal_dokumen: date = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    # Cek nomor surat agar tidak duplikat
    existing_arsip = db.query(models.ArsipDokumen).filter(models.ArsipDokumen.nomor_surat == nomor_surat).first()
    if existing_arsip:
        raise HTTPException(status_code=400, detail="Nomor surat sudah ada di sistem")

    # Simpan file fisik ke folder lokal server
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    # Simpan metadata ke database MySQL
    new_arsip = models.ArsipDokumen(
        nama_pemilik=nama_pemilik,
        jenis_dokumen=jenis_dokumen,
        nomor_surat=nomor_surat,
        tanggal_dokumen=tanggal_dokumen,
        file_path=file_location
    )
    db.add(new_arsip)
    db.commit()
    db.refresh(new_arsip)
    return new_arsip

@router.get("/", response_model=List[schemas.ArsipDokumenResponse])
def get_all_arsip(skip: int = 0, limit: int = 100, search: str = "", db: Session = Depends(database.get_db)):
    query = db.query(models.ArsipDokumen)
    if search:
        query = query.filter(models.ArsipDokumen.nama_pemilik.contains(search) | models.ArsipDokumen.nomor_surat.contains(search))
    return query.offset(skip).limit(limit).all()

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_arsip(id: int, db: Session = Depends(database.get_db)):
    arsip = db.query(models.ArsipDokumen).filter(models.ArsipDokumen.id == id).first()
    if not arsip:
        raise HTTPException(status_code=404, detail="Arsip tidak ditemukan")
    
    # Hapus file fisik dari folder uploads
    if os.path.exists(arsip.file_path):
        os.remove(arsip.file_path)
        
    db.delete(arsip)
    db.commit()
    return {"message": "Arsip dan file fisik berhasil dihapus"}

@router.post("/backup", status_code=status.HTTP_200_OK)
def backup_arsip(provider: str, db: Session = Depends(database.get_db)):
    if provider not in ["drive", "spreadsheet"]:
        raise HTTPException(status_code=400, detail="Pilihan provider hanya 'drive' atau 'spreadsheet'")
    
    # TAMBAHKAN INI: Cek apakah ada data di database
    semua_arsip = db.query(models.ArsipDokumen).all()
    if not semua_arsip:
        raise HTTPException(status_code=400, detail="Data arsip kosong, tidak ada yang bisa di-backup.")

    try:
        if provider == "drive":
            # Kompres folder uploads menjadi file zip sementara
            zip_filename = f"Backup_Arsip_{date.today().strftime('%Y%m%d')}.zip"
            zip_path = os.path.join(tempfile.gettempdir(), zip_filename.replace('.zip', ''))
            
            shutil.make_archive(zip_path, 'zip', UPLOAD_DIR)
            final_zip = zip_path + '.zip'
            
            # Upload file zip ke Google Drive (menggunakan Folder ID dari screenshot)
            FOLDER_ID = "1483gJK6jaNL266Z3Y20qXbuWYMz8ZN6EZMW8C3_H6RU"
            link = google_service.upload_to_drive(final_zip, zip_filename, folder_id=FOLDER_ID)
            
            if os.path.exists(final_zip):
                os.remove(final_zip)
                
            return {"message": "Data arsip berhasil dicadangkan ke Google Drive", "status": "success", "link": link}
            
        elif provider == "spreadsheet":
            # Ambil semua metadata arsip dari database
            semua_arsip = db.query(models.ArsipDokumen).all()
            data_export = []
            for arsip in semua_arsip:
                data_export.append({
                    "No": arsip.id,
                    "Nama Dokumen": arsip.nama_pemilik,
                    "Kategori": arsip.jenis_dokumen,
                    "Nomor Surat": arsip.nomor_surat,
                    "Tanggal": str(arsip.tanggal_dokumen),
                    "Link Gdrive": arsip.file_path,
                })
                
            # Sinkronkan ke Google Spreadsheet (menggunakan Spreadsheet ID dari screenshot)
            SPREADSHEET_ID = "1483gJK6jaNL266Z3Y20qXbuWYMz8ZN6EZMW8C3_H6RU"
            link = google_service.create_or_update_spreadsheet(SPREADSHEET_ID, data_export)
            
            return {"message": "Data arsip berhasil dicadangkan ke Google Spreadsheet", "status": "success", "link": link}
            
    except Exception as e:
        print(f"DEBUG ERROR: {str(e)}") # Ini akan memunculkan error detail di terminal
        raise HTTPException(status_code=500, detail=str(e)) # Mengirim error ke Frontend