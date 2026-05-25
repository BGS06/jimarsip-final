'use client';

import { useState } from 'react';
import { FileText, Inbox, Send, PieChart, BarChart2, Download, Filter } from 'lucide-react';

export default function LaporanPage() {
  const [filterBulan, setFilterBulan] = useState('Bulan Ini');

  const stats = [
    { title: 'Total Arsip', value: '286', unit: 'Dokumen', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { title: 'Arsip Masuk', value: '156', unit: 'Dokumen', icon: Inbox, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Arsip Keluar', value: '130', unit: 'Dokumen', icon: Send, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  ];

  const barChartData = [
    { label: 'Senin', masuk: 20, keluar: 0 },
    { label: 'Selasa', masuk: 35, keluar: 55 },
    { label: 'Rabu', masuk: 0, keluar: 65 },
    { label: 'Kamis', masuk: 40, keluar: 0 },
    { label: 'Jumat', masuk: 0, keluar: 45 },
  ];

  const pieChartData = [
    { label: 'Kependudukan', percentage: 40, color: 'bg-[#1D4ED8]', stroke: '#1D4ED8' },
    { label: 'Surat Masuk', percentage: 30, color: 'bg-[#10B981]', stroke: '#10B981' },
    { label: 'Surat Keluar', percentage: 15, color: 'bg-[#34D399]', stroke: '#34D399' },
    { label: 'Legalitas', percentage: 15, color: 'bg-[#F59E0B]', stroke: '#F59E0B' },
  ];

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          aside, header, .print-hide { display: none !important; }
          .pl-64 { padding-left: 0 !important; }
          main { padding: 0 !important; margin: 0 !important; }
          body { background: white !important; }
        }
      `}} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print-hide">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1E293B]">Laporan Arsip</h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Ringkasan statistik dan visualisasi data desa.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 md:gap-3">
          <button className="w-full sm:w-auto justify-center flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition shadow-sm">
            <Filter className="w-4 h-4" /> Filter Advanced
          </button>
          <button onClick={handleExport} className="w-full sm:w-auto justify-center flex items-center gap-2 bg-[#1D4ED8] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
            <Download className="w-4 h-4" /> Export Laporan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-4 md:gap-5 transition-transform hover:-translate-y-1">
            <div className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center border ${item.bg} ${item.border}`}>
              <item.icon className={`w-6 h-6 md:w-8 md:h-8 ${item.color}`} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.title}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-4xl font-black text-[#1E293B]">{item.value}</span>
              </div>
              <p className="text-[10px] md:text-xs font-medium text-gray-500 mt-1">{item.unit}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 md:gap-6 w-full">
        
        {/* BAR CHART */}
        <div className="xl:col-span-3 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col min-h-[300px] w-full overflow-hidden">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="font-extrabold text-[#1E293B] text-base md:text-lg flex items-center gap-2">
              <BarChart2 className="w-4 h-4 md:w-5 md:h-5 text-gray-400" /> Grafik Arsip
            </h3>
            <select 
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-gray-600 px-2 md:px-4 py-1.5 md:py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
            >
              <option>Minggu Ini</option><option>Bulan Ini</option><option>Tahun Ini</option>
            </select>
          </div>

          <div className="flex-1 relative flex flex-col justify-end w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
            <div className="min-w-[400px] h-full relative flex flex-col justify-end">
              <div className="absolute inset-0 flex flex-col justify-between pb-6 md:pb-8">
                {[40, 30, 20, 10, 0].map((num) => (
                  <div key={num} className="flex items-center gap-2 md:gap-3 w-full">
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 w-5 md:w-6 text-right">{num}</span>
                    <div className="flex-1 border-t border-dashed border-gray-200"></div>
                  </div>
                ))}
              </div>

              <div className="relative z-10 flex justify-between items-end h-[180px] md:h-[220px] pl-8 md:pl-12 pr-2 md:pr-4 pb-6 md:pb-8">
                {barChartData.map((data, idx) => (
                  <div key={idx} className="flex gap-1 md:gap-2 items-end h-full w-full justify-center group">
                    {data.masuk > 0 && (
                      <div style={{ height: `${(data.masuk / 70) * 100}%` }} className="w-6 md:w-10 lg:w-10 bg-[#1D4ED8] rounded-t-sm md:rounded-t-md relative">
                        <div className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.masuk}
                        </div>
                      </div>
                    )}
                    {data.keluar > 0 && (
                      <div style={{ height: `${(data.keluar / 70) * 100}%` }} className="w-6 md:w-10 lg:w-10 bg-[#34D399] rounded-t-sm md:rounded-t-md relative">
                        <div className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.keluar}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between pl-8 md:pl-12 pr-2 md:pr-4 mt-1 md:mt-2 border-t border-gray-100 pt-2 md:pt-3">
                {barChartData.map((data, idx) => (
                  <span key={idx} className="text-[9px] md:text-xs font-bold text-gray-500 w-full text-center">
                    {data.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="xl:col-span-2 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col">
          <h3 className="font-extrabold text-[#1E293B] text-base md:text-lg flex items-center gap-2 mb-6 md:mb-8">
            <PieChart className="w-4 h-4 md:w-5 md:h-5 text-gray-400" /> Kategori Arsip
          </h3>
          
          <div className="flex-1 flex flex-col md:flex-row xl:flex-col items-center justify-center gap-6 md:gap-8">
            <div className="relative w-40 h-40 md:w-48 md:h-48 drop-shadow-xl hover:scale-105 transition-transform duration-300">
              <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#1D4ED8" strokeWidth="6" strokeDasharray="40 60" strokeDashoffset="0" className="hover:opacity-80 cursor-pointer transition-opacity" />
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#10B981" strokeWidth="6" strokeDasharray="30 70" strokeDashoffset="-40" className="hover:opacity-80 cursor-pointer transition-opacity" />
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#34D399" strokeWidth="6" strokeDasharray="15 85" strokeDashoffset="-70" className="hover:opacity-80 cursor-pointer transition-opacity" />
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#F59E0B" strokeWidth="6" strokeDasharray="15 85" strokeDashoffset="-85" className="hover:opacity-80 cursor-pointer transition-opacity" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl md:text-3xl font-black text-gray-800">100%</span>
                <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase">Total Data</span>
              </div>
            </div>

            <div className="w-full space-y-3 md:space-y-4">
              {pieChartData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-1 md:p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full ${item.color} shadow-sm`}></div>
                    <span className="text-xs md:text-sm font-bold text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-xs md:text-sm font-black text-gray-900">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}