// Lokasi file: app/api/backup/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dataArsip = body.data;

    // 1. Membaca file kredensial JSON yang tadi kamu download
    const keyPath = path.join(process.cwd(), 'google-key.json');
    
    // 2. Autentikasi dengan Google
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // 👉 GANTI DENGAN SPREADSHEET ID KAMU:
    const spreadsheetId = '1483gJK6jaNL266Z3Y20qXbuWYMz8ZN6EZMW8C3_H6RU'; 

    // 3. Format data dari Frontend ke bentuk baris Excel
    const rows = dataArsip.map((item: any, index: number) => [
      index + 1,
      item.pemilik,
      item.nama,
      item.kategori,
      item.nomor,
      item.tanggal,
      item.tipe
    ]);

    // 4. Kita bersihkan sheet lama dulu biar nggak numpuk ganda (Opsional)
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: 'Sheet1!A2:G', // Menghapus baris 2 ke bawah, menyisakan Header di baris 1
    });

    // 5. Masukkan data terbaru ke Spreadsheet
    if (rows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A2',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: rows },
      });
    }

    return NextResponse.json({ message: 'Backup berhasil ditulis ke Spreadsheet!' }, { status: 200 });
  } catch (error: any) {
    console.error('Google Sheets API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}