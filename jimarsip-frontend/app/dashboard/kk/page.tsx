'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Eye, Trash2, X } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8001/kk'; // Sesuaikan endpoint FastAPI kamu

export default function DataKKPage() {
  const [dataKK, setDataKK] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({ no_kk: '', kepala: '', nik_kepala: '' });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [userRole, setUserRole] = useState('');

  // FETCH DATA
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL);
      setDataKK(response.data);
    } catch (error) {
      console.warn("Backend offline, menggunakan data lokal.");
      const savedData = localStorage.getItem('mockDataKK');
      if (savedData) {
        setDataKK(JSON.parse(savedData));
      } else {
        const defaultData = [
          { id: 1, no_kk: '3515110101010010', kepala: 'Budi Santoso', nik_kepala: '3515110101010001' }
        ];
        setDataKK(defaultData);
        localStorage.setItem('mockDataKK', JSON.stringify(defaultData));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role) setUserRole(role);
    fetchData();
  }, []);

  // SAVE DATA
  const handleSave = async () => {
    try {
      // Pastikan key-nya: no_kk, kepala, nik_kepala
      const payload = {
        no_kk: formData.no_kk,
        kepala: formData.kepala,
        nik_kepala: formData.nik_kepala
      };
      
      await axios.post(API_URL, payload); // axios otomatis mengubah object ke JSON
      setIsAddOpen(false);
      setFormData({ no_kk: '', kepala: '', nik_kepala: '' });
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Gagal simpan data! Cek terminal backend untuk detail error-nya.");
    }
  };

  // DELETE DATA
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedData.id}`);
      setIsDeleteOpen(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.warn("Gagal hapus data KK dari server, menghapus secara lokal.");
      const newDataList = dataKK.filter((item) => item.id !== selectedData.id);
      setDataKK(newDataList);
      localStorage.setItem('mockDataKK', JSON.stringify(newDataList));
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B]">Data Kartu Keluarga</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola data KK Desa Jimbaran Kulon.</p>
        </div>
        {userRole !== 'kades' && (
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 bg-[#1D4ED8] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-800 transition shadow-lg">
            <Plus className="w-4 h-4" /> Tambah KK
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari No. KK atau Nama..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"/>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nama Kepala Keluarga</th>
                <th className="px-6 py-4">No. KK</th>
                <th className="px-6 py-4">NIK Kepala Keluarga</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Memuat data dari database...</td></tr>
              ) : dataKK.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Belum ada data KK</td></tr>
              ) : (
                dataKK.map((item, i) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 text-gray-700">{i + 1}</td>
                    <td className="px-6 py-4 text-gray-900">{item.kepala}</td>
                    <td className="px-6 py-4 text-gray-700 font-mono">{item.no_kk}</td>
                    <td className="px-6 py-4 text-gray-700 font-mono">{item.nik_kepala}</td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button onClick={() => { setSelectedData(item); setIsViewOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"><Eye className="w-4 h-4" /></button>
                      {userRole === 'admin' && <button onClick={() => { setSelectedData(item); setIsDeleteOpen(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"><Trash2 className="w-4 h-4" /></button>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center"><h3 className="font-extrabold text-xl text-gray-900">Tambah Data KK</h3><button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6" /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-1.5">No. Kartu Keluarga</label><input type="text" value={formData.no_kk} onChange={(e) => setFormData({...formData, no_kk: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500" placeholder="Masukkan 16 digit No. KK"/></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Kepala Keluarga</label><input type="text" value={formData.kepala} onChange={(e) => setFormData({...formData, kepala: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500" placeholder="Masukkan nama lengkap"/></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1.5">NIK Kepala Keluarga</label><input type="text" value={formData.nik_kepala} onChange={(e) => setFormData({...formData, nik_kepala: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:border-blue-500" placeholder="Masukkan 16 digit NIK"/></div>
            </div>
            <div className="px-6 py-5 flex justify-end gap-3 bg-white border-t border-gray-100">
              <button onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-bold text-white bg-[#1D4ED8] rounded-xl hover:bg-blue-800 transition">Simpan Data</button>
            </div>
          </div>
        </div>
      )}

      {isViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6">
             <div className="flex justify-between items-center mb-6"><h3 className="font-extrabold text-xl text-gray-900">Detail KK</h3><button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button></div>
             <div className="space-y-4 text-sm">
               <div><p className="text-gray-500 font-medium">Nama Kepala Keluarga</p><p className="font-bold text-gray-900 text-base">{selectedData?.kepala}</p></div>
               <div><p className="text-gray-500 font-medium">Nomor Kartu Keluarga (KK)</p><p className="font-bold text-blue-600 font-mono text-base">{selectedData?.no_kk}</p></div>
               <div><p className="text-gray-500 font-medium">Nomor NIK</p><p className="font-bold text-gray-900 font-mono text-base">{selectedData?.nik_kepala}</p></div>
             </div>
             <button onClick={() => setIsViewOpen(false)} className="w-full mt-8 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Tutup</button>
           </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8" /></div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Hapus Data KK?</h3>
            <p className="text-sm text-gray-500 mb-6">Yakin menghapus KK milik <span className="font-bold text-gray-800">{selectedData?.kepala}</span>?</p>
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