
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Search, ChevronRight, Car } from 'lucide-react';
import { Branch } from '../types';

const BranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: 'b1',
      name: 'Roboss สาขาบางนา',
      address: 'ถ.บางนา-ตราด กม. 4 กรุงเทพฯ',
      distance: '1.2 กม.',
      status: 'Available',
      waitingCars: 0,
      lat: 13.6682,
      lng: 100.6331,
      image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'b2',
      name: 'Roboss สาขาพระราม 9',
      address: 'ติดห้างสรรพสินค้าชื่อดัง ถ.พระราม 9',
      distance: '3.5 กม.',
      status: 'Busy',
      waitingCars: 3,
      lat: 13.7538,
      lng: 100.5634,
      image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'b3',
      name: 'Roboss สาขารังสิต',
      address: 'ถ.พหลโยธิน เยื้องฟิวเจอร์พาร์ค',
      distance: '12.8 กม.',
      status: 'Available',
      waitingCars: 1,
      lat: 13.9889,
      lng: 100.6177,
      image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&q=80&w=400'
    }
  ]);

  return (
    <div className="px-6 py-4 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">สาขาใกล้เคียง</h2>
        <p className="text-gray-400 text-sm">ค้นหาสาขา Roboss ที่สะดวกที่สุดสำหรับคุณ</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="ค้นหาสาขา หรือ ถนน..."
          className="w-full bg-roboss-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-roboss-red/50 transition-all"
        />
      </div>

      {/* Map View Placeholder */}
      <div className="relative h-48 rounded-[2.5rem] overflow-hidden border border-white/5">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
          alt="Map View" 
          className="w-full h-full object-cover opacity-60 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-between items-end">
            <div className="bg-roboss-red text-white p-3 rounded-2xl shadow-xl shadow-red-950/40">
                <MapPin size={20} fill="white" />
            </div>
            <button className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/10">
                ดูแผนที่ขยาย
            </button>
        </div>
      </div>

      {/* Branch List */}
      <div className="space-y-4">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-roboss-dark p-5 rounded-[2rem] border border-white/5 space-y-4 transition-all hover:border-roboss-red/20 active:scale-[0.98]">
            <div className="flex gap-4">
              <img src={branch.image} alt={branch.name} className="w-20 h-20 rounded-2xl object-cover" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-bold text-sm leading-tight">{branch.name}</h4>
                  <span className="text-roboss-red text-xs font-bold">{branch.distance}</span>
                </div>
                <p className="text-gray-500 text-[10px] line-clamp-1">{branch.address}</p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${branch.status === 'Available' ? 'bg-green-500' : branch.status === 'Busy' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] text-gray-400">{branch.status === 'Available' ? 'พร้อมให้บริการ' : 'ค่อนข้างหนาแน่น'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Car size={10} />
                    รอ {branch.waitingCars} คิว
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-roboss-red/10 text-roboss-red py-3 rounded-xl text-xs font-bold hover:bg-roboss-red/20 transition-colors">
                <Navigation size={14} /> นำทาง
              </button>
              <button className="flex items-center justify-center bg-white/5 text-gray-400 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchesPage;
