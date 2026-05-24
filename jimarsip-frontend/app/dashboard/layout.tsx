'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, FileBarChart, Settings, LogOut, Home } from 'lucide-react';

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

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <aside className="w-64 bg-[#1E293B] text-white flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-12 h-12 shrink-0 flex items-center justify-center">
            <img src="/logo-sidoarjo.png" alt="Logo Sidoarjo" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">JIMARSIP</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Desa Jimbaran Kulon</p>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {navLinks.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${isActive ? 'bg-[#1D4ED8] text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
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

      <div className="pl-64 flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-end px-8 sticky top-0 z-10 print-hide">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">Admin Desa</p>
              <p className="text-xs text-gray-500 font-medium">Administrator</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold shadow-sm">AD</div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}