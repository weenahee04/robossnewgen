import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle,
  Search,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { adminApi } from '../services/api';

const StockManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [branches, setBranches] = useState<any[]>([]);
  // const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState<any>(null);

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedBranch, showLowStock, searchTerm]);

  const loadBranches = async () => {
    try {
      const data = await adminApi.getBranches();
      setBranches(data);
    } catch (error: any) {
      // Demo branches
      setBranches([
        { id: '1', name: 'สาขาบางนา' },
        { id: '2', name: 'สาขาพระราม 9' },
        { id: '3', name: 'สาขารังสิต' }
      ]);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [items, summaryData] = await Promise.all([
        adminApi.getStockItems(
          selectedCategory !== 'all' ? selectedCategory : undefined,
          showLowStock,
          searchTerm || undefined,
          selectedBranch !== 'all' ? selectedBranch : undefined
        ),
        adminApi.getStockSummary()
      ]);
      setStockItems(items);
      setSummary(summaryData);
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
        // Demo stock data
        setStockItems([
          { id: '1', name: 'น้ำยาล้างรถ', category: 'น้ำยา', quantity: 50, minQuantity: 20, unit: 'ลิตร', price: 150 },
          { id: '2', name: 'ฟองน้ำ', category: 'อุปกรณ์', quantity: 10, minQuantity: 15, unit: 'ชิ้น', price: 50 },
          { id: '3', name: 'ผ้าเช็ด', category: 'อุปกรณ์', quantity: 30, minQuantity: 25, unit: 'ผืน', price: 30 },
        ]);
        setSummary({
          totalItems: 3,
          totalValue: 10000,
          lowStockCount: 1,
          categories: ['น้ำยา', 'อุปกรณ์']
        });
      } else {
        console.error('Failed to load stock data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStockIn = async (itemId: string, quantity: number, reason: string) => {
    try {
      await adminApi.stockIn(itemId, quantity, reason);
      loadData();
      setShowStockModal(null);
    } catch (error) {
      console.error('Stock in failed:', error);
      alert('เกิดข้อผิดพลาดในการรับสินค้าเข้า');
    }
  };

  const handleStockOut = async (itemId: string, quantity: number, reason: string) => {
    try {
      await adminApi.stockOut(itemId, quantity, reason);
      loadData();
      setShowStockModal(null);
    } catch (error: any) {
      console.error('Stock out failed:', error);
      alert(error.message || 'เกิดข้อผิดพลาดในการเบิกสินค้าออก');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      chemical: 'bg-blue-500/10 text-blue-500',
      equipment: 'bg-purple-500/10 text-purple-500',
      consumable: 'bg-green-500/10 text-green-500',
      other: 'bg-gray-500/10 text-gray-500'
    };
    return colors[category] || colors.other;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      chemical: 'เคมีภัณฑ์',
      equipment: 'อุปกรณ์',
      consumable: 'วัสดุสิ้นเปลือง',
      other: 'อื่นๆ'
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="text-gray-900" size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">จัดการสต็อก</h1>
            <p className="text-gray-600 text-xs">Stock Management</p>
          </div>
          <button 
            onClick={loadData}
            className="bg-red-50 p-3 rounded-xl text-red-600 hover:bg-red-100 active:scale-95 transition-transform"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Package className="text-red-600" size={18} />
                <span className="text-gray-600 text-xs">รายการทั้งหมด</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.totalItems}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-yellow-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-yellow-600" size={18} />
                <span className="text-gray-600 text-xs">สต็อกต่ำ</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{summary.lowStockItems}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-red-600" size={18} />
                <span className="text-gray-600 text-xs">สินค้าหมด</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{summary.outOfStockItems}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-600" size={18} />
                <span className="text-gray-600 text-xs">มูลค่ารวม</span>
              </div>
              <p className="text-xl font-bold text-green-600">{formatCurrency(summary.totalValue)}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Branch Filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
            {[
              { value: 'all', label: 'ทุกสาขา' },
              ...branches.map(b => ({ value: b.id, label: b.name }))
            ].map((branch) => (
              <button
                key={branch.value}
                onClick={() => setSelectedBranch(branch.value)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                  selectedBranch === branch.value
                    ? 'gradient-red text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {branch.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { value: 'all', label: 'ทั้งหมด' },
              { value: 'chemical', label: 'เคมีภัณฑ์' },
              { value: 'equipment', label: 'อุปกรณ์' },
              { value: 'consumable', label: 'วัสดุสิ้นเปลือง' },
              { value: 'other', label: 'อื่นๆ' }
            ].map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat.value
                    ? 'gradient-red text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setShowLowStock(!showLowStock)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              showLowStock
                ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-300'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <AlertTriangle size={16} className="inline mr-2" />
            แสดงเฉพาะสต็อกต่ำ
          </button>
        </div>

        {/* Stock Items List */}
        <div className="space-y-3">
          {stockItems.map((item) => {
            const stockPercentage = (item.quantity / item.maxQuantity) * 100;
            const isLowStock = item.quantity <= item.minQuantity;
            const isOutOfStock = item.quantity === 0;

            return (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900 font-bold">{item.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs">
                      {item.supplier && `ผู้จำหน่าย: ${item.supplier}`}
                      {item.location && ` • ${item.location}`}
                    </p>
                  </div>
                  {(isLowStock || isOutOfStock) && (
                    <AlertTriangle className={isOutOfStock ? 'text-red-500' : 'text-yellow-500'} size={20} />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">คงเหลือ</p>
                    <p className={`text-xl font-bold ${
                      isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-gray-900'
                    }`}>
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">มูลค่า</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </p>
                  </div>
                </div>

                {/* Stock Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>ต่ำสุด: {item.minQuantity}</span>
                    <span>สูงสุด: {item.maxQuantity}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        isOutOfStock ? 'bg-red-600' : isLowStock ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowStockModal({ item, type: 'in' })}
                    className="flex-1 bg-green-50 text-green-700 py-2 rounded-xl text-sm font-medium hover:bg-green-100 border border-green-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <TrendingUp size={16} />
                    รับเข้า
                  </button>
                  <button
                    onClick={() => setShowStockModal({ item, type: 'out' })}
                    disabled={item.quantity === 0}
                    className="flex-1 bg-red-50 text-red-700 py-2 rounded-xl text-sm font-medium hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrendingDown size={16} />
                    เบิกออก
                  </button>
                </div>
              </div>
            );
          })}

          {stockItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">ไม่พบรายการสินค้า</p>
            </div>
          )}
        </div>
      </div>

      {/* Stock In/Out Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {showStockModal.type === 'in' ? 'รับสินค้าเข้า' : 'เบิกสินค้าออก'}
            </h3>
            <p className="text-gray-600 mb-4">{showStockModal.item.name}</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const quantity = Number(formData.get('quantity'));
              const reason = formData.get('reason') as string;
              
              if (showStockModal.type === 'in') {
                handleStockIn(showStockModal.item.id, quantity, reason);
              } else {
                handleStockOut(showStockModal.item.id, quantity, reason);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-700 text-sm mb-2 block font-medium">จำนวน ({showStockModal.item.unit})</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    max={showStockModal.type === 'out' ? showStockModal.item.quantity : undefined}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>
                
                <div>
                  <label className="text-gray-700 text-sm mb-2 block font-medium">เหตุผล</label>
                  <input
                    type="text"
                    name="reason"
                    required
                    placeholder="ระบุเหตุผล..."
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowStockModal(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors shadow-md ${
                    showStockModal.type === 'in'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  ยืนยัน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
