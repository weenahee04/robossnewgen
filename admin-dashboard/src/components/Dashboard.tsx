import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Package,
  Award,
  Activity,
  LogOut,
  Box
} from 'lucide-react';
import { adminApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import StockManagement from './StockManagement';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [financialReport, setFinancialReport] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [showStockManagement, setShowStockManagement] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadFinancialReport();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAdminDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialReport = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      if (selectedPeriod === '7days') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (selectedPeriod === '30days') {
        startDate.setDate(startDate.getDate() - 30);
      } else if (selectedPeriod === 'thisMonth') {
        startDate.setDate(1);
      }

      const data = await adminApi.getFinancialReport(
        startDate.toISOString(),
        endDate.toISOString()
      );
      setFinancialReport(data);
    } catch (error) {
      console.error('Failed to load financial report:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  if (showStockManagement) {
    return <StockManagement onBack={() => setShowStockManagement(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!dashboardData || !financialReport) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">ไม่สามารถโหลดข้อมูลได้</div>
      </div>
    );
  }

  const { stats, recentTransactions, branchStats } = dashboardData;
  const { summary, revenueByDay, revenueByPackage, revenueByBranch, expensesByCategory } = financialReport;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-roboss-red rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-black text-white italic">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ROBOSS Admin</h1>
              <p className="text-gray-500 text-xs">ระบบจัดการหลังบ้าน</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowStockManagement(true)}
              className="bg-white/5 p-3 rounded-2xl text-gray-400 hover:text-white active:scale-95 transition-all"
              title="จัดการสต็อก"
            >
              <Box size={20} />
            </button>
            <button 
              onClick={loadDashboardData}
              className="bg-roboss-red/10 p-3 rounded-2xl text-roboss-red active:scale-95 transition-transform"
            >
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={logout}
              className="bg-white/5 p-3 rounded-2xl text-gray-400 hover:text-white active:scale-95 transition-all"
              title="ออกจากระบบ"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 py-6 space-y-8">
        {/* Period Selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { value: '7days', label: '7 วันล่าสุด' },
            { value: '30days', label: '30 วันล่าสุด' },
            { value: 'thisMonth', label: 'เดือนนี้' }
          ].map(period => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                selectedPeriod === period.value
                  ? 'bg-roboss-red text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* รายรับ */}
          <div className="bg-roboss-dark p-6 rounded-3xl border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <TrendingUp className="text-green-500" size={24} />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">รายรับทั้งหมด</p>
                <p className="text-2xl font-bold text-green-500">{formatCurrency(summary.revenue.total)}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">จำนวนรายการ</span>
                <span className="text-white font-medium">{formatNumber(summary.revenue.transactions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">เฉลี่ยต่อรายการ</span>
                <span className="text-white font-medium">{formatCurrency(summary.revenue.average)}</span>
              </div>
            </div>
          </div>

          {/* รายจ่าย */}
          <div className="bg-roboss-dark p-6 rounded-3xl border border-red-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-500/10">
                <TrendingDown className="text-red-500" size={24} />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">รายจ่าย (แต้มที่แลก)</p>
                <p className="text-2xl font-bold text-red-500">{formatNumber(summary.expenses.total)} แต้ม</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">จำนวนการแลก</span>
                <span className="text-white font-medium">{formatNumber(summary.expenses.redemptions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">เฉลี่ยต่อครั้ง</span>
                <span className="text-white font-medium">{formatNumber(Math.round(summary.expenses.average))} แต้ม</span>
              </div>
            </div>
          </div>

          {/* กำไรสุทธิ */}
          <div className="bg-roboss-dark p-6 rounded-3xl border border-yellow-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl gradient-premium-gold">
                <DollarSign className="text-black" size={24} />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">กำไรสุทธิ</p>
                <p className="text-2xl font-bold text-yellow-500">{formatCurrency(summary.netProfit)}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">อัตรากำไร</span>
                <span className="text-white font-medium">
                  {summary.revenue.total > 0 
                    ? ((summary.netProfit / summary.revenue.total) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-roboss-dark p-4 rounded-3xl border border-white/5">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-xl bg-roboss-red/10">
                <DollarSign className="text-roboss-red" size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                วันนี้
              </span>
            </div>
            <p className="text-gray-500 text-xs font-medium mb-1">ยอดขายวันนี้</p>
            <p className="text-xl font-bold text-white">{formatCurrency(stats.todayRevenue)}</p>
          </div>

          <div className="bg-roboss-dark p-4 rounded-3xl border border-white/5">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-xl bg-white/5">
                <Users className="text-roboss-red" size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                +{stats.newUsersToday}
              </span>
            </div>
            <p className="text-gray-500 text-xs font-medium mb-1">ผู้ใช้ทั้งหมด</p>
            <p className="text-xl font-bold text-white">{formatNumber(stats.totalUsers)}</p>
          </div>

          <div className="bg-roboss-dark p-4 rounded-3xl border border-white/5">
            <div className="p-2 rounded-xl bg-white/5 mb-3">
              <Activity className="text-roboss-red" size={18} />
            </div>
            <p className="text-gray-500 text-xs font-medium mb-1">สาขาที่เปิดอยู่</p>
            <p className="text-xl font-bold text-white">{stats.activeBranches}/{stats.totalBranches}</p>
          </div>

          <div className="bg-roboss-dark p-4 rounded-3xl border border-white/5">
            <div className="p-2 rounded-xl bg-white/5 mb-3">
              <BarChart3 className="text-roboss-red" size={18} />
            </div>
            <p className="text-gray-500 text-xs font-medium mb-1">รายการทั้งหมด</p>
            <p className="text-xl font-bold text-white">{formatNumber(summary.revenue.transactions)}</p>
          </div>
        </div>

        {/* รายรับแยกตามแพ็กเกจ */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Package size={20} className="text-roboss-red" />
            รายรับแยกตามแพ็กเกจ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {revenueByPackage.map((pkg: any, index: number) => (
              <div key={index} className="bg-roboss-dark p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{pkg.packageName}</span>
                  <span className="text-yellow-500 font-bold">{formatCurrency(pkg.revenue)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{pkg.count} รายการ</span>
                  <span className="text-gray-400">เฉลี่ย {formatCurrency(pkg.revenue / pkg.count)}</span>
                </div>
                <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full gradient-red"
                    style={{ width: `${(pkg.revenue / revenueByPackage[0].revenue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* รายรับแยกตามสาขา */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity size={20} className="text-roboss-red" />
            รายรับแยกตามสาขา
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {revenueByBranch.map((branch: any, index: number) => (
              <div key={index} className="bg-roboss-dark p-5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm">{branch.branchName}</h4>
                    <p className="text-gray-500 text-xs">{branch.count} รายการ</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-500 font-bold text-lg">{formatCurrency(branch.revenue)}</p>
                    <p className="text-gray-400 text-xs">เฉลี่ย {formatCurrency(branch.revenue / branch.count)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* รายจ่ายแยกตามประเภทรางวัล */}
        {expensesByCategory.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award size={20} className="text-roboss-red" />
              รายจ่าย (การแลกรางวัล)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expensesByCategory.map((cat: any, index: number) => (
                <div key={index} className="bg-roboss-dark p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{cat.category}</span>
                    <span className="text-red-500 font-bold">{formatNumber(cat.points)} แต้ม</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{cat.count} ครั้ง</span>
                    <span className="text-gray-400">เฉลี่ย {formatNumber(Math.round(cat.points / cat.count))} แต้ม</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* รายการล่าสุด */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">รายการล่าสุด</h3>
          <div className="bg-roboss-dark rounded-3xl overflow-hidden border border-white/5">
            {recentTransactions.slice(0, 10).map((tx: any, i: number) => (
              <div key={i} className={`p-4 flex items-center justify-between ${i !== 9 ? 'border-b border-white/5' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xs font-bold text-gray-400">
                    {new Date(tx.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{tx.userName}</p>
                    <p className="text-gray-500 text-[10px]">{tx.packageName} • {tx.branchName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-yellow-500">{formatCurrency(tx.amount)}</p>
                  <p className="text-green-500 text-[10px] uppercase font-bold tracking-wider">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs pb-4">Roboss Management System v2.0</p>
      </div>
    </div>
  );
};

export default Dashboard;
