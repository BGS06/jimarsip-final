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
    <div className="space-y-6">
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print-hide">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B]">Data Penduduk</h2>
          <p className="text-gray-500 text-sm mt-1 mb-3">Kelola informasi kependudukan warga desa.</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100"><Users className="w-3.5 h-3.5" /> Total Penduduk: {totalJiwa} Jiwa</div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100"><Home className="w-3.5 h-3.5" /> Total Keluarga: {totalKK} KK</div>
            <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-100"><MapPin className="w-3.5 h-3.5" /> Cakupan Wilayah: {totalRT} RT/RW</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportPDF} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm"><FileDown className="w-4 h-4" /> Export PDF</button>
          {userRole !== 'kades' && (
            <button onClick={openAdd} className="flex items-center gap-2 bg-[#1D4ED8] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-800 transition shadow-lg"><Plus className="w-4 h-4" /> Tambah Penduduk</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white print-hide">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama, NIK, atau No KK..." 
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

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">No. KK</th>
                <th className="px-6 py-4">NIK</th>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">L/P</th>
                <th className="px-6 py-4">Alamat</th>
                <th className="px-6 py-4 text-center print-hide">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {penduduk.filter(item => 
                item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.nik.includes(searchQuery) ||
                item.noKk.includes(searchQuery)
              ).map((item, index) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-700">{item.noKk}</td>
                  <td className="px-6 py-4 text-gray-700">{item.nik}</td>
                  <td className="px-6 py-4 text-gray-700">{item.nama}</td>
                  <td className="px-6 py-4 text-gray-700">{item.jk}</td>
                  <td className="px-6 py-4 text-gray-700">{item.alamat} RT/RW {item.rt}</td>
                  <td className="px-6 py-4 flex justify-center gap-2 print-hide">
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
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-extrabold text-xl text-gray-900">{isAddOpen ? 'Tambah Data Penduduk' : 'Edit Data Penduduk'}</h3>
              <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-5">
                <div><label className="block text-sm font-bold text-gray-700 mb-1.5">No. KK</label><input type="text" value={formData.noKk} onChange={(e) => setFormData({...formData, noKk: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500 transition-all" placeholder="16 digit KK" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1.5">NIK</label><input type="text" value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500 transition-all" placeholder="16 digit NIK" /></div>
              </div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Lengkap</label><input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500 transition-all" placeholder="Masukkan nama lengkap" /></div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Jenis Kelamin</label>
                  <select value={formData.jk} onChange={(e) => setFormData({...formData, jk: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 outline-none bg-gray-50 focus:border-blue-500 transition-all">
                    <option value="">Pilih...</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1.5">RT/RW</label><input type="text" value={formData.rt} onChange={(e) => setFormData({...formData, rt: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500 transition-all" placeholder="01/02" /></div>
              </div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Alamat Lengkap</label><textarea value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500 transition-all" rows={2} placeholder="Masukkan alamat lengkap" /></div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Foto Wajah (Opsional)</label>
                <input type="file" accept="image/*" className="w-full border border-gray-200 rounded-xl p-2 text-sm text-gray-900 outline-none bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700" />
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 bg-white border-t border-gray-100">
              <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-800 transition">Simpan Data</button>
            </div>
          </div>
        </div>
      )}

      {isViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print-hide">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white"><h3 className="font-extrabold text-xl text-gray-900">Detail Penduduk</h3><button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6" /></button></div>
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
              <div className="w-full md:w-1/2 bg-slate-50 p-8 flex items-center justify-center border-r border-gray-100">
                 <div className="w-full max-w-sm bg-white shadow-lg border border-gray-200 p-8 flex flex-col aspect-[3/4]">
                    <div className="border-b-[3px] border-black pb-4 mb-5 flex items-center gap-4">
                       <img src="/logo-sidoarjo.png" alt="Logo" className="w-14 h-14 object-contain" />
                       <div className="flex-1 text-center pr-4"><h4 className="font-extrabold text-[12px] uppercase text-black leading-tight">Pemerintah Desa<br/>Jimbaran Kulon</h4><p className="text-[10px] text-black font-medium mt-1">Kecamatan Wonoayu, Kabupaten Sidoarjo</p></div>
                    </div>
                    <div className="flex-1 text-xs text-gray-900 space-y-4 font-medium">
                       <div className="text-center mb-6"><span className="font-bold text-black text-[13px] uppercase border-b-2 border-black pb-0.5">Biodata Penduduk</span></div>
                       <div className="grid grid-cols-3 gap-2 ml-2 text-[11px]">
                         <div className="text-gray-700">Nama</div><div className="col-span-2 font-bold text-black">: {selectedData?.nama}</div>
                         <div className="text-gray-700">No. KK</div><div className="col-span-2 font-bold text-black">: {selectedData?.noKk}</div>
                         <div className="text-gray-700">NIK</div><div className="col-span-2 font-bold text-black">: {selectedData?.nik}</div>
                         <div className="text-gray-700">Jenis Kelamin</div><div className="col-span-2 text-black">: {selectedData?.jk}</div>
                         <div className="text-gray-700">Alamat</div><div className="col-span-2 text-black">: {selectedData?.alamat} RT/RW {selectedData?.rt}</div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-1/2 p-8 space-y-6 bg-white">
                 <div>
                   <h4 className="flex items-center gap-2 font-bold text-[#1D4ED8] text-base mb-6 border-b border-gray-100 pb-3"><FileText className="w-5 h-5" /> Data Kependudukan</h4>
                   <div className="space-y-5 text-sm">
                      <div className="grid grid-cols-3 gap-4"><span className="text-gray-500 font-medium">Nama Lengkap</span><span className="col-span-2 font-bold text-gray-900">{selectedData?.nama}</span></div>
                      <div className="grid grid-cols-3 gap-4"><span className="text-gray-500 font-medium">Nomor KK</span><span className="col-span-2 font-bold text-blue-600">{selectedData?.noKk}</span></div>
                      <div className="grid grid-cols-3 gap-4"><span className="text-gray-500 font-medium">Nomor NIK</span><span className="col-span-2 font-bold text-gray-900">{selectedData?.nik}</span></div>
                   </div>
                 </div>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-between items-center bg-white border-t border-gray-100">
              <button onClick={() => setIsViewOpen(false)} className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm">Kembali</button>
              <div className="flex gap-3">
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#1D4ED8] rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-900/20"><Download className="w-4 h-4" /> Cetak Detail</button>
                {userRole === 'admin' && (
                  <button onClick={() => { setIsViewOpen(false); setIsDeleteOpen(true); }} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-900/20"><Trash2 className="w-4 h-4" /> Hapus</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 print-hide">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8" /></div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Hapus Data?</h3>
            <p className="text-sm text-gray-500 mb-6">Yakin hapus data <span className="font-bold text-gray-800">{selectedData?.nama}</span>?</p>
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