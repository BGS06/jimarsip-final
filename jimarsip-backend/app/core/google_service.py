import os
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import gspread

# Tentukan scope yang diizinkan untuk akses Google API
SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets'
]

# Path ke file kredensial
CREDENTIALS_FILE = os.path.join(os.getcwd(), "credentials.json")

def get_credentials():
    """Mengambil kredensial Google Service Account dari credentials.json."""
    if not os.path.exists(CREDENTIALS_FILE):
        raise FileNotFoundError(
            f"Kredensial Google Service Account tidak ditemukan! Harap letakkan file "
            f"service account Anda dengan nama '{CREDENTIALS_FILE}' di folder root backend."
        )
    
    return Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)

def upload_to_drive(file_path: str, file_name: str, folder_id: str = None) -> str:
    """
    Mengunggah file ke Google Drive menggunakan Service Account.
    CATATAN: Karena Service Account memiliki kuota 0 Byte pada Drive personal,
    folder_id harus merujuk ke folder di dalam Shared Drive (Drive Bersama) 
    dimana Service Account telah diberi akses sebagai Kontributor/Editor.
    """
    credentials = get_credentials()
    service = build('drive', 'v3', credentials=credentials)

    file_metadata = {'name': file_name}
    if folder_id:
        file_metadata['parents'] = [folder_id]

    media = MediaFileUpload(file_path, resumable=True)
    
    # Upload file (supportsAllDrives=True wajib diaktifkan untuk Shared Drive)
    uploaded_file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id, webViewLink',
        supportsAllDrives=True
    ).execute()
    
    return uploaded_file.get('webViewLink')

def create_or_update_spreadsheet(spreadsheet_id: str, data: list):
    """Memperbarui data di dalam Google Spreadsheet yang sudah ada."""
    credentials = get_credentials()
    # gspread mempermudah manipulasi google spreadsheet
    client = gspread.authorize(credentials)
    
    try:
        # Buka spreadsheet menggunakan ID-nya
        sheet = client.open_by_key(spreadsheet_id).sheet1
        # Hapus konten lama untuk ditimpa (Sync)
        sheet.clear()
    except gspread.exceptions.SpreadsheetNotFound:
        raise Exception(f"Spreadsheet dengan ID {spreadsheet_id} tidak ditemukan.")
        
    # Memasukkan header jika data tidak kosong
    if data:
        # Ambil nama-nama kolom dari dictionary pertama
        headers = list(data[0].keys())
        # Susun data dalam bentuk baris (list of lists)
        rows = [headers]
        for item in data:
            rows.append([str(item.get(h, "")) for h in headers])
            
        # Update sheet dari sel A1
        sheet.update(values=rows, range_name='A1')
        
    return sheet.spreadsheet.url
