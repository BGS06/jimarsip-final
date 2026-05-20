'use client';

import { useState, useRef } from 'react';
import { 
  User, Mail, Lock, Eye, EyeOff, 
  Camera, Save, ShieldCheck, X
} from 'lucide-react';

export default function PengaturanPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: 'Admin Desa',
    username: 'admin',
    email: 'admin@jimbarankulon.desa.id',
  });

  const [profilePic, setProfilePic] = useState('https://ui-avatars.com/api/?name=Admin+Desa&background=DBEAFE&color=1D4ED8&size=128');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ lama: '', baru: '', konfirmasi: '' });

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handleSaveChanges = () => {
    alert(`Perubahan berhasil disimpan!\n\nNama: ${formData.nama}\nUsername: ${formData.username}\nEmail: ${formData.email}`);
  };

  const handleSavePassword = () => {
    if (passwordForm.baru !== passwordForm.konfirmasi) {
      alert("Password baru dan konfirmasi tidak cocok!");
      return;
    }
    alert("Password berhasil diubah!");
    setIsPasswordModalOpen(false);
    setPasswordForm({ lama: '', baru: '', konfirmasi: '' });
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1E293B]">Pengaturan Akun</h2>
        <p className="text-gray-500 text-sm mt-1">Kelola informasi profil dan keamanan akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SISI KIRI: INFORMASI AKUN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3 bg-white">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-[#1E293B] text-lg">Informasi Akun</h3>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-sm font-bold text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 font-bold text-xs italic">@</div>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-sm font-bold text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-sm font-bold text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value="passwordrahasiat"
                    readOnly
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-sm font-bold text-gray-900 outline-none cursor-not-allowed select-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-blue-100 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 hover:border-blue-200 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Ubah Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SISI KANAN: FOTO PROFIL */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3 bg-white">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Camera className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-bold text-[#1E293B] text-lg">Foto Profil</h3>
            </div>

            <div className="p-10 flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                <div className="w-40 h-40 rounded-full bg-blue-100 border-4 border-white shadow-xl flex items-center justify-center text-blue-700 text-5xl font-black overflow-hidden">
                   <img 
                     src={profilePic} 
                     alt="Profile" 
                     className="w-full h-full object-cover"
                   />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Camera className="text-white w-8 h-8" />
                </div>
              </div>

              <p className="mt-6 text-xs text-gray-500 font-medium text-center">
                Besar file: maksimum 10MB.<br/>Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG
              </p>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg, image/jpg" 
                className="hidden" 
              />

              <button 
                onClick={handlePhotoClick}
                className="mt-8 flex items-center gap-2 px-8 py-3 bg-white border-2 border-blue-50 text-blue-600 rounded-2xl text-sm font-bold hover:bg-blue-50 hover:border-blue-100 transition-all shadow-sm"
              >
                <Camera className="w-4 h-4" />
                Ubah Foto
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSaveChanges}
              className="flex items-center gap-3 px-10 py-4 bg-[#1D4ED8] text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              <Save className="w-5 h-5" />
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      {/* ==================== MODAL UBAH PASSWORD ==================== */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-extrabold text-[#1E293B] text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" /> Ubah Password
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-red-500 transition"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Password Lama</label>
                <input 
                  type="password" 
                  value={passwordForm.lama}
                  onChange={(e) => setPasswordForm({...passwordForm, lama: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 font-medium placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition bg-gray-50" 
                  placeholder="Masukkan password saat ini" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Password Baru</label>
                <input 
                  type="password" 
                  value={passwordForm.baru}
                  onChange={(e) => setPasswordForm({...passwordForm, baru: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 font-medium placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition bg-gray-50" 
                  placeholder="Masukkan password baru" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                <input 
                  type="password" 
                  value={passwordForm.konfirmasi}
                  onChange={(e) => setPasswordForm({...passwordForm, konfirmasi: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 font-medium placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition bg-gray-50" 
                  placeholder="Ulangi password baru" 
                />
              </div>
            </div>

            <div className="px-6 py-5 flex justify-end gap-3 bg-gray-50 border-t border-gray-100">
              <button onClick={() => setIsPasswordModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition">Batal</button>
              <button onClick={handleSavePassword} className="px-5 py-2.5 text-sm font-bold text-white bg-[#1D4ED8] rounded-xl hover:bg-blue-800 transition shadow-lg">Simpan Password</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}