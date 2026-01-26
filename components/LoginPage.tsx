import React, { useState } from 'react';
import { Smartphone, ChevronRight } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden font-kanit">
      {/* Background Decals */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-roboss-red/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-yellow-500/10 rounded-full blur-[100px]"></div>

      <div className="flex-1 flex flex-col justify-center px-10 space-y-12 relative z-10">
        <div className="space-y-6">
          <div className="w-20 h-20 bg-roboss-red rounded-[2rem] flex items-center justify-center shadow-2xl shadow-red-600/40">
            <span className="text-4xl font-black text-white italic">R</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">ROBOSS</h1>
            <p className="text-gray-400 text-lg">AUTOMATIC CAR WASH</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">เบอร์โทรศัพท์</label>
            <div className="relative group">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-roboss-red transition-colors" size={20} />
              <input 
                type="tel" 
                placeholder="0XX-XXX-XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-white text-lg focus:outline-none focus:border-roboss-red focus:ring-1 focus:ring-roboss-red/50 transition-all font-mono"
              />
            </div>
          </div>
          
          <button 
            onClick={onLogin}
            className="w-full gradient-red py-5 rounded-2xl text-white font-bold text-lg shadow-xl shadow-red-950/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            เข้าสู่ระบบ <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">หรือเข้าสู่ระบบด้วย</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          
          <div className="flex gap-4 w-full">
            <button className="flex-1 bg-white/5 border border-white/5 py-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">
              <img src="https://www.line.biz/favicon.ico" alt="Line" className="w-6 h-6 rounded-md opacity-70" />
            </button>
            <button className="flex-1 bg-white/5 border border-white/5 py-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">
              <img src="https://www.facebook.com/favicon.ico" alt="FB" className="w-6 h-6 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 text-center text-gray-600 text-xs">
        การเข้าสู่ระบบแสดงว่าคุณยอมรับ <span className="text-gray-400 underline">เงื่อนไขการใช้บริการ</span> และ <span className="text-gray-400 underline">นโยบายความเป็นส่วนตัว</span>
      </div>
    </div>
  );
};

export default LoginPage;
