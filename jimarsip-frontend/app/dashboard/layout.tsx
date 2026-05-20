'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, FileText, FileBarChart, Settings, LogOut, Search, Home } from 'lucide-react';

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
  const router = useRouter();
  
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    const name = localStorage.getItem('user_name');
    if (!role) {
      router.push('/');
    } else {
      setUserRole(role);
      setUserName(name || '');
    }
  }, [router]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    router.push('/');
  };

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
          <a href="#" onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <LogOut className="w-5 h-5" /> Logout
          </a>
        </div>
      </aside>

      <div className="pl-64 flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 print-hide">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Cari sesuatu..." className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
          </div>
          <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{userName || 'Loading...'}</p>
              <p className="text-xs text-gray-500 font-medium capitalize">{userRole || 'User'}</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold shadow-sm">
              {userName ? userName.substring(0, 2).toUpperCase() : 'AD'}
            </div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}