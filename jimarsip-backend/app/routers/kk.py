from fastapi import APIRouter
from pydantic import BaseModel

# Ini adalah 'cetakan' yang memberitahu FastAPI data apa yang akan dikirim dari React
class KKCreate(BaseModel):
    no_kk: str
    kepala: str
    nik_kepala: str

router = APIRouter(
    prefix="/kk",
    tags=["Kartu Keluarga"]
)

# GET: Mengambil data
@router.get("/")
def get_all_kk():
    # Nanti ini diganti dengan query SQLite db.query(models.KK).all()
    return [
        { "id": 1, "no_kk": "3515110101010010", "kepala": "Budi Santoso", "nik_kepala": "3515110101010001" },
        { "id": 2, "no_kk": "3515110101010025", "kepala": "Ahmad Subagyo", "nik_kepala": "3515110101010003" }
    ]

# POST: Menyimpan data
@router.post("/")
def create_kk(data: KKCreate):
    # FastAPI sekarang tahu bahwa 'data' harus berisi no_kk, kepala, dan nik_kepala
    # Data ini sukses diterima dan siap dimasukkan ke database SQLite
    return {"message": "Data KK berhasil ditambahkan!", "data": data}

# DELETE: Menghapus data
@router.delete("/{kk_id}")
def delete_kk(kk_id: int):
    return {"message": f"Data KK dengan ID {kk_id} berhasil dihapus!"}