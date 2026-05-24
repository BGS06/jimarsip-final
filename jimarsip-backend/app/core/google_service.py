import os
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import gspread
import traceback

# Scope API
SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets'
]

# PERBAIKAN PATH: Menggunakan path absolut relatif terhadap file ini
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CREDENTIALS_FILE = os.path.join(BASE_DIR, "credentials.json")

def get_credentials():
    print(f"DEBUG: Mencari file di: {CREDENTIALS_FILE}") # Tambahkan ini
    if not os.path.exists(CREDENTIALS_FILE):
        raise FileNotFoundError(f"File kredensial tidak ditemukan di: {CREDENTIALS_FILE}")
    
    # Tambahkan print ini untuk memastikan file bisa terbaca
    print("DEBUG: File ditemukan, mencoba autentikasi...") 
    return Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)

def upload_to_drive(file_path: str, file_name: str, folder_id: str = None) -> str:
    credentials = get_credentials()
    service = build('drive', 'v3', credentials=credentials)

    file_metadata = {'name': file_name}
    if folder_id:
        file_metadata['parents'] = [folder_id]

    media = MediaFileUpload(file_path, resumable=True)
    uploaded_file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id, webViewLink',
        supportsAllDrives=True
    ).execute()
    return uploaded_file.get('webViewLink')

def create_or_update_spreadsheet(spreadsheet_id: str, data: list):
    credentials = get_credentials()
    client = gspread.authorize(credentials)
    
    try:
        spreadsheet = client.open_by_key(spreadsheet_id)
        sheet = spreadsheet.sheet1
        sheet.clear()
        
        # Pengecekan data aman
        if data and len(data) > 0:
            headers = list(data[0].keys())
            rows = [headers]
            for item in data:
                # Memastikan data diambil dengan aman
                rows.append([str(item.get(h, "")) for h in headers])
            
            sheet.update('A1', rows)
            
        return spreadsheet.url
    except Exception as e:
        import traceback
        traceback.print_exc() # Menampilkan error asli di terminal
        raise Exception(f"Gagal sinkronisasi: {str(e)}")