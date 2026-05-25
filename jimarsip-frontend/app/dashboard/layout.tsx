'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Users, FileText, FileBarChart, Settings, LogOut, Home, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Data Penduduk', href: '/dashboard/penduduk', icon: Users },
  { name: 'Data KK', href: '/dashboard/kk', icon: Home },
  { name: 'Arsip Dokumen', href: '/dashboard/arsip', icon: FileText },
  { name: 'Laporan', href: '/dashboard/laporan', icon: FileBarChart },
  { name: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      
      {/* OVERLAY UNTUK MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1E293B] text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between lg:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <img src="/logo-sidoarjo.png" alt="Logo Sidoarjo" className="w-full h-full object-contain drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">JIMARSIP</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Desa Jimbaran Kulon</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${isActive ? 'bg-[#1D4ED8] text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <LinkIcon className="w-5 h-5" /> {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <LogOut className="w-5 h-5" /> Logout
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between lg:justify-end px-4 md:px-8 shrink-0 z-10 print-hide">
          
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">Admin Desa</p>
              <p className="text-xs text-gray-500 font-medium">Administrator</p>
            </div>
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold shadow-sm text-sm md:text-base">AD</div>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}