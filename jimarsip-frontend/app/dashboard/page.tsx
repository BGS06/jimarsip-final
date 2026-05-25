'use client';

import { Users, Home, FileText, Mail, TrendingUp, ChevronRight, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { title: 'Total Penduduk', value: '1.200', unit: 'Jiwa', sub: 'Data keseluruhan penduduk', icon: Users, iconColor: 'text-[#1D4ED8]', iconBg: 'bg-blue-50', href: '/dashboard/penduduk' },
    { title: 'Total KK', value: '335', unit: 'Kartu Keluarga', sub: 'Data keseluruhan KK', icon: Home, iconColor: 'text-[#1D4ED8]', iconBg: 'bg-blue-50', href: '/dashboard/kk' },
    { title: 'Total Arsip', value: '286', unit: 'Dokumen', sub: 'Semua arsip tersimpan', icon: FileText, iconColor: 'text-[#1D4ED8]', iconBg: 'bg-blue-50', href: '/dashboard/arsip' },
    { title: 'Surat Bulan Ini', value: '24', unit: 'Dokumen', sub: 'Surat masuk & keluar', icon: Mail, iconColor: 'text-[#F59E0B]', iconBg: 'bg-orange-50', href: '/dashboard/arsip' },
  ];

  const recentArsip = [
    { name: 'Surat Pengantar KTP', type: 'Kependudukan', date: '20 Mei 2026', status: 'Surat Masuk', badgeClass: 'bg-emerald-50 text-emerald-600' },
    { name: 'Surat Keterangan Usaha', type: 'Legalitas', date: '19 Mei 2026', status: 'Surat Keluar', badgeClass: 'bg-orange-50 text-orange-600' },
    { name: 'Laporan Kegiatan Desa', type: 'Laporan', date: '17 Mei 2026', status: 'Surat Masuk', badgeClass: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#1E293B]">Dashboard</h2>
        <p className="text-gray-500 text-xs md:text-sm mt-1">Selamat datang kembali, Admin Desa!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((item, i) => (
          <Link href={item.href} key={i} className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-200 group cursor-pointer">
            <div className="flex items-start gap-3 md:gap-4">
              <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${item.iconBg}`}>
                <item.icon className={`w-6 h-6 md:w-7 md:h-7 ${item.iconColor}`} strokeWidth={2} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] md:text-xs font-bold text-gray-400 mb-1 group-hover:text-blue-600 transition-colors truncate">{item.title}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl md:text-3xl font-black text-[#1E293B] group-hover:text-blue-800 transition-colors">{item.value}</span>
                  <span className="text-[10px] md:text-xs font-bold text-gray-500">{item.unit}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-50 group-hover:border-blue-100 transition-colors">
              <p className="text-[9px] md:text-[11px] text-gray-400 font-semibold">{item.sub}</p>
              <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500" strokeWidth={2.5} />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-2 w-full overflow-hidden">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col w-full">
          <div className="p-4 md:p-6 flex items-center justify-between border-b border-gray-50 bg-white">
            <h3 className="font-extrabold text-[#1E293B] text-base md:text-lg">Arsip Terbaru</h3>
            <button className="p-1.5 md:p-2 hover:bg-slate-50 rounded-full transition-colors"><MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-gray-400" /></button>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left min-w-[550px]">
              <thead className="bg-slate-50/50 text-[10px] md:text-xs uppercase font-extrabold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 md:px-6 py-3 md:py-4">Nama Dokumen</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Kategori</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Tanggal</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Tipe Surat</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm font-medium">
                {recentArsip.map((arsip, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-gray-900">{arsip.name}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600">{arsip.type}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600">{arsip.date}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[9px] md:text-[10px] font-black tracking-wide uppercase whitespace-nowrap ${arsip.badgeClass}`}>{arsip.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 md:p-5 border-t border-gray-50 flex justify-end bg-gray-50/30">
             <Link href="/dashboard/arsip" className="w-full sm:w-auto text-center px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs md:text-sm font-bold hover:bg-white hover:shadow-sm transition-all flex items-center justify-center gap-1">
               Lihat Semua Arsip <ChevronRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}