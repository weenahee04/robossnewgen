
import React from 'react';
import { WashHistory } from '../types';
import { Calendar, CreditCard, Star, History } from 'lucide-react';

interface HistoryPageProps {
  history: WashHistory[];
}

const HistoryPage: React.FC<HistoryPageProps> = ({ history }) => {
  return (
    <div className="px-6 py-4 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">ประวัติการใช้บริการ</h2>
        <p className="text-gray-400 text-sm">รวมประวัติการล้างรถของคุณทั้งหมด</p>
      </div>

      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((item) => (
            <div key={item.id} className="bg-roboss-dark p-5 rounded-3xl border border-white/5 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                    <Calendar size={20} className="text-roboss-red" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-white font-semibold">{item.package}</p>
                    <p className="text-gray-500 text-xs">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{item.price} ฿</p>
                  <div className="flex items-center gap-1 justify-end text-xs text-yellow-500 font-medium">
                    <Star size={12} fill="currentColor" />
                    +{item.pointsEarned} แต้ม
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <CreditCard size={12} />
                  ชำระผ่าน TrueMoney
                </div>
                <button className="text-[10px] font-bold uppercase tracking-wider text-roboss-red bg-roboss-red/10 px-3 py-1 rounded-full">
                  ดาวน์โหลดใบเสร็จ
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
              <History size={32} className="text-gray-600" />
            </div>
            <p className="text-gray-500">ยังไม่มีประวัติการล้างรถ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
