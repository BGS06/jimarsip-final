'use client';

import { Search, Plus, MapPinHouse, Edit, Trash2 } from 'lucide-react';

export default function DataRTPage() {
  const mockRT = [
    { id: 1, rt: '01', rw: '01', ketua: 'Slamet Riadi', jml_warga: 45 },
    { id: 2, rt: '02', rw: '01', ketua: 'Nanang Kosim', jml_warga: 38 },
    { id: 3, rt: '01', rw: '02', ketua: 'Agus Setiawan', jml_warga: 52 },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Data Rukun Tetangga (RT)</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Informasi unit terkecil kepengurusan warga.</p>
        </div>
        <button className="w-full md:w-auto justify-center flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-violet-900/20">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Tambah RT
        </button>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white">
           <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Cari RT atau RW..." className="pl-9 w-full border border-gray-200 bg-gray-50 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
           </div>
           <div className="text-xs text-gray-400 font-medium">Menampilkan {mockRT.length} RT</div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs md:text-sm text-gray-600 min-w-[500px]">
            <thead className="bg-slate-50/50 text-gray-500 uppercase font-bold border-b border-gray-100 text-[10px] md:text-xs">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4">Nomor RT</th>
                <th className="px-4 md:px-6 py-3 md:py-4">Wilayah RW</th>
                <th className="px-4 md:px-6 py-3 md:py-4">Ketua RT</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-center">Total Warga</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="font-medium">
              {mockRT.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-violet-50/50 transition">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-2">
                      <MapPinHouse className="w-4 h-4 text-violet-500" />
                      <span className="font-bold text-gray-950">RT {item.rt}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">RW {item.rw}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-gray-700">{item.ketua}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                    <span className="bg-violet-100 text-violet-700 px-2 md:px-3 py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold whitespace-nowrap">
                      {item.jml_warga} Jiwa
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 flex justify-center gap-1 md:gap-2">
                    <button className="p-1.5 md:p-2 text-violet-600 hover:bg-violet-100 rounded-lg transition"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 md:p-2 text-red-600 hover:bg-red-100 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
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