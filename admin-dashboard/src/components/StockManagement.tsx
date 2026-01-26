import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Edit,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { adminApi } from '../services/api';

const StockManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [selectedCategory, showLowStock, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [items, summaryData] = await Promise.all([
        adminApi.getStockItems(
          selectedCategory !== 'all' ? selectedCategory : undefined,
          showLowStock,
          searchTerm || undefined
        ),
        adminApi.getStockSummary()
      ]);
      setStockItems(items);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load stock data:', error);
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">จัดการสต็อก</h1>
            <p className="text-gray-500 text-xs">Stock Management</p>
          </div>
          <button 
            onClick={loadData}
            className="bg-roboss-red/10 p-3 rounded-2xl text-roboss-red active:scale-95 transition-transform"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-roboss-dark p-4 rounded-3xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Package className="text-roboss-red" size={18} />
                <span className="text-gray-500 text-xs">รายการทั้งหมด</span>
              </div>
              <p className="text-2xl font-bold text-white">{summary.totalItems}</p>
            </div>

            <div className="bg-roboss-dark p-4 rounded-3xl border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-yellow-500" size={18} />
                <span className="text-gray-500 text-xs">สต็อกต่ำ</span>
              </div>
              <p className="text-2xl font-bold text-yellow-500">{summary.lowStockItems}</p>
            </div>

            <div className="bg-roboss-dark p-4 rounded-3xl border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-red-500" size={18} />
                <span className="text-gray-500 text-xs">สินค้าหมด</span>
              </div>
              <p className="text-2xl font-bold text-red-500">{summary.outOfStockItems}</p>
            </div>

            <div className="bg-roboss-dark p-4 rounded-3xl border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-500" size={18} />
                <span className="text-gray-500 text-xs">มูลค่ารวม</span>
              </div>
              <p className="text-xl font-bold text-green-500">{formatCurrency(summary.totalValue)}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-roboss-dark border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-roboss-red"
            />
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
                    ? 'bg-roboss-red text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
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
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
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
              <div key={item.id} className="bg-roboss-dark p-5 rounded-3xl border border-white/5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold">{item.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">
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
                    <p className="text-gray-500 text-xs mb-1">คงเหลือ</p>
                    <p className={`text-xl font-bold ${
                      isOutOfStock ? 'text-red-500' : isLowStock ? 'text-yellow-500' : 'text-white'
                    }`}>
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">มูลค่า</p>
                    <p className="text-xl font-bold text-green-500">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </p>
                  </div>
                </div>

                {/* Stock Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>ต่ำสุด: {item.minQuantity}</span>
                    <span>สูงสุด: {item.maxQuantity}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowStockModal({ item, type: 'in' })}
                    className="flex-1 bg-green-500/10 text-green-500 py-2 rounded-xl text-sm font-medium hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <TrendingUp size={16} />
                    รับเข้า
                  </button>
                  <button
                    onClick={() => setShowStockModal({ item, type: 'out' })}
                    disabled={item.quantity === 0}
                    className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <Package className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-500">ไม่พบรายการสินค้า</p>
            </div>
          )}
        </div>
      </div>

      {/* Stock In/Out Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-roboss-dark rounded-3xl p-6 max-w-md w-full border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">
              {showStockModal.type === 'in' ? 'รับสินค้าเข้า' : 'เบิกสินค้าออก'}
            </h3>
            <p className="text-gray-400 mb-4">{showStockModal.item.name}</p>
            
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
                  <label className="text-gray-400 text-sm mb-2 block">จำนวน ({showStockModal.item.unit})</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    max={showStockModal.type === 'out' ? showStockModal.item.quantity : undefined}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-roboss-red"
                  />
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">เหตุผล</label>
                  <input
                    type="text"
                    name="reason"
                    required
                    placeholder="ระบุเหตุผล..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-roboss-red"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowStockModal(null)}
                  className="flex-1 bg-white/5 text-white py-3 rounded-xl font-medium hover:bg-white/10 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    showStockModal.type === 'in'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
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
