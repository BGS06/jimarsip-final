'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let role = '';
    let name = '';

    if (username === 'admin' && password === 'admin123') {
      role = 'admin';
      name = 'Admin Desa';
    } else if (username === 'kades' && password === 'kades123') {
      role = 'kades';
      name = 'Kepala Desa';
    } else if (username === 'sekdes' && password === 'sekdes123') {
      role = 'sekdes';
      name = 'Sekretaris Desa';
    } else {
      setError('Username atau password salah!');
      return;
    }

    setIsLoading(true);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_name', name);

    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-8 pb-6 text-center border-b border-gray-50 bg-slate-50/50">
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 p-2">
            <img src="/logo-sidoarjo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">JIMARSIP</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Desa Jimbaran Kulon</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100 text-center">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                placeholder="Masukkan username admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#1D4ED8] text-white py-3.5 rounded-2xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-70"
          >
            {isLoading ? 'Memproses...' : <><ShieldCheck className="w-5 h-5" /> Masuk ke Sistem</>}
          </button>
        </form>
      </div>
    </div>
  );
}