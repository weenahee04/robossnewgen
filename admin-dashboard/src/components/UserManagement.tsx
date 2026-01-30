import React, { useState, useEffect } from 'react';
import { Users, Search, ArrowLeft } from 'lucide-react';
import { adminApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  memberTier: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
  currentStamps: number;
  totalStamps: number;
  points: number;
  totalSpent: number;
  joinDate: string;
  lineUserId?: string;
  pictureUrl?: string;
}

const UserManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      // Use demo data as fallback
      setUsers([
        {
          id: 'u1',
          name: 'สมชาย ใจดี',
          phone: '081-234-5678',
          email: 'somchai@example.com',
          memberTier: 'Gold',
          currentStamps: 7,
          totalStamps: 10,
          points: 1250,
          totalSpent: 15000,
          joinDate: '2024-01-15',
          pictureUrl: 'https://via.placeholder.com/150/E5E7EB/6B7280?text=User'
        },
        {
          id: 'u2',
          name: 'สมหญิง รักสวย',
          phone: '082-345-6789',
          memberTier: 'Platinum',
          currentStamps: 9,
          totalStamps: 10,
          points: 2500,
          totalSpent: 35000,
          joinDate: '2023-11-20',
          pictureUrl: 'https://via.placeholder.com/150/E5E7EB/6B7280?text=User'
        },
        {
          id: 'u3',
          name: 'วิชัย แข็งแรง',
          phone: '083-456-7890',
          memberTier: 'Silver',
          currentStamps: 3,
          totalStamps: 10,
          points: 580,
          totalSpent: 8500,
          joinDate: '2024-02-10',
          pictureUrl: 'https://via.placeholder.com/150/E5E7EB/6B7280?text=User'
        },
        {
          id: 'u4',
          name: 'ประภา สว่างใส',
          phone: '084-567-8901',
          memberTier: 'Standard',
          currentStamps: 1,
          totalStamps: 10,
          points: 150,
          totalSpent: 2500,
          joinDate: '2024-03-05',
          pictureUrl: 'https://via.placeholder.com/150/E5E7EB/6B7280?text=User'
        },
        {
          id: 'u5',
          name: 'ธนา มั่งคั่ง',
          phone: '085-678-9012',
          email: 'thana@example.com',
          memberTier: 'Gold',
          currentStamps: 5,
          totalStamps: 10,
          points: 1800,
          totalSpent: 22000,
          joinDate: '2023-12-01',
          pictureUrl: 'https://via.placeholder.com/150/E5E7EB/6B7280?text=User'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTier = filterTier === 'all' || user.memberTier === filterTier;
    
    return matchesSearch && matchesTier;
  });

  const getTierColor = (_tier: string) => {
    // ทุกระดับใช้สีแดงเหมือนกัน
    return 'bg-red-50 text-red-600';
  };

  const getTierBadge = (_tier: string) => {
    // ใช้ไอคอนเดียวกันทั้งหมด
    return '🏆';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">กำลังโหลดข้อมูลผู้ใช้...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้</h2>
        <div className="w-6"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">ผู้ใช้ทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="text-red-600" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Platinum</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => u.memberTier === 'Platinum').length}
              </p>
            </div>
            <span className="text-3xl">💎</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Gold</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => u.memberTier === 'Gold').length}
              </p>
            </div>
            <span className="text-3xl">🥇</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Silver</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => u.memberTier === 'Silver').length}
              </p>
            </div>
            <span className="text-3xl">🥈</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, เบอร์โทร, อีเมล..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { value: 'all', label: 'ทั้งหมด', count: users.length },
            { value: 'Platinum', label: '💎 Platinum', count: users.filter(u => u.memberTier === 'Platinum').length },
            { value: 'Gold', label: '🥇 Gold', count: users.filter(u => u.memberTier === 'Gold').length },
            { value: 'Silver', label: '🥈 Silver', count: users.filter(u => u.memberTier === 'Silver').length },
            { value: 'Standard', label: '🔰 Standard', count: users.filter(u => u.memberTier === 'Standard').length },
          ].map(tier => (
            <button
              key={tier.value}
              onClick={() => setFilterTier(tier.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                filterTier === tier.value
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tier.label} ({tier.count})
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedUser(user);
              setShowDetailModal(true);
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <img
                src={user.pictureUrl || 'https://via.placeholder.com/150/E5E7EB/6B7280?text=User'}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-gray-200"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{user.phone}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getTierColor(user.memberTier)}`}>
                  {getTierBadge(user.memberTier)} {user.memberTier}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">แต้มสะสม:</span>
                <span className="font-bold text-red-600">{user.points} แต้ม</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ซื้อสะสม:</span>
                <span className="font-bold text-gray-900">{formatCurrency(user.totalSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">แสตมป์:</span>
                <span className="font-bold text-blue-600">{user.currentStamps}/{user.totalStamps}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>เข้าร่วม: {formatDate(user.joinDate)}</span>
                <button className="text-red-600 hover:text-red-700 font-semibold">
                  ดูรายละเอียด →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">ไม่พบผู้ใช้ที่ค้นหา</p>
        </div>
      )}

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">รายละเอียดผู้ใช้</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.pictureUrl || 'https://via.placeholder.com/150/E5E7EB/6B7280?text=User'}
                  alt={selectedUser.name}
                  className="w-20 h-20 rounded-full border-2 border-gray-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${getTierColor(selectedUser.memberTier)}`}>
                    {getTierBadge(selectedUser.memberTier)} {selectedUser.memberTier}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">เบอร์โทร:</span>
                  <span className="font-semibold text-gray-900">{selectedUser.phone}</span>
                </div>
                {selectedUser.email && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">อีเมล:</span>
                    <span className="font-semibold text-gray-900">{selectedUser.email}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">แต้มสะสม:</span>
                  <span className="font-bold text-red-600">{selectedUser.points} แต้ม</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">ซื้อสะสม:</span>
                  <span className="font-bold text-gray-900">{formatCurrency(selectedUser.totalSpent)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">แสตมป์:</span>
                  <span className="font-bold text-blue-600">{selectedUser.currentStamps}/{selectedUser.totalStamps}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">วันที่เข้าร่วม:</span>
                  <span className="font-semibold text-gray-900">{formatDate(selectedUser.joinDate)}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
