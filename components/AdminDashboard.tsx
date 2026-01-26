
import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Power, 
  AlertCircle, 
  Activity, 
  TrendingUp, 
  ChevronRight, 
  Box, 
  MonitorSmartphone,
  RefreshCw,
  Search,
  DollarSign
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('Bangna');
  
  const stats = [
    { label: 'ยอดขายวันนี้', value: '12,450 ฿', trend: '+12%', icon: <DollarSign size={18} />, special: true },
    { label: 'ผู้ใช้งานใหม่', value: '48 คน', trend: '+5%', icon: <Users size={18} /> },
    { label: 'เครื่องที่เปิดอยู่', value: '12/14', trend: 'ปกติ', icon: <MonitorSmartphone size={18} /> },
  ];

  const branches = [
    { name: 'Bangna', status: 'Online', load: '65%', revenue: '4,200 ฿' },
    { name: 'Rama 9', status: 'Online', load: '88%', revenue: '6,850 ฿' },
    { name: 'Rangsit', status: 'Warning', load: '12%', revenue: '1,400 ฿' },
  ];

  const recentTransactions = [
    { user: 'คุณวิชัย', pkg: 'Premium', time: '10:45', status: 'Success', amount: '250 ฿' },
    { user: 'คุณสุนิสา', pkg: 'Basic', time: '10:32', status: 'Success', amount: '100 ฿' },
    { user: 'คุณประเสริฐ', pkg: 'Ultimate', time: '10:15', status: 'Success', amount: '490 ฿' },
  ];

  return (
    <div className="px-6 py-6 space-y-8 bg-black min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-500 text-sm">ยินดีต้อนรับ, แอดมิน Roboss</p>
        </div>
        <button className="bg-roboss-red/10 p-3 rounded-2xl text-roboss-red active:scale-95 transition-transform">
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`bg-roboss-dark p-4 rounded-3xl border border-white/5 space-y-3 ${i === 0 ? 'col-span-2' : ''} ${s.special ? 'ring-1 ring-yellow-500/20' : ''}`}>
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-xl ${s.special ? 'gradient-premium-gold text-black' : 'bg-white/5 text-roboss-red'}`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-white/10 text-gray-400'}`}>
                {s.trend}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium">{s.label}</p>
              <p className={`text-2xl font-bold ${s.special ? 'text-yellow-500' : 'text-white'}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Branch Control Panel */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings size={20} className="text-roboss-red" />
          การจัดการสาขา
        </h3>
        <div className="space-y-3">
          {branches.map((b) => (
            <div key={b.name} className="bg-roboss-dark p-5 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-roboss-red/30 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${b.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]'}`}></div>
                <div>
                  <h4 className="text-white font-bold text-sm">สาขา {b.name}</h4>
                  <p className="text-gray-500 text-xs">Load: {b.load} | <span className="text-yellow-500/80 font-medium">{b.revenue}</span></p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-white/5 p-2 rounded-xl text-gray-400 hover:text-white">
                  <Activity size={18} />
                </button>
                <button className="bg-white/5 p-2 rounded-xl text-gray-400 hover:text-white">
                  <Power size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">รายการล่าสุด</h3>
          <button className="text-roboss-red text-xs font-bold flex items-center gap-1">
            ดูทั้งหมด <ChevronRight size={14} />
          </button>
        </div>
        <div className="bg-roboss-dark rounded-[2.5rem] overflow-hidden border border-white/5">
          {recentTransactions.map((tx, i) => (
            <div key={i} className={`p-4 flex items-center justify-between ${i !== recentTransactions.length - 1 ? 'border-b border-white/5' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xs font-bold text-gray-400">
                  {tx.time}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{tx.user}</p>
                  <p className="text-gray-500 text-[10px]">{tx.pkg} Wash</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${tx.pkg === 'Ultimate' ? 'text-yellow-500' : 'text-white'}`}>{tx.amount}</p>
                <p className="text-green-500 text-[10px] uppercase font-bold tracking-wider">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tools */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: <Box size={20} />, label: 'สต็อก' },
          { icon: <AlertCircle size={20} />, label: 'แจ้งซ่อม' },
          { icon: <Search size={20} />, label: 'ค้นหา' },
          { icon: <Settings size={20} />, label: 'ตั้งค่า' },
        ].map((tool, i) => (
          <button key={i} className="flex flex-col items-center gap-2 p-3 bg-roboss-dark rounded-2xl border border-white/5 active:scale-95 transition-transform">
            <div className="text-gray-400">{tool.icon}</div>
            <span className="text-[10px] text-gray-500 font-medium">{tool.label}</span>
          </button>
        ))}
      </div>
      
      <p className="text-center text-gray-600 text-xs">Roboss Management System v1.2</p>
    </div>
  );
};

export default AdminDashboard;
