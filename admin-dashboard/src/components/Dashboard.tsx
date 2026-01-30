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
  Box,
  MapPin,
  FileText,
  ShoppingBag,
  Gift,
  Menu as MenuIcon,
  X,
  Wrench
} from 'lucide-react';
import { adminApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import StockManagement from './StockManagement';
import BranchManagement from './BranchManagement';
import UserManagement from './UserManagement';
import TransactionsManagement from './TransactionsManagement';
import PackagesManagement from './PackagesManagement';
import RewardsManagement from './RewardsManagement';
import ReportsManagement from './ReportsManagement';
import UserGuideManagement from './UserGuideManagement';
import MaintenanceManagement from './MaintenanceManagement';

type MenuPage = 'dashboard' | 'users' | 'transactions' | 'packages' | 'rewards' | 'stock' | 'branches' | 'reports' | 'guide' | 'maintenance';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [financialReport, setFinancialReport] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [currentPage, setCurrentPage] = useState<MenuPage>('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    } catch (error: any) {
      const errorMessage = error?.message || '';
      if (
        errorMessage.includes('API_URL not configured') ||
        errorMessage.includes('Empty response') ||
        errorMessage.includes('Network error') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('ERR_CONNECTION_REFUSED')
      ) {
        console.log('Using demo mode - no backend available');
        // Demo data - structure must match what component expects
        setDashboardData({
          stats: {
            totalRevenue: 125000,
            totalUsers: 1250,
            totalTransactions: 345,
            averageOrderValue: 362,
            todayRevenue: 8500,
            newUsersToday: 12,
            activeBranches: 3,
            totalBranches: 3,
            growth: {
              revenue: 12.5,
              users: 8.3,
              transactions: 15.2,
            }
          },
          recentTransactions: []
        });
      } else {
        console.error('Failed to load dashboard data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialReport = async () => {
    try {
      const data = await adminApi.getFinancialReport(selectedPeriod);
      setFinancialReport(data);
    } catch (error: any) {
      const errorMessage = error?.message || '';
      if (
        errorMessage.includes('API_URL not configured') ||
        errorMessage.includes('Empty response') ||
        errorMessage.includes('Network error') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('ERR_CONNECTION_REFUSED')
      ) {
        console.log('Using demo mode - no backend available');
        // Demo financial data - structure must match what component expects
        setFinancialReport({
          summary: {
            revenue: {
              total: 125000,
              transactions: 345,
              average: 362
            },
            expenses: {
              total: 45000,
              redemptions: 120,
              average: 375
            },
            netProfit: 80000,
            profitMargin: 64
          },
          revenueByPackage: [
            { packageName: 'Basic Wash', revenue: 45000, count: 150 },
            { packageName: 'Premium Wash', revenue: 55000, count: 120 },
            { packageName: 'Full Service', revenue: 25000, count: 75 },
          ],
          revenueByBranch: [
            { branchName: 'สาขา 1', revenue: 60000, count: 200 },
            { branchName: 'สาขา 2', revenue: 45000, count: 100 },
            { branchName: 'สาขา 3', revenue: 20000, count: 45 },
          ],
          expensesByCategory: [
            { category: 'ส่วนลด', points: 20000, count: 80 },
            { category: 'ของรางวัล', points: 15000, count: 30 },
            { category: 'บริการพิเศษ', points: 10000, count: 10 },
          ]
        });
      } else {
        console.error('Failed to load financial report:', error);
      }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  if (!dashboardData || !financialReport) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  const { stats, recentTransactions } = dashboardData;
  const { summary, revenueByPackage, revenueByBranch, expensesByCategory } = financialReport;
  
  // Safety checks for nested properties
  if (!stats || !summary || !summary.revenue || !summary.expenses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard' as MenuPage, icon: BarChart3, label: 'Dashboard' },
    { id: 'users' as MenuPage, icon: Users, label: 'ผู้ใช้' },
    { id: 'transactions' as MenuPage, icon: ShoppingBag, label: 'รายการ' },
    { id: 'packages' as MenuPage, icon: Package, label: 'แพ็กเกจ' },
    { id: 'rewards' as MenuPage, icon: Gift, label: 'รางวัล' },
    { id: 'stock' as MenuPage, icon: Box, label: 'สต็อก' },
    { id: 'branches' as MenuPage, icon: MapPin, label: 'สาขา' },
    { id: 'reports' as MenuPage, icon: FileText, label: 'รายงาน' },
    { id: 'guide' as MenuPage, icon: Gift, label: 'คู่มือการใช้งาน' },
    { id: 'maintenance' as MenuPage, icon: Wrench, label: 'บำรุงรักษา' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-red rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-black text-white italic">R</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">ROBOSS</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  currentPage === item.id
                    ? 'bg-red-50 text-red-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} className={currentPage === item.id ? 'text-red-600' : 'text-gray-600'} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={20} />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {showMobileMenu ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
                </h2>
                <p className="text-gray-500 text-xs">ระบบจัดการหลังบ้าน</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={loadDashboardData}
                className="bg-red-50 p-3 rounded-xl text-red-600 hover:bg-red-100 active:scale-95 transition-transform"
                title="รีเฟรช"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Dashboard Page */}
          {currentPage === 'dashboard' && (
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
                        ? 'gradient-red text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* รายรับ */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-green-50">
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">รายรับทั้งหมด</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.revenue.total)}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">จำนวนรายการ</span>
                      <span className="text-gray-900 font-medium">{formatNumber(summary.revenue.transactions)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">เฉลี่ยต่อรายการ</span>
                      <span className="text-gray-900 font-medium">{formatCurrency(summary.revenue.average)}</span>
                    </div>
                  </div>
                </div>

                {/* รายจ่าย */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-red-50">
                      <TrendingDown className="text-red-600" size={24} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">รายจ่าย (แต้มที่แลก)</p>
                      <p className="text-2xl font-bold text-red-600">{formatNumber(summary.expenses.total)} แต้ม</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">จำนวนการแลก</span>
                      <span className="text-gray-900 font-medium">{formatNumber(summary.expenses.redemptions)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">เฉลี่ยต่อครั้ง</span>
                      <span className="text-gray-900 font-medium">{formatNumber(Math.round(summary.expenses.average))} แต้ม</span>
                    </div>
                  </div>
                </div>

                {/* กำไรสุทธิ */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-yellow-50">
                      <DollarSign className="text-yellow-600" size={24} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">กำไรสุทธิ</p>
                      <p className="text-2xl font-bold text-yellow-600">{formatCurrency(summary.netProfit)}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">อัตรากำไร</span>
                      <span className="text-gray-900 font-medium">
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
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-xl bg-red-50">
                <DollarSign className="text-red-600" size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                วันนี้
              </span>
            </div>
            <p className="text-gray-600 text-xs font-medium mb-1">ยอดขายวันนี้</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.todayRevenue)}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-xl bg-red-50">
                <Users className="text-red-600" size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                +{stats.newUsersToday}
              </span>
            </div>
            <p className="text-gray-600 text-xs font-medium mb-1">ผู้ใช้ทั้งหมด</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-2 rounded-xl bg-red-50 mb-3">
              <Activity className="text-red-600" size={18} />
            </div>
            <p className="text-gray-600 text-xs font-medium mb-1">สาขาที่เปิดอยู่</p>
            <p className="text-xl font-bold text-gray-900">{stats.activeBranches}/{stats.totalBranches}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-2 rounded-xl bg-red-50 mb-3">
              <BarChart3 className="text-red-600" size={18} />
            </div>
            <p className="text-gray-600 text-xs font-medium mb-1">รายการทั้งหมด</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(summary.revenue.transactions)}</p>
          </div>
              </div>

              {/* รายรับแยกตามแพ็กเกจ */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package size={20} className="text-red-600" />
                  รายรับแยกตามแพ็กเกจ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {revenueByPackage.map((pkg: any, index: number) => (
                    <div key={index} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-900 font-medium">{pkg.packageName}</span>
                        <span className="text-red-600 font-bold">{formatCurrency(pkg.revenue)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{pkg.count} รายการ</span>
                        <span className="text-gray-500">เฉลี่ย {formatCurrency(pkg.revenue / pkg.count)}</span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
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
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Activity size={20} className="text-red-600" />
                  รายรับแยกตามสาขา
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {revenueByBranch.map((branch: any, index: number) => (
                    <div key={index} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-gray-900 font-bold text-sm">{branch.branchName}</h4>
                          <p className="text-gray-600 text-xs">{branch.count} รายการ</p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-600 font-bold text-lg">{formatCurrency(branch.revenue)}</p>
                          <p className="text-gray-500 text-xs">เฉลี่ย {formatCurrency(branch.revenue / branch.count)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* รายจ่ายแยกตามประเภทรางวัล */}
              {expensesByCategory.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Award size={20} className="text-red-600" />
                    รายจ่าย (การแลกรางวัล)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {expensesByCategory.map((cat: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-medium">{cat.category}</span>
                          <span className="text-red-600 font-bold">{formatNumber(cat.points)} แต้ม</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{cat.count} ครั้ง</span>
                          <span className="text-gray-500">เฉลี่ย {formatNumber(Math.round(cat.points / cat.count))} แต้ม</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* รายการล่าสุด */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">รายการล่าสุด</h3>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  {recentTransactions && recentTransactions.length > 0 ? (
                    recentTransactions.slice(0, 10).map((tx: any, i: number) => (
                      <div key={i} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${i !== 9 ? 'border-b border-gray-100' : ''}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-bold text-gray-600">
                            {new Date(tx.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div>
                            <p className="text-gray-900 font-bold text-sm">{tx.userName}</p>
                            <p className="text-gray-600 text-[10px]">{tx.packageName} • {tx.branchName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-red-600">{formatCurrency(tx.amount)}</p>
                          <p className="text-green-600 text-[10px] uppercase font-bold tracking-wider">{tx.status}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">ไม่มีรายการ</div>
                  )}
                </div>
              </div>

              <p className="text-center text-gray-500 text-xs pb-4">Roboss Management System v2.0</p>
            </div>
          )}

          {/* Users Page */}
          {currentPage === 'users' && <UserManagement onBack={() => setCurrentPage('dashboard')} />}

          {/* Transactions Page */}
          {currentPage === 'transactions' && <TransactionsManagement onBack={() => setCurrentPage('dashboard')} />}

          {/* Packages Page */}
          {currentPage === 'packages' && <PackagesManagement onBack={() => setCurrentPage('dashboard')} />}

          {/* Rewards Page */}
          {currentPage === 'rewards' && <RewardsManagement onBack={() => setCurrentPage('dashboard')} />}

          {/* Stock Page */}
          {currentPage === 'stock' && <StockManagement onBack={() => setCurrentPage('dashboard')} />}

          {/* Branches Page */}
          {currentPage === 'branches' && <BranchManagement onBack={() => setCurrentPage('dashboard')} />}

          {/* Reports Page */}
          {currentPage === 'reports' && <ReportsManagement onBack={() => setCurrentPage('dashboard')} />}
          {currentPage === 'guide' && <UserGuideManagement onBack={() => setCurrentPage('dashboard')} />}
          {currentPage === 'maintenance' && <MaintenanceManagement onBack={() => setCurrentPage('dashboard')} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
