'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, UploadCloud, Eye, Download, Trash2, X, FileText, Camera, Calendar, RefreshCw, Wand2, Cloud } from 'lucide-react';
import { jsPDF } from 'jspdf';

const API_URL = 'http://127.0.0.1:8001/arsip';

export default function ArsipDokumenPage() {
  const [arsip, setArsip] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedArsip, setSelectedArsip] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
      tanggal: '', nomor: '', nama_pemilik: '', kategori: '', tipe: 'Surat Masuk'
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/`);
      const mappedData = response.data.map((item: any) => ({
        id: item.id,
        pemilik: item.nama_pemilik,
        nama: item.nama_pemilik, 
        kategori: item.jenis_dokumen,
        nomor: item.nomor_surat,
        tanggal: item.tanggal_dokumen,
        tipe: 'Surat Masuk', 
        file_path: item.file_path
      }));
      setArsip(mappedData);
    } catch (error) {
      console.error("Gagal load arsip dari backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveUpload = async () => {
    if (!selectedFile) {
      alert("Harap pilih file dokumen terlebih dahulu!");
      return;
    }
    try {
      const dataToSend = new FormData();
      dataToSend.append('nama_pemilik', formData.nama_pemilik);
      dataToSend.append('jenis_dokumen', formData.kategori);
      dataToSend.append('nomor_surat', formData.nomor);
      if (formData.tanggal) dataToSend.append('tanggal_dokumen', formData.tanggal);
      dataToSend.append('file', selectedFile);

      await axios.post(`${API_URL}/`, dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsUploadOpen(false);
      setSelectedFile(null); 
      setFormData({ tanggal: '', nomor: '', nama_pemilik: '', kategori: '', tipe: 'Surat Masuk' }); 
      fetchData(); 
      alert("Dokumen berhasil diunggah dan disimpan di database!");
    } catch (error: any) {
      console.error("Gagal simpan upload:", error);
      alert("Gagal simpan dokumen: " + (error.response?.data?.detail || error.message));
    }
  };

  const handleBackupCloud = async () => {
    try {
      alert("Sedang memproses Sinkronisasi ke Spreadsheet. Mohon tunggu...");
      const response = await axios.post(`${API_URL}/backup?provider=spreadsheet`);
      if (response.status === 200) {
        alert("🚀 Backup Berhasil!\n" + response.data.message);
      }
    } catch (error: any) {
      console.error("Gagal koneksi backup:", error);
      alert("Gagal backup: " + (error.response?.data?.detail || "Periksa terminal backend."));
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedArsip.id}`);
      setIsDeleteOpen(false);
      fetchData();
      alert("Arsip beserta file fisiknya berhasil dihapus.");
    } catch (error) {
      console.error("Gagal hapus arsip:", error);
      alert("Gagal menghapus arsip!");
    }
  };

  const startCamera = async () => {
    setIsScannerOpen(true);
    setCapturedImage(null);
    setRawImage(null);
    setIsFiltered(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { alert("Akses kamera ditolak."); setIsScannerOpen(false); }
  };
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsScannerOpen(false);
  };
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgUrl = canvas.toDataURL('image/jpeg', 0.9);
      setRawImage(imgUrl);
      setCapturedImage(imgUrl);
    }
  };
  const toggleDocumentFilter = () => {
    if (!rawImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      if (!isFiltered) {
        if (ctx) ctx.filter = 'grayscale(100%) contrast(150%) brightness(110%)';
      } else {
        if (ctx) ctx.filter = 'none';
      }
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL('image/jpeg', 0.9));
      setIsFiltered(!isFiltered);
    };
    img.src = rawImage;
  };
  
  const saveToPDF = () => {
    if (capturedImage) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(capturedImage);
      const imgRatio = imgProps.width / imgProps.height;
      const pdfRatio = pdfWidth / pdfHeight;
      let finalWidth, finalHeight;
      
      if (imgRatio > pdfRatio) {
         finalWidth = pdfWidth;
         finalHeight = pdfWidth / imgRatio;
      } else {
         finalHeight = pdfHeight;
         finalWidth = pdfHeight * imgRatio;
      }
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(capturedImage, 'JPEG', x, y, finalWidth, finalHeight);
      
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `Scan_Arsip_${Date.now()}.pdf`, { type: 'application/pdf' });
      
      setSelectedFile(file);
      setIsUploadOpen(true);
      stopCamera();
    }
  };

  const handleDownloadSurat = (data: any) => {
    if (!data) return;
    const doc = new jsPDF('p', 'mm', 'a4');
    const img = new Image();
    img.src = '/logo-sidoarjo.png';
    
    const renderPDF = () => {
      try { doc.addImage(img, 'PNG', 25, 15, 22, 22); } catch (e) { console.error("Logo error", e); }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('PEMERINTAH DESA JIMBARAN KULON', 115, 23, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('Kecamatan Wonoayu, Kabupaten Sidoarjo', 115, 29, { align: 'center' });
      doc.setLineWidth(1);
      doc.line(20, 38, 190, 38);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('SURAT KETERANGAN', 105, 52, { align: 'center' });
      doc.text(`Nomor: ${data.nomor || '-'}`, 105, 58, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('Yang bertanda tangan di bawah ini menerangkan bahwa:', 20, 75);
      const startY = 90;
      doc.text('Nama Pemilik', 30, startY);
      doc.text(`: ${data.pemilik || '-'}`, 70, startY);
      doc.text('Kategori', 30, startY + 10);
      doc.text(`: ${data.kategori || '-'}`, 70, startY + 10);
      doc.text('Tanggal Rekam', 30, startY + 20);
      doc.text(`: ${data.tanggal || '-'}`, 70, startY + 20);
      doc.save(`${data.nama}_${data.pemilik}.pdf`);
    };
    img.onload = renderPDF;
    img.onerror = renderPDF;
  };

  const filteredArsip = arsip.filter((item) => {
    const matchesTab = activeTab === 'Semua' || item.tipe === activeTab;
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || item.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) setSelectedFile(event.target.files[0]);
  };
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => { event.preventDefault(); setIsDragging(true); };
  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => { event.preventDefault(); setIsDragging(true); };
  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => { event.preventDefault(); setIsDragging(false); };
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };
  const cancelFile = (event: React.MouseEvent) => {
    event.stopPropagation(); setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1E293B]">Arsip Dokumen</h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Penyimpanan digital administrasi desa.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <button onClick={handleBackupCloud} className="w-full sm:w-auto justify-center flex items-center gap-2 bg-[#9333EA] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-800 transition shadow-lg shadow-purple-900/20">
            <Cloud className="w-4 h-4" /> Backup Cloud
          </button>
          <button onClick={() => setIsUploadOpen(true)} className="w-full sm:w-auto justify-center flex items-center gap-2 bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
            <UploadCloud className="w-4 h-4" /> Upload Dokumen
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full">
        
        {/* TAB MELUBER (SCROLLABLE) DI MOBILE */}
        <div className="flex border-b border-gray-100 px-4 md:px-5 pt-3 gap-4 md:gap-6 bg-slate-50/50 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {['Semua', 'Surat Masuk', 'Surat Keluar'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-xs md:text-sm font-bold border-b-2 transition-all shrink-0 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari dokumen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:border-blue-500 transition-all"/>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50/50 text-[10px] md:text-xs uppercase font-extrabold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4">No</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[#1D4ED8]">Pemilik Dokumen</th>
                <th className="px-4 md:px-6 py-3 md:py-4">Kategori</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-center">No Surat</th>
                <th className="px-4 md:px-6 py-3 md:py-4">Tipe</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs md:text-sm font-medium">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Memuat data...</td></tr>
              ) : filteredArsip.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Belum ada arsip dokumen</td></tr>
              ) : (
                filteredArsip.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-slate-50/50">
                    <td className="px-4 md:px-6 py-3 md:py-4 text-gray-500">{index + 1}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-gray-900">{item.pemilik}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600">{item.kategori}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-gray-700 text-center">{item.nomor}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className={`px-2 py-1 md:py-1.5 rounded-md md:rounded-lg text-[9px] md:text-[10px] font-bold uppercase whitespace-nowrap ${item.tipe === 'Surat Masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{item.tipe}</span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 flex justify-center gap-1 md:gap-2">
                      <button onClick={() => { setSelectedArsip(item); setIsViewOpen(true); }} className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleDownloadSurat(item)} className="p-1.5 md:p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"><Download className="w-4 h-4" /></button>
                      <button onClick={() => { setSelectedArsip(item); setIsDeleteOpen(true); }} className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL UPLOAD */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-[95%] sm:w-full max-w-lg shadow-2xl overflow-hidden my-auto">
            <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 flex justify-between items-center"><h3 className="font-extrabold text-lg md:text-xl text-gray-900">Upload Arsip Baru</h3><button onClick={() => setIsUploadOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5 md:w-6 md:h-6" /></button></div>
            <div className="p-4 md:p-6 space-y-4 max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
              
              {selectedFile && (
                <div className="flex items-center gap-3 md:gap-4 bg-blue-50 border border-blue-200 p-3 md:p-4 rounded-xl">
                  <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-500 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs md:text-sm font-bold text-gray-900 truncate">{selectedFile.name}</p>
                    <p className="text-[10px] md:text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={cancelFile} className="p-1 text-gray-400 hover:text-red-500 transition"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
                </div>
              )}

              {!selectedFile && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                  <div onClick={() => fileInputRef.current?.click()} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop} className={`border-2 border-dashed rounded-xl p-4 md:p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-white'}`}>
                     <UploadCloud className={`w-6 h-6 md:w-8 md:h-8 mb-2 ${isDragging ? 'text-blue-600 animate-pulse' : 'text-blue-500'}`} />
                     <p className={`text-xs md:text-sm font-bold ${isDragging ? 'text-blue-700' : 'text-gray-700'}`}>{isDragging ? 'Lepas Sini' : 'Pilih File'}</p>
                  </div>
                  <div onClick={() => { setIsUploadOpen(false); startCamera(); }} className="border-2 border-blue-100 bg-blue-50 rounded-xl p-4 md:p-6 text-center hover:border-blue-400 transition cursor-pointer flex flex-col items-center justify-center">
                     <Camera className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mb-2" />
                     <p className="text-xs md:text-sm font-bold text-blue-700">Scan Kamera</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1"><Calendar className="w-4 h-4"/> Tanggal</label><input type="date" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm text-gray-900 outline-none bg-gray-50" /></div>
                <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1"><FileText className="w-4 h-4"/> No Surat</label><input type="text" value={formData.nomor} onChange={(e) => setFormData({...formData, nomor: e.target.value})} placeholder="470/..." className="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50" /></div>
              </div>
              <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">Nama Pemilik / Dokumen</label><input type="text" value={formData.nama_pemilik} onChange={(e) => setFormData({...formData, nama_pemilik: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50" placeholder="Nama dokumen" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">Kategori</label>
                  <input list="kategori-list" value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm text-gray-900 outline-none bg-gray-50" placeholder="Pilih..." />
                  <datalist id="kategori-list"><option value="Kependudukan" /><option value="Sosial" /><option value="Legalitas" /></datalist>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">Tipe Surat</label>
                  <select value={formData.tipe} onChange={(e) => setFormData({...formData, tipe: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm text-gray-900 outline-none bg-gray-50">
                    <option value="Surat Masuk">Surat Masuk</option><option value="Surat Keluar">Surat Keluar</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-4 md:px-6 py-4 md:py-5 flex flex-col sm:flex-row justify-end gap-2 md:gap-3 border-t border-gray-100">
              <button onClick={() => setIsUploadOpen(false)} className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-gray-600 border rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={handleSaveUpload} className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-800">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW */}
      {isViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 md:p-4">
          <div className="bg-white rounded-2xl w-[95%] sm:w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh]">
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white"><h3 className="font-extrabold text-[#1E293B] text-lg md:text-xl">Detail Dokumen</h3><button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5 md:w-6 md:h-6" /></button></div>
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
              {/* Kolom Kiri - Mockup Surat */}
              <div className="w-full md:w-1/2 bg-slate-50 p-4 md:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                 <div className="w-full max-w-[280px] md:max-w-sm bg-white shadow-lg border border-gray-200 p-6 md:p-8 flex flex-col aspect-[3/4]">
                    <div className="border-b-[2px] md:border-b-[3px] border-black pb-2 md:pb-4 mb-3 md:mb-5 flex items-center gap-2 md:gap-4">
                       <img src="/logo-sidoarjo.png" alt="Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                       <div className="flex-1 text-center pr-2 md:pr-4"><h4 className="font-extrabold text-[10px] md:text-[12px] uppercase text-black leading-tight">Pemerintah Desa<br/>Jimbaran Kulon</h4><p className="text-[8px] md:text-[10px] text-black font-medium mt-0.5 md:mt-1">Kec. Wonoayu, Sidoarjo</p></div>
                    </div>
                    <div className="flex-1 text-gray-900 space-y-3 md:space-y-4">
                       <div className="text-center mb-4 md:mb-6"><p className="font-bold text-black text-[10px] md:text-[12px] uppercase">Surat Keterangan</p><p className="font-bold text-black text-[10px] md:text-[12px]">Nomor: {selectedArsip?.nomor}</p></div>
                       <p className="text-[9px] md:text-[11px] leading-relaxed mb-3 md:mb-4 text-justify">Dokumen yang diarsipkan milik:</p>
                       <div className="grid grid-cols-3 gap-1 md:gap-2 ml-2 md:ml-4 text-[9px] md:text-[11px]">
                         <div className="text-gray-700">Nama</div><div className="col-span-2 font-bold text-black truncate">: {selectedArsip?.pemilik}</div>
                         <div className="text-gray-700">Kategori</div><div className="col-span-2 font-bold text-black">: {selectedArsip?.kategori}</div>
                         <div className="text-gray-700">Tanggal</div><div className="col-span-2 text-black">: {selectedArsip?.tanggal}</div>
                       </div>
                    </div>
                 </div>
              </div>
              {/* Kolom Kanan - Data Tersimpan */}
              <div className="w-full md:w-1/2 p-5 md:p-8 space-y-6 md:space-y-8 bg-white">
                 <div>
                   <h4 className="flex items-center gap-2 font-bold text-[#1D4ED8] text-sm md:text-base mb-4 md:mb-6 border-b border-gray-100 pb-3"><FileText className="w-4 h-4 md:w-5 md:h-5" /> Data Tersimpan</h4>
                   <div className="space-y-4 text-xs md:text-sm font-medium">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4"><span className="text-gray-500">Pemilik</span><span className="sm:col-span-2 font-bold text-gray-950 break-words">{selectedArsip?.pemilik}</span></div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4"><span className="text-gray-500">Nomor</span><span className="sm:col-span-2 font-bold text-gray-950">{selectedArsip?.nomor}</span></div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4"><span className="text-gray-500">Kategori</span><span className="sm:col-span-2 font-bold text-gray-900">{selectedArsip?.kategori}</span></div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4"><span className="text-gray-500">Sistem Path</span><span className="sm:col-span-2 text-gray-700 leading-relaxed font-mono text-[10px] md:text-xs p-2 bg-gray-100 rounded-md break-all">{selectedArsip?.file_path}</span></div>
                   </div>
                 </div>
              </div>
            </div>
            <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white border-t border-gray-100">
              <button onClick={() => setIsViewOpen(false)} className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 transition shadow-sm">Kembali</button>
              <div className="flex w-full sm:w-auto gap-2 md:gap-3">
                <button onClick={() => handleDownloadSurat(selectedArsip)} className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 md:px-6 py-2.5 text-sm font-bold text-white bg-[#1D4ED8] rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-900/20"><Download className="w-4 h-4" /> Cetak</button>
                <button onClick={() => { setIsViewOpen(false); setIsDeleteOpen(true); }} className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 md:px-6 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-900/20"><Trash2 className="w-4 h-4" /> Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE & SCANNER TETAP (Sudah aman, tidak perlu banyak perombakan struktur grid) */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in duration-200">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-7 h-7 md:w-8 md:h-8" /></div>
            <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-2">Hapus Arsip?</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-6">Yakin menghapus arsip <span className="font-bold text-gray-800">{selectedArsip?.pemilik}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100">Batal</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {isScannerOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-between print-hide">
           <div className="p-4 md:p-5 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
              <button onClick={stopCamera} className="text-white hover:text-red-400 bg-black/50 p-2 rounded-full"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
              <span className="text-white font-bold tracking-widest text-xs md:text-sm">SCAN DOKUMEN</span>
              <div className="w-10"></div>
           </div>
           <div className="relative flex-1 flex items-center justify-center overflow-hidden">
              {!capturedImage ? (
                <><video ref={videoRef} autoPlay playsInline className="absolute w-full h-full object-cover" />
                  <div className="absolute inset-8 md:inset-x-32 md:inset-y-16 border-2 border-white/40 rounded-lg pointer-events-none flex flex-col items-center justify-center">
                     <div className="absolute top-0 left-0 w-8 h-8 md:w-10 md:h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                     <div className="absolute top-0 right-0 w-8 h-8 md:w-10 md:h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                     <div className="absolute bottom-0 left-0 w-8 h-8 md:w-10 md:h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                     <div className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                  </div>
                </>
              ) : (<img src={capturedImage} alt="Captured" className="max-w-full max-h-full object-contain" />)}
              <canvas ref={canvasRef} className="hidden" />
           </div>
           <div className="p-6 md:p-8 pb-10 md:pb-12 bg-black z-10">
              {!capturedImage ? (
                <div className="flex justify-center"><button onClick={takePhoto} className="w-16 h-16 md:w-20 md:h-20 border-4 border-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"><div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full"></div></button></div>
              ) : (
                <div className="space-y-4 md:space-y-6 max-w-md mx-auto">
                  <button onClick={toggleDocumentFilter} className={`w-full py-2.5 md:py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition ${isFiltered ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-white border-gray-600'}`}><Wand2 className="w-4 h-4 md:w-5 md:h-5" />{isFiltered ? 'Efek: B&W Aktif' : 'Efek: Asli'}</button>
                  <div className="flex gap-3 md:gap-4">
                    <button onClick={() => setCapturedImage(null)} className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 md:py-3 text-white text-xs md:text-sm font-bold hover:text-blue-400 transition"><RefreshCw className="w-5 h-5 md:w-6 md:h-6 mb-1" /> Ulangi</button>
                    <button onClick={saveToPDF} className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 md:py-3 bg-[#1D4ED8] text-white text-xs md:text-sm font-bold rounded-2xl hover:bg-blue-700 transition"><Download className="w-5 h-5 md:w-6 md:h-6 mb-1" /> Gunakan File</button>
                  </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}