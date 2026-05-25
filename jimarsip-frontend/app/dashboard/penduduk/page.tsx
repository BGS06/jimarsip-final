'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, FileDown, X, Download, FileText, Users, Home, MapPin, Image as ImageIcon } from 'lucide-react';

export default function DataPendudukPage() {
  const [penduduk, setPenduduk] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({ noKk: '', nik: '', nama: '', jk: '', alamat: '', rt: '' });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem('user_role');
    if (role) setUserRole(role);

    const savedData = localStorage.getItem('data_penduduk');
    if (savedData) {
      setPenduduk(JSON.parse(savedData));
    } else {
      setPenduduk([
        { id: 1, noKk: '3515110101010010', nik: '3515110101010001', nama: 'Budi Santoso', jk: 'Laki-laki', alamat: 'Jl. Melati No. 12', rt: '01/02', foto: null },
        { id: 2, noKk: '3515110101010010', nik: '3515110101010002', nama: 'Siti Aisyah', jk: 'Perempuan', alamat: 'Jl. Mawar No. 05', rt: '01/02', foto: null },
        { id: 3, noKk: '3515110101010025', nik: '3515110101010003', nama: 'Ahmad Subagyo', jk: 'Laki-laki', alamat: 'Jl. Kenanga No. 08', rt: '02/03', foto: null },
      ]);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('data_penduduk', JSON.stringify(penduduk));
    }
  }, [penduduk, isClient]);

  const handleExportPDF = () => window.print();

  const openAdd = () => {
    setFormData({ noKk: '', nik: '', nama: '', jk: '', alamat: '', rt: '' });
    setIsAddOpen(true);
  };

  const openEdit = (item: any) => {
    setSelectedData(item);
    setFormData({ noKk: item.noKk, nik: item.nik, nama: item.nama, jk: item.jk, alamat: item.alamat, rt: item.rt });
    setIsEditOpen(true);
  };

  const handleSave = () => {
    if (isAddOpen) {
      const newId = penduduk.length > 0 ? Math.max(...penduduk.map(p => p.id)) + 1 : 1;
      setPenduduk([...penduduk, { ...formData, id: newId, foto: null }]);
      setIsAddOpen(false);
    } else if (isEditOpen) {
      setPenduduk(penduduk.map(p => p.id === selectedData.id ? { ...formData, id: p.id, foto: p.foto } : p));
      setIsEditOpen(false);
    }
  };

  const handleDelete = () => {
    setPenduduk(penduduk.filter(p => p.id !== selectedData.id));
    setIsDeleteOpen(false);
  };

  if (!isClient) return null;

  const totalJiwa = penduduk.length;
  const totalKK = new Set(penduduk.map(p => p.noKk)).size;
  const totalRT = new Set(penduduk.map(p => p.rt)).size;

  return (
    <div className="space-y-4 md:space-y-6">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          aside, header, .print-hide { display: none !important; }
          .pl-64 { padding-left: 0 !important; }
          main { padding: 0 !important; margin: 0 !important; }
          body { background: white !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border: 1px solid #e2e8f0 !important; padding: 12px !important; color: black !important; font-size: 11px !important; }
        }
      `}} />

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 print-hide">
        <div className="w-full xl:w-auto">
          <h2 className="text-xl md:text-2xl font-bold text-[#1E293B]">Data Penduduk</h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1 mb-3">Kelola informasi kependudukan warga desa.</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100"><Users className="w-3.5 h-3.5" /> {totalJiwa} Jiwa</div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100"><Home className="w-3.5 h-3.5" /> {totalKK} KK</div>
            <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-100"><MapPin className="w-3.5 h-3.5" /> {totalRT} RT/RW</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-2 md:gap-3">
          <button onClick={handleExportPDF} className="w-full sm:w-auto justify-center flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm"><FileDown className="w-4 h-4" /> Export PDF</button>
          {userRole !== 'kades' && (
            <button onClick={openAdd} className="w-full sm:w-auto justify-center flex items-center gap-2 bg-[#1D4ED8] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition shadow-lg"><Plus className="w-4 h-4" /> Tambah Data</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full">
        <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between bg-white print-hide">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama, NIK, KK..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all" 
            />
          </div>
        </div>

        <div className="hidden print:block mb-6">
            <div className="flex items-center border-b-2 border-black pb-4 mb-4">
              <img src="/logo-sidoarjo.png" alt="Logo" className="w-16 h-16 object-contain" />
              <div className="flex-1 text-center pr-16">
                <h2 className="text-2xl font-bold text-black uppercase">Pemerintah Desa Jimbaran Kulon</h2>
                <p className="text-black text-sm">Kecamatan Wonoayu, Kabupaten Sidoarjo</p>
              </div>
            </div>
            <h3 className="text-center font-bold text-lg mb-4 underline">LAPORAN DATA PENDUDUK</h3>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50/50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4">No</th>
                <th className="px-4 md:px-6 py-3 md:py-4">No. KK</th>
                <th className="px-4 md:px-6 py-3 md:py-4">NIK</th>
                <th className="px-4 md:px-6 py-3 md:py-4">Nama</th>
                <th className="px-4 md:px-6 py-3 md:py-4">L/P</th>
                <th className="px-4 md:px-6 py-3 md:py-4">Alamat</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-center print-hide">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs md:text-sm font-medium">
              {penduduk.filter(item => 
                item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.nik.includes(searchQuery) ||
                item.noKk.includes(searchQuery)
              ).map((item, index) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-slate-50/50">
                  <td className="px-4 md:px-6 py-3 md:py-4 text-gray-700">{index + 1}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-gray-700">{item.noKk}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-gray-700">{item.nik}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-gray-700">{item.nama}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-gray-700">{item.jk}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-gray-700">{item.alamat} RT {item.rt}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 flex justify-center gap-1 md:gap-2 print-hide">
                    <button onClick={() => { setSelectedData(item); setIsViewOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"><Eye className="w-4 h-4" /></button>
                    {userRole !== 'kades' && <button onClick={() => openEdit(item)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition"><Edit className="w-4 h-4" /></button>}
                    {userRole === 'admin' && <button onClick={() => { setSelectedData(item); setIsDeleteOpen(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"><Trash2 className="w-4 h-4" /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 print-hide">
          <div className="bg-white rounded-2xl w-[95%] sm:w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-extrabold text-lg md:text-xl text-gray-900">{isAddOpen ? 'Tambah Data Penduduk' : 'Edit Penduduk'}</h3>
              <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
            </div>
            <div className="p-4 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">No. KK</label><input type="text" value={formData.noKk} onChange={(e) => setFormData({...formData, noKk: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500" placeholder="16 digit KK" /></div>
                <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">NIK</label><input type="text" value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500" placeholder="16 digit NIK" /></div>
              </div>
              <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">Nama Lengkap</label><input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500" placeholder="Nama lengkap" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">Jenis Kelamin</label>
                  <select value={formData.jk} onChange={(e) => setFormData({...formData, jk: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm text-gray-900 outline-none bg-gray-50 focus:border-blue-500">
                    <option value="">Pilih...</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">RT/RW</label><input type="text" value={formData.rt} onChange={(e) => setFormData({...formData, rt: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500" placeholder="01/02" /></div>
              </div>
              <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">Alamat Lengkap</label><textarea value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 md:p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500" rows={2} placeholder="Alamat lengkap" /></div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Foto Wajah (Opsional)</label>
                <input type="file" accept="image/*" className="w-full border border-gray-200 rounded-xl p-2 text-sm text-gray-900 outline-none bg-gray-50 file:mr-4 file:py-1.5 md:file:py-2 file:px-3 md:file:px-4 file:rounded-full file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700" />
              </div>
            </div>
            <div className="px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-end gap-2 md:gap-3 bg-white border-t border-gray-100">
              <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={handleSave} className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-800 transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {isViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 md:p-4 print-hide">
          <div className="bg-white rounded-2xl w-[95%] sm:w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white"><h3 className="font-extrabold text-lg md:text-xl text-gray-900">Detail Penduduk</h3><button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5 md:w-6 md:h-6" /></button></div>
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
              {/* Kolom kiri (KTP) */}
              <div className="w-full md:w-1/2 bg-slate-50 p-4 md:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                 <div className="w-full max-w-[280px] md:max-w-sm bg-white shadow-lg border border-gray-200 p-6 md:p-8 flex flex-col aspect-[3/4]">
                    <div className="border-b-[2px] md:border-b-[3px] border-black pb-2 md:pb-4 mb-3 md:mb-5 flex items-center gap-2 md:gap-4">
                       <img src="/logo-sidoarjo.png" alt="Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                       <div className="flex-1 text-center pr-2 md:pr-4"><h4 className="font-extrabold text-[10px] md:text-[12px] uppercase text-black leading-tight">Pemerintah Desa<br/>Jimbaran Kulon</h4></div>
                    </div>
                    <div className="flex-1 text-[10px] md:text-xs text-gray-900 space-y-2 md:space-y-4 font-medium">
                       <div className="text-center mb-4 md:mb-6"><span className="font-bold text-black text-[11px] md:text-[13px] uppercase border-b-2 border-black pb-0.5">Biodata Penduduk</span></div>
                       <div className="grid grid-cols-3 gap-1 md:gap-2 ml-1 md:ml-2">
                         <div className="text-gray-700">Nama</div><div className="col-span-2 font-bold text-black truncate">: {selectedData?.nama}</div>
                         <div className="text-gray-700">No. KK</div><div className="col-span-2 font-bold text-black">: {selectedData?.noKk}</div>
                         <div className="text-gray-700">NIK</div><div className="col-span-2 font-bold text-black">: {selectedData?.nik}</div>
                         <div className="text-gray-700">J. Kelamin</div><div className="col-span-2 text-black">: {selectedData?.jk}</div>
                         <div className="text-gray-700">Alamat</div><div className="col-span-2 text-black">: {selectedData?.alamat}</div>
                       </div>
                    </div>
                 </div>
              </div>
              {/* Kolom kanan (Data Sistem) */}
              <div className="w-full md:w-1/2 p-5 md:p-8 space-y-4 md:space-y-6 bg-white">
                 <div>
                   <h4 className="flex items-center gap-2 font-bold text-[#1D4ED8] text-sm md:text-base mb-4 md:mb-6 border-b border-gray-100 pb-3"><FileText className="w-4 h-4 md:w-5 md:h-5" /> Data Kependudukan</h4>
                   <div className="space-y-3 md:space-y-5 text-xs md:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4"><span className="text-gray-500 font-medium">Nama</span><span className="sm:col-span-2 font-bold text-gray-900">{selectedData?.nama}</span></div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4"><span className="text-gray-500 font-medium">Nomor KK</span><span className="sm:col-span-2 font-bold text-blue-600">{selectedData?.noKk}</span></div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4"><span className="text-gray-500 font-medium">Nomor NIK</span><span className="sm:col-span-2 font-bold text-gray-900">{selectedData?.nik}</span></div>
                   </div>
                 </div>
              </div>
            </div>
            <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white border-t border-gray-100">
              <button onClick={() => setIsViewOpen(false)} className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm">Kembali</button>
              <div className="flex w-full sm:w-auto gap-2 md:gap-3">
                <button onClick={handleExportPDF} className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 md:px-6 py-2.5 text-sm font-bold text-white bg-[#1D4ED8] rounded-xl hover:bg-blue-800 transition shadow-lg"><Download className="w-4 h-4" /> Cetak</button>
                {userRole === 'admin' && (
                  <button onClick={() => { setIsViewOpen(false); setIsDeleteOpen(true); }} className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 md:px-6 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-lg"><Trash2 className="w-4 h-4" /> Hapus</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 print-hide">
          <div className="bg-white rounded-2xl w-[95%] sm:w-full max-w-sm shadow-2xl p-5 md:p-6 text-center animate-in zoom-in duration-200">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-7 h-7 md:w-8 md:h-8" /></div>
            <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-2">Hapus Data?</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-6">Yakin hapus data <span className="font-bold text-gray-800">{selectedData?.nama}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}