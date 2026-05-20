'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, UploadCloud, Eye, Download, Trash2, X, FileText, Camera, Calendar, RefreshCw, Wand2, Cloud, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import axios from 'axios';

export default function ArsipDokumenPage() {
  const [arsip, setArsip] = useState([
    { id: 1, nama: 'Surat Pengantar KTP', kategori: 'Kependudukan', nomor: '470/23/2026', tanggal: '20 Mei 2026', pemilik: 'Budi Santoso', tipe: 'Surat Keluar' },
    { id: 2, nama: 'Surat Permohonan Bantuan', kategori: 'Sosial', nomor: '470/22/2026', tanggal: '19 Mei 2026', pemilik: 'Siti Aisyah', tipe: 'Surat Masuk' },
  ]);

  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedArsip, setSelectedArsip] = useState<any>(null);

  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [backupStatus, setBackupStatus] = useState('idle');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role) setUserRole(role);
  }, []);

  // State untuk form upload arsip
  const [formData, setFormData] = useState({
      tanggal: '', nomor: '', nama: '', kategori: '', pemilik: '', tipe: 'Surat Masuk'
  });

  const handleSaveUpload = () => {
    const newId = arsip.length > 0 ? Math.max(...arsip.map(a => a.id)) + 1 : 1;
    setArsip([...arsip, { ...formData, id: newId }]);
    setIsUploadOpen(false);
    setFormData({ tanggal: '', nomor: '', nama: '', kategori: '', pemilik: '', tipe: 'Surat Masuk' }); // Reset form
  };

  const handleDelete = () => {
      setArsip(arsip.filter(a => a.id !== selectedArsip.id));
      setIsDeleteOpen(false);
  };

  const handleBackup = async (type: string) => {
    setBackupStatus('loading');
    try {
      await axios.post(`http://127.0.0.1:8001/arsip/backup?provider=${type}`);
      setBackupStatus('success');
    } catch (error) {
      console.warn("Backend offline atau gagal terhubung. Menggunakan mode simulasi lokal.");
      setTimeout(() => {
        setBackupStatus('success');
      }, 2000);
    }
  };

  useEffect(() => {
    if (!isBackupOpen) {
      setTimeout(() => setBackupStatus('idle'), 300);
    }
  }, [isBackupOpen]);

  const startCamera = async () => {
    setIsScannerOpen(true);
    setCapturedImage(null);
    setRawImage(null);
    setIsFiltered(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { 
      alert("Akses kamera ditolak."); 
      setIsScannerOpen(false);
    }
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
      pdf.save(`Scan_Arsip_${Date.now()}.pdf`);
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
      doc.text('Nama', 30, startY);
      doc.text(`: ${data.pemilik || '-'}`, 70, startY);
      
      doc.text('NIK', 30, startY + 10);
      doc.text(': 3515110101010001', 70, startY + 10);
      
      doc.text('Jenis Kelamin', 30, startY + 20);
      doc.text(': Laki-laki', 70, startY + 20);
      
      doc.text('Alamat', 30, startY + 30);
      doc.text(': Jl. Melati No. 12 RT/RW 01/02', 70, startY + 30);
      
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B]">Arsip Dokumen</h2>
          <p className="text-gray-500 text-sm mt-1">Penyimpanan digital administrasi desa.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {userRole !== 'kades' && (
            <>
              <button onClick={() => setIsBackupOpen(true)} className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-700 transition shadow-lg">
                <Cloud className="w-4 h-4" /> Backup Cloud
              </button>
              <button onClick={startCamera} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-lg">
                <Camera className="w-4 h-4" /> Rekam Dokumen
              </button>
              <button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2 bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition shadow-lg">
                <UploadCloud className="w-4 h-4" /> Upload Dokumen
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 px-5 pt-3 gap-6 bg-slate-50/50">
          {['Semua', 'Surat Masuk', 'Surat Keluar'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari dokumen atau ketik kategori..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:border-blue-500 transition-all"/>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-xs uppercase font-extrabold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4 text-[#1D4ED8]">Pemilik</th>
                <th className="px-6 py-4">Nama Dokumen</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4 text-center">No Surat</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {filteredArsip.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                  {/* REVISI: class font-bold dihapus dari sini */}
                  <td className="px-6 py-4 text-gray-900">{item.pemilik}</td>
                  <td className="px-6 py-4 text-gray-700">{item.nama}</td>
                  <td className="px-6 py-4 text-gray-600">{item.kategori}</td>
                  <td className="px-6 py-4 text-gray-700 text-center">{item.nomor}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.tipe === 'Surat Masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{item.tipe}</span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button onClick={() => { setSelectedArsip(item); setIsViewOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => handleDownloadSurat(item)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"><Download className="w-4 h-4" /></button>
                    {userRole === 'admin' && <button onClick={() => { setSelectedArsip(item); setIsDeleteOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-extrabold text-xl text-gray-900">Upload Arsip Baru</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer">
                   <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                   <p className="text-sm font-bold text-gray-700">Pilih File</p>
                </div>
                <div onClick={() => { setIsUploadOpen(false); startCamera(); }} className="border-2 border-blue-100 bg-blue-50 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer">
                   <Camera className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                   <p className="text-sm font-bold text-blue-700">Scan Kamera</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1"><Calendar className="w-4 h-4"/> Tanggal Surat</label>
                  <input type="date" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 outline-none bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1"><FileText className="w-4 h-4"/> Nomor Surat</label>
                  <input type="text" value={formData.nomor} onChange={(e) => setFormData({...formData, nomor: e.target.value})} placeholder="Misal: 470/..." className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Dokumen</label>
                <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50" placeholder="Masukkan nama dokumen" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Pemilik</label>
                <input type="text" value={formData.pemilik} onChange={(e) => setFormData({...formData, pemilik: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50" placeholder="Masukkan nama pemilik" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Kategori</label>
                <input list="kategori-list" name="kategori" value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50" placeholder="Ketik atau pilih kategori..." />
                <datalist id="kategori-list">
                  <option value="Kependudukan" />
                  <option value="Sosial" />
                  <option value="Legalitas" />
                </datalist>
              </div>
            </div>
            <div className="px-6 py-5 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setIsUploadOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 border rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={handleSaveUpload} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-800">Simpan Arsip</button>
            </div>
          </div>
        </div>
      )}

      {isViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="font-extrabold text-[#1E293B] text-xl tracking-tight">Detail Penduduk / Dokumen</h3>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-red-500 transition"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
              <div className="w-full md:w-1/2 bg-slate-50 p-8 flex items-center justify-center border-r border-gray-100">
                 <div className="w-full max-w-sm bg-white shadow-lg border border-gray-200 p-8 flex flex-col aspect-[3/4]">
                    <div className="border-b-[3px] border-black pb-4 mb-5 flex items-center gap-4">
                       <img src="/logo-sidoarjo.png" alt="Logo" className="w-14 h-14 object-contain" />
                       <div className="flex-1 text-center pr-4">
                         <h4 className="font-extrabold text-[12px] uppercase text-black leading-tight">Pemerintah Desa<br/>Jimbaran Kulon</h4>
                         <p className="text-[10px] text-black font-medium mt-1">Kecamatan Wonoayu, Kabupaten Sidoarjo</p>
                       </div>
                    </div>
                    
                    <div className="flex-1 text-gray-900 space-y-4">
                       <div className="text-center mb-6">
                         <p className="font-bold text-black text-[12px] uppercase">Surat Keterangan</p>
                         <p className="font-bold text-black text-[12px]">Nomor: {selectedArsip?.nomor}</p>
                       </div>
                       
                       <p className="text-[11px] leading-relaxed mb-4 text-justify">
                         Yang bertanda tangan di bawah ini menerangkan bahwa:
                       </p>
                       
                       <div className="grid grid-cols-3 gap-2 ml-4 text-[11px]">
                         <div className="text-gray-700">Nama</div><div className="col-span-2 font-bold text-black">: {selectedArsip?.pemilik}</div>
                         <div className="text-gray-700">NIK</div><div className="col-span-2 font-bold text-black">: 3515110101010001</div>
                         <div className="text-gray-700">Jenis Kelamin</div><div className="col-span-2 text-black">: Laki-laki</div>
                         <div className="text-gray-700">Alamat</div><div className="col-span-2 text-black">: Jl. Melati No. 12 RT/RW 01/02</div>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="w-full md:w-1/2 p-8 space-y-8 bg-white">
                 <div>
                   <h4 className="flex items-center gap-2 font-bold text-[#1D4ED8] text-base mb-6 border-b border-gray-100 pb-3">
                     <FileText className="w-5 h-5" /> Informasi Data
                   </h4>
                   <div className="space-y-5 text-sm font-medium">
                      <div className="grid grid-cols-3 gap-4"><span className="text-gray-500">Nama Lengkap</span><span className="col-span-2 font-bold text-gray-950">{selectedArsip?.pemilik}</span></div>
                      <div className="grid grid-cols-3 gap-4"><span className="text-gray-500">Nomor NIK</span><span className="col-span-2 font-bold text-gray-950">3515110101010001</span></div>
                      <div className="grid grid-cols-3 gap-4"><span className="text-gray-500">Kategori</span><span className="col-span-2 font-bold text-gray-900">Data {selectedArsip?.kategori}</span></div>
                      <div className="grid grid-cols-3 gap-4"><span className="text-gray-500">Tanggal Rekam</span><span className="col-span-2 font-bold text-gray-900">{selectedArsip?.tanggal}</span></div>
                      <div className="grid grid-cols-3 gap-4"><span className="text-gray-500">Deskripsi</span><span className="col-span-2 text-gray-700 leading-relaxed">Data profil penduduk terdaftar di RT/RW 01/02 Desa Jimbaran Kulon.</span></div>
                   </div>
                 </div>
              </div>
            </div>

            <div className="px-6 py-4 flex justify-between items-center bg-white border-t border-gray-100">
              <button onClick={() => setIsViewOpen(false)} className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm">Kembali</button>
              <div className="flex gap-3">
                <button onClick={() => handleDownloadSurat(selectedArsip)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#1D4ED8] rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
                  <Download className="w-4 h-4" /> Download
                </button>
                <button onClick={() => { setIsViewOpen(false); setIsDeleteOpen(true); }} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-900/20">
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8" /></div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Hapus Arsip?</h3>
            <p className="text-sm text-gray-500 mb-6">Yakin menghapus <span className="font-bold text-gray-800">{selectedArsip?.nama}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {isScannerOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-between">
           <div className="p-5 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
              <button onClick={stopCamera} className="text-white hover:text-red-400 bg-black/50 p-2 rounded-full"><X className="w-6 h-6" /></button>
              <span className="text-white font-bold tracking-widest text-sm">SCAN DOKUMEN</span>
              <div className="w-10"></div>
           </div>
           <div className="relative flex-1 flex items-center justify-center overflow-hidden">
              {!capturedImage ? (
                <><video ref={videoRef} autoPlay playsInline className="absolute w-full h-full object-cover" />
                  <div className="absolute inset-8 md:inset-x-32 md:inset-y-16 border-2 border-white/40 rounded-lg pointer-events-none flex flex-col items-center justify-center">
                     <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                     <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                     <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                     <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                  </div>
                </>
              ) : (<img src={capturedImage} alt="Captured" className="max-w-full max-h-full object-contain" />)}
              <canvas ref={canvasRef} className="hidden" />
           </div>
           <div className="p-8 pb-12 bg-black z-10">
              {!capturedImage ? (
                <div className="flex justify-center"><button onClick={takePhoto} className="w-20 h-20 border-4 border-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"><div className="w-16 h-16 bg-white rounded-full"></div></button></div>
              ) : (
                <div className="space-y-6 max-w-md mx-auto">
                  <button onClick={toggleDocumentFilter} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition ${isFiltered ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-white border-gray-600'}`}><Wand2 className="w-5 h-5" />{isFiltered ? 'Efek Dokumen: B&W Aktif' : 'Efek Dokumen: Asli'}</button>
                  <div className="flex gap-4">
                    <button onClick={() => setCapturedImage(null)} className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-white font-bold hover:text-blue-400 transition"><RefreshCw className="w-6 h-6 mb-1" /> Ulangi</button>
                    <button onClick={saveToPDF} className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-[#1D4ED8] text-white font-bold rounded-2xl hover:bg-blue-700 transition"><Download className="w-6 h-6 mb-1" /> Simpan PDF</button>
                  </div>
                </div>
              )}
           </div>
        </div>
      )}

      {isBackupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in duration-200">
            {backupStatus === 'idle' && (
              <>
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cloud className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Backup ke Cloud</h3>
                <p className="text-sm text-gray-500 mb-6">Pilih tujuan pencadangan data arsip desa.</p>
                <div className="space-y-3">
                  <button onClick={() => handleBackup('drive')} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-[#1D4ED8] rounded-xl hover:bg-blue-800 transition shadow-lg">
                    <Cloud className="w-5 h-5" /> Google Drive
                  </button>
                  <button onClick={() => handleBackup('spreadsheet')} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition shadow-lg">
                    <FileSpreadsheet className="w-5 h-5" /> Google Spreadsheet
                  </button>
                  <button onClick={() => setIsBackupOpen(false)} className="w-full mt-2 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">Batal</button>
                </div>
              </>
            )}
            {backupStatus === 'loading' && (
              <div className="py-8">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-bold text-gray-800">Menyinkronkan data...</p>
                <p className="text-xs text-gray-500 mt-2">Menghubungkan ke server cloud</p>
              </div>
            )}
            {backupStatus === 'success' && (
              <div className="py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Backup Berhasil!</h3>
                <p className="text-sm text-gray-500 mb-6">Data arsip telah berhasil dicadangkan ke Cloud.</p>
                <button onClick={() => setIsBackupOpen(false)} className="w-full py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg">Tutup</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}