'use client';

import { MapPin, Users, Edit, Trash2 } from 'lucide-react';

export default function DataRWPage() {
  const mockRW = [
    { id: 1, rw: '01', ketua: 'H. Ahmad Subarjo', jml_rt: 6, wilayah: 'Dusun Utara' },
    { id: 2, rw: '02', ketua: 'Drs. M. Yusuf', jml_rt: 5, wilayah: 'Dusun Selatan' },
    { id: 3, rw: '03', ketua: 'Supriyanto', jml_rt: 4, wilayah: 'Dusun Barat' },
    { id: 4, rw: '04', ketua: 'Sutrisno', jml_rt: 3, wilayah: 'Dusun Timur' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Data Rukun Warga (RW)</h1>
        <p className="text-gray-500 text-sm mt-1">Daftar kepengurusan RW di wilayah Desa Jimbaran Kulon.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockRW.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 transition group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit className="w-4 h-4" /></button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">RW {item.rw}</h3>
              <p className="text-sm text-gray-500 mt-1">Ketua: <span className="font-semibold text-gray-700">{item.ketua}</span></p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  <Users className="w-3.5 h-3.5" />
                  {item.jml_rt} RT Terdaftar
                </div>
                <span className="text-xs text-gray-400 italic">{item.wilayah}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}