import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, ArrowLeft, DollarSign, Package } from 'lucide-react';
import { adminApi } from '../services/api';

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  packageName: string;
  branchId: string;
  branchName: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
}

const TransactionsManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBranch, setFilterBranch] = useState<string>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getTransactions({ limit: 100 });
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      // Use demo data as fallback
      setTransactions([
        {
          id: 't1',
          userId: 'u1',
          userName: 'สมชาย ใจดี',
          packageId: 'p1',
          packageName: 'ล้างพื้นฐาน',
          branchId: 'b1',
          branchName: 'สาขาบางนา',
          amount: 150,
          status: 'completed',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 't2',
          userId: 'u2',
          userName: 'สมหญิง รักสวย',
          packageId: 'p2',
          packageName: 'ล้างพรีเมียม',
          branchId: 'b2',
          branchName: 'สาขาพระราม 9',
          amount: 350,
          status: 'completed',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 't3',
          userId: 'u3',
          userName: 'วิชัย แข็งแรง',
          packageId: 'p1',
          packageName: 'ล้างพื้นฐาน',
          branchId: 'b1',
          branchName: 'สาขาบางนา',
          amount: 150,
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 't4',
          userId: 'u4',
          userName: 'ประภา สว่างใส',
          packageId: 'p3',
          packageName: 'ล้างเต็มรูปแบบ',
          branchId: 'b3',
          branchName: 'สาขารังสิต',
          amount: 550,
          status: 'completed',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 't5',
          userId: 'u5',
          userName: 'ธนา มั่งคั่ง',
          packageId: 'p2',
          packageName: 'ล้างพรีเมียม',
          branchId: 'b2',
          branchName: 'สาขาพระราม 9',
          amount: 350,
          status: 'completed',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const branches = Array.from(new Set(transactions.map(t => t.branchName)));

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.branchName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    const matchesBranch = filterBranch === 'all' || tx.branchName === filterBranch;
    
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'สำเร็จ';
      case 'pending': return 'รอดำเนินการ';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const totalRevenue = filteredTransactions
    .filter(tx => tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">กำลังโหลดรายการ...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">จัดการรายการ</h2>
        <div className="w-6"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">รายการทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
            </div>
            <ShoppingBag className="text-red-600" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">สำเร็จ</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredTransactions.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">รอดำเนินการ</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredTransactions.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <span className="text-3xl">⏳</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">รายรับรวม</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า, แพ็กเกจ, สาขา..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'ทั้งหมด' },
              { value: 'completed', label: '✅ สำเร็จ' },
              { value: 'pending', label: '⏳ รอดำเนินการ' },
              { value: 'cancelled', label: '❌ ยกเลิก' },
            ].map(status => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  filterStatus === status.value
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            <option value="all">🏢 ทุกสาขา</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">วันที่/เวลา</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">ลูกค้า</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">แพ็กเกจ</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">สาขา</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700">ยอดเงิน</th>
                <th className="text-center p-4 text-sm font-semibold text-gray-700">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => {
                const datetime = formatDateTime(tx.createdAt);
                return (
                  <tr
                    key={tx.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index !== filteredTransactions.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">{datetime.date}</div>
                        <div className="text-gray-600">{datetime.time}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{tx.userName}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-gray-400" />
                        <span className="text-gray-900">{tx.packageName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600">{tx.branchName}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-red-600">{formatCurrency(tx.amount)}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(tx.status)}`}>
                        {getStatusLabel(tx.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center">
            <ShoppingBag className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">ไม่พบรายการที่ค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsManagement;
