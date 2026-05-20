'use client';

import { Search, Plus, MapPinHouse, Edit, Trash2 } from 'lucide-react';

export default function DataRTPage() {
  const mockRT = [
    { id: 1, rt: '01', rw: '01', ketua: 'Slamet Riadi', jml_warga: 45 },
    { id: 2, rt: '02', rw: '01', ketua: 'Nanang Kosim', jml_warga: 38 },
    { id: 3, rt: '01', rw: '02', ketua: 'Agus Setiawan', jml_warga: 52 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Rukun Tetangga (RT)</h1>
          <p className="text-gray-500 text-sm mt-1">Informasi unit terkecil kepengurusan warga.</p>
        </div>
        <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg font-medium transition">
          <Plus className="w-5 h-5" />
          Tambah RT
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
           <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Cari RT atau RW..." className="pl-9 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
           </div>
           <div className="text-xs text-gray-400 font-medium">Menampilkan {mockRT.length} RT</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nomor RT</th>
                <th className="px-6 py-4">Wilayah RW</th>
                <th className="px-6 py-4">Ketua RT</th>
                <th className="px-6 py-4 text-center">Total Warga</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mockRT.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-violet-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPinHouse className="w-4 h-4 text-violet-500" />
                      <span className="font-bold text-gray-950">RT {item.rt}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">RW {item.rw}</td>
                  <td className="px-6 py-4 font-medium">{item.ketua}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-lg text-xs font-bold">
                      {item.jml_warga} Jiwa
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button className="p-2 text-violet-600 hover:bg-violet-100 rounded-lg transition"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}