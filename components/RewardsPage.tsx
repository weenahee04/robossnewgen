
import React from 'react';
import { User, Reward } from '../types';
import { ChevronLeft, Star, ShoppingBag, Gift } from 'lucide-react';

interface RewardsPageProps {
  user: User;
  onBack: () => void;
}

const RewardsPage: React.FC<RewardsPageProps> = ({ user, onBack }) => {
  const rewards: Reward[] = [
    { id: '1', name: 'น้ำหอมปรับอากาศ Roboss', points: 300, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400', category: 'Accessories' },
    { id: '2', name: 'ผ้าไมโครไฟเบอร์เกรดพรีเมียม', points: 500, image: 'https://images.unsplash.com/photo-1555529771-7888783a18d3?auto=format&fit=crop&q=80&w=400', category: 'Accessories' },
    { id: '3', name: 'คูปองล้างรถ Premium ฟรี', points: 1500, image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=400', category: 'Voucher' },
    { id: '4', name: 'บัตรเติมเงิน TrueMoney 100.-', points: 2000, image: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=400', category: 'Money' },
  ];

  return (
    <div className="min-h-screen bg-black pb-10">
      <div className="px-6 py-6 space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl text-white active:scale-90 transition-transform">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white font-kanit">แลกของรางวัล</h2>
        </div>

        {/* Points Card */}
        <div className="gradient-premium-gold p-6 rounded-[2.5rem] flex items-center justify-between shadow-xl shadow-yellow-950/30">
          <div>
            <p className="text-black/60 text-xs font-bold uppercase tracking-widest">แต้มของคุณ</p>
            <p className="text-4xl font-black text-black">{user.points.toLocaleString()}</p>
          </div>
          <div className="bg-black/10 p-4 rounded-3xl">
            <Star className="text-black" size={32} fill="black" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {['ทั้งหมด', 'ของที่ระลึก', 'Voucher', 'บัตรกำนัล'].map((cat, i) => (
            <button key={i} className={`flex-shrink-0 px-6 py-2 rounded-full text-xs font-bold border transition-all ${i === 0 ? 'bg-roboss-red border-roboss-red text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-roboss-dark rounded-3xl border border-white/5 overflow-hidden flex flex-col group">
              <div className="h-32 relative overflow-hidden">
                <img src={reward.image} alt={reward.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                  <Star size={10} className="text-yellow-500" fill="currentColor" />
                  <span className="text-[10px] text-white font-bold">{reward.points}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">{reward.name}</h4>
                <button 
                  disabled={user.points < reward.points}
                  className={`w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${user.points >= reward.points ? 'gradient-premium-gold text-black shadow-lg shadow-yellow-950/20' : 'bg-white/5 text-gray-600 grayscale cursor-not-allowed'}`}
                >
                  {user.points >= reward.points ? 'แลกแต้มเลย' : 'แต้มไม่พอ'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-roboss-dark p-8 rounded-[2.5rem] border border-dashed border-white/10 text-center space-y-2">
            <Gift className="mx-auto text-gray-700" size={40} />
            <p className="text-gray-500 text-sm">เรากำลังเตรียมของรางวัลเพิ่มขึ้นอีก!</p>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
