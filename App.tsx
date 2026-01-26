
import React, { useState, useEffect } from 'react';
import { User, WashHistory, Notification } from './types';
import { LayoutDashboard, User as UserIcon, Bell, QrCode, LogOut } from 'lucide-react';
import HomePage from './components/HomePage';
import PackagesPage from './components/PackagesPage';
import HistoryPage from './components/HistoryPage';
import ProfilePage from './components/ProfilePage';
import BranchesPage from './components/BranchesPage';
import AdminDashboardNew from './components/AdminDashboardNew';
import BottomNav from './components/BottomNav';
import QRModal from './components/QRModal';
import RewardsPage from './components/RewardsPage';
import NotificationsPage from './components/NotificationsPage';
import LoginPageNew from './components/LoginPageNew';
import LineLoginPage from './components/LineLoginPage';
import { useAuth } from './src/contexts/AuthContext';
import { api } from './src/services/api';

const App: React.FC = () => {
  const { user: authUser, loading, logout } = useAuth();
  const [isLiffEnvironment, setIsLiffEnvironment] = useState(false);

  useEffect(() => {
    const checkLiffEnvironment = () => {
      const isInLineApp = /Line/i.test(navigator.userAgent);
      const hasLiffParam = window.location.search.includes('liff.state');
      setIsLiffEnvironment(isInLineApp || hasLiffParam);
    };
    checkLiffEnvironment();
  }, []);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [activeTab, setActiveTab] = useState<'home' | 'packages' | 'branches' | 'history' | 'profile' | 'admin' | 'rewards' | 'notifications'>('home');
  const [showQR, setShowQR] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [history, setHistory] = useState<WashHistory[]>([]);

  useEffect(() => {
    if (authUser) {
      loadNotifications();
      loadHistory();
    }
  }, [authUser]);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      const formatted = data.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        time: formatTime(n.createdAt),
        type: n.type,
        unread: !n.isRead
      }));
      setNotifications(formatted);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await api.getTransactions();
      const formatted = data.map((t: any) => ({
        id: t.id,
        date: formatDate(t.createdAt),
        package: t.packageName,
        price: t.amount,
        pointsEarned: t.pointsEarned
      }));
      setHistory(formatted);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return 'เมื่อสักครู่';
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return `${days} วันที่แล้ว`;
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  if (!authUser) {
    if (isLiffEnvironment) {
      return <LineLoginPage />;
    }
    return <LoginPageNew />;
  }

  const user: User = {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    phone: authUser.phone || '',
    points: authUser.points,
    currentStamps: authUser.currentStamps,
    totalStamps: authUser.totalStamps,
    memberTier: authUser.memberTier,
    lineUserId: authUser.lineUserId,
    pictureUrl: authUser.pictureUrl
  };

  const toggleRole = () => {
    const newRole = role === 'user' ? 'admin' : 'user';
    setRole(newRole);
    setActiveTab(newRole === 'admin' ? 'admin' : 'home');
  };

  const handleLogout = () => {
    logout();
    setActiveTab('home');
  };

  const renderPage = () => {
    if (role === 'admin') return <AdminDashboardNew />;

    switch (activeTab) {
      case 'home':
        return <HomePage user={user} onOpenQR={() => setShowQR(true)} onOpenRewards={() => setActiveTab('rewards')} />;
      case 'packages':
        return <PackagesPage />;
      case 'branches':
        return <BranchesPage />;
      case 'history':
        return <HistoryPage history={history} />;
      case 'profile':
        return <ProfilePage user={user} onLogout={handleLogout} />;
      case 'rewards':
        return <RewardsPage user={user} onBack={() => setActiveTab('home')} />;
      case 'notifications':
        return <NotificationsPage notifications={notifications} onBack={() => setActiveTab('home')} />;
      default:
        return <HomePage user={user} onOpenQR={() => setShowQR(true)} onOpenRewards={() => setActiveTab('rewards')} />;
    }
  };

  const showNavbar = role === 'user' && !['rewards', 'notifications'].includes(activeTab);

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto relative bg-black shadow-2xl overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 bg-roboss-red rounded-lg flex items-center justify-center font-bold text-white italic shadow-lg shadow-red-600/20">R</div>
          <h1 className="text-xl font-bold tracking-tight text-white italic">ROBOSS {role === 'admin' && <span className="text-[10px] not-italic bg-white/10 px-2 py-0.5 rounded-full ml-1 align-middle uppercase text-gray-400 font-kanit">Admin</span>}</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={toggleRole} className="p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
            {role === 'user' ? <LayoutDashboard size={20} /> : <UserIcon size={20} />}
          </button>
          <button onClick={() => setActiveTab('notifications')} className="relative p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white">
            <Bell size={22} />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-roboss-red rounded-full border-2 border-black"></span>
            )}
          </button>
          <button onClick={handleLogout} className="p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors" title="ออกจากระบบ">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {renderPage()}
      </main>

      {/* Floating Action Button (QR) - Only for User on main tabs */}
      {showNavbar && (
        <button 
          onClick={() => setShowQR(true)}
          className="fixed bottom-24 right-6 z-50 gradient-red p-4 rounded-2xl shadow-lg shadow-red-600/30 active:scale-95 transition-transform"
        >
          <QrCode size={28} color="white" />
        </button>
      )}

      {/* Bottom Navigation */}
      {showNavbar && <BottomNav activeTab={activeTab as any} setActiveTab={setActiveTab} />}

      {/* QR Code Modal */}
      {showQR && <QRModal user={user} onClose={() => setShowQR(false)} />}
    </div>
  );
};

export default App;
