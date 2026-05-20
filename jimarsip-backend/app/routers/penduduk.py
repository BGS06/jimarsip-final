from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(prefix="/penduduk", tags=["Data Penduduk"])

@router.post("/", response_model=schemas.PendudukResponse, status_code=status.HTTP_201_CREATED)
def create_penduduk(penduduk: schemas.PendudukCreate, db: Session = Depends(database.get_db)):
    # Cek duplikasi NIK
    db_penduduk = db.query(models.Penduduk).filter(models.Penduduk.nik == penduduk.nik).first()
    if db_penduduk:
        raise HTTPException(status_code=400, detail="NIK sudah terdaftar")
    
    # Pydantic v2 menggunakan model_dump()
    new_penduduk = models.Penduduk(**penduduk.model_dump())
    db.add(new_penduduk)
    db.commit()
    db.refresh(new_penduduk)
    return new_penduduk

@router.get("/", response_model=List[schemas.PendudukResponse])
def get_all_penduduk(skip: int = 0, limit: int = 100, search: str = "", db: Session = Depends(database.get_db)):
    query = db.query(models.Penduduk)
    
    # Logika pencarian berdasarkan Nama atau NIK
    if search:
        query = query.filter(models.Penduduk.nama.contains(search) | models.Penduduk.nik.contains(search))
        
    return query.offset(skip).limit(limit).all()

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_penduduk(id: int, db: Session = Depends(database.get_db)):
    penduduk = db.query(models.Penduduk).filter(models.Penduduk.id == id).first()
    if not penduduk:
        raise HTTPException(status_code=404, detail="Data penduduk tidak ditemukan")
    
    db.delete(penduduk)
    db.commit()
    return {"message": "Data berhasil dihapus"}