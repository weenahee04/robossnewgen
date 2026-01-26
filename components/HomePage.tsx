
import React from 'react';
import { User } from '../types';
import StampCard from './StampCard';
import { ChevronRight, Gift, Zap, Star, ShieldCheck } from 'lucide-react';

interface HomePageProps {
  user: User;
  onOpenQR: () => void;
  onOpenRewards: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ user, onOpenQR, onOpenRewards }) => {
  const banners = [
    {
      id: 1,
      title: 'Flash Sale!',
      subtitle: 'ล้างพร้อมเคลือบสี เพียง 199.-',
      image: 'https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&q=80&w=600',
      tag: 'จำกัดเวลา'
    },
    {
      id: 2,
      title: 'ชวนเพื่อนสะสมแต้ม',
      subtitle: 'รับฟรี 100 แต้มทันทีเมื่อเพื่อนใช้บริการ',
      image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600',
      tag: 'สิทธิพิเศษ'
    },
    {
      id: 3,
      title: 'Member Only',
      subtitle: 'สิทธิพิเศษเฉพาะระดับ Gold เท่านั้น',
      image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=600',
      tag: 'New'
    }
  ];

  const nextTier = user.memberTier === 'Silver' ? 'Gold' : user.memberTier === 'Gold' ? 'Platinum' : 'Maximum';
  const progressPercent = user.memberTier === 'Silver' ? (user.points / 2000) * 100 : user.memberTier === 'Gold' ? (user.points / 5000) * 100 : 100;

  return (
    <div className="px-6 py-4 space-y-6">
      <div className="space-y-1">
        <p className="text-gray-400 text-sm">ยินดีต้อนรับกลับมา,</p>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white font-kanit">{user.name}</h2>
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
            <span className="text-xs font-medium text-yellow-500">{user.memberTier} Member</span>
          </div>
        </div>
      </div>

      <div className="bg-roboss-dark border border-white/5 rounded-[2rem] p-4 flex items-center gap-4 relative overflow-hidden group active:scale-[0.98] transition-all">
        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck size={80} />
        </div>
        <div className="w-12 h-12 rounded-2xl gradient-premium-gold flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-900/20">
          <Star className="text-white" size={24} fill="currentColor" />
        </div>
        <div className="flex-1 space-y-2 relative z-10">
          <div className="flex justify-between items-end">
            <p className="text-xs font-bold text-white">อีกนิดเดียวจะถึงระดับ {nextTier}!</p>
            <p className="text-[10px] text-gray-500 font-medium">สะสมอีก {Math.max(0, 5000 - user.points)} แต้ม</p>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-200 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            ></div>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-600" />
      </div>

      <div className="bg-roboss-dark rounded-3xl p-6 relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10 flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-gray-400 text-xs uppercase tracking-widest">แต้มสะสมทั้งหมด</p>
            <p className="text-4xl font-bold text-white tracking-tight">{user.points.toLocaleString()}</p>
          </div>
          <button 
            onClick={onOpenRewards}
            className="text-black text-sm font-bold flex items-center gap-1 gradient-premium-gold px-4 py-2 rounded-xl active:scale-95 transition-transform shadow-lg shadow-yellow-950/40"
          >
            แลกรางวัล <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="gradient-red rounded-3xl p-5 flex items-center justify-between relative overflow-hidden shadow-lg shadow-red-950/20">
        <div className="absolute top-0 right-0 opacity-10 -mr-4 -mt-4 transform rotate-12">
            <Gift size={100} />
        </div>
        <div className="relative z-10 space-y-1">
          <h4 className="text-white font-bold text-sm">สิทธิพิเศษวันนี้!</h4>
          <p className="text-white/80 text-xs">ใช้ 500 แต้ม แลกฟรีบริการเคลือบเงา</p>
          <button className="mt-2 bg-white text-roboss-red px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md active:scale-95 transition-transform uppercase tracking-wider">
            แลกสิทธิ์เลย
          </button>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <Zap className="text-white" size={24} fill="white" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white font-kanit">สะสมแต้มล้างฟรี</h3>
          <p className="text-roboss-red text-sm font-medium">อีก {user.totalStamps - user.currentStamps} ครั้ง ฟรี!</p>
        </div>
        <StampCard current={user.currentStamps} total={user.totalStamps} />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white font-kanit">โปรโมชั่นและข่าวสาร</h3>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 snap-x">
          {banners.map((banner) => (
            <div key={banner.id} className="flex-shrink-0 w-[85%] snap-center rounded-[2rem] overflow-hidden relative aspect-[16/9] border border-white/5">
              <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" />
              <div className="absolute top-4 left-4">
                <span className="bg-roboss-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{banner.tag}</span>
              </div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h4 className="text-xl font-bold text-white mb-1 font-kanit">{banner.title}</h4>
                <p className="text-gray-300 text-sm line-clamp-1">{banner.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2.5rem] overflow-hidden relative group border border-white/5">
        <img src="https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&q=80&w=1000" alt="Car Wash" className="w-full h-56 object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-8 flex flex-col justify-end">
          <h4 className="text-2xl font-bold text-white mb-2 leading-tight font-kanit">บริการล้างรถแบบไร้สัมผัส (Touchless)</h4>
          <p className="text-gray-300 text-sm mb-6">รวดเร็ว สะอาด ปลอดภัยต่อสีรถ 100%</p>
          <button className="bg-white text-black font-bold py-3 px-8 rounded-2xl w-fit active:scale-95 transition-transform shadow-lg">ดูรายละเอียด</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
