import React, { useState, useEffect } from 'react';
import { Gift, Plus, Edit, Trash2, ArrowLeft, Search } from 'lucide-react';
import { adminApi } from '../services/api';

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  stock: number;
  isActive: boolean;
  category: 'discount' | 'service' | 'product';
  image: string;
  redemptionCount: number;
}

const RewardsManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: 0,
    stock: 0,
    category: 'discount' as 'discount' | 'service' | 'product',
    image: '',
    isActive: true
  });

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getRewards();
      setRewards(data);
    } catch (error) {
      console.error('Failed to load rewards:', error);
      // Use demo data as fallback
      setRewards([
        {
          id: 'r1',
          name: 'ส่วนลด 50 บาท',
          description: 'รับส่วนลดทันที 50 บาท สำหรับการล้างรถครั้งถัดไป',
          pointsCost: 500,
          stock: 100,
          isActive: true,
          category: 'discount',
          image: 'https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Reward+Banner',
          redemptionCount: 45
        },
        {
          id: 'r2',
          name: 'ล้างฟรี 1 ครั้ง',
          description: 'รับบริการล้างรถแพ็กเกจพื้นฐานฟรี 1 ครั้ง',
          pointsCost: 1000,
          stock: 50,
          isActive: true,
          category: 'service',
          image: 'https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Service+Banner',
          redemptionCount: 28
        },
        {
          id: 'r3',
          name: 'น้ำยาเคลือบสีรถ',
          description: 'ผลิตภัณฑ์เคลือบสีรถคุณภาพสูง ขนาด 250ml',
          pointsCost: 1500,
          stock: 25,
          isActive: true,
          category: 'product',
          image: 'https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Product+Banner',
          redemptionCount: 12
        },
        {
          id: 'r4',
          name: 'ส่วนลด 100 บาท',
          description: 'รับส่วนลดทันที 100 บาท สำหรับการล้างรถครั้งถัดไป',
          pointsCost: 900,
          stock: 75,
          isActive: true,
          category: 'discount',
          image: 'https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Discount+Banner',
          redemptionCount: 35
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = 
      reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || reward.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'discount': return 'bg-green-100 text-green-700';
      case 'service': return 'bg-blue-100 text-blue-700';
      case 'product': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'discount': return 'ส่วนลด';
      case 'service': return 'บริการ';
      case 'product': return 'สินค้า';
      default: return category;
    }
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description,
      pointsCost: reward.pointsCost,
      stock: reward.stock,
      category: reward.category,
      image: reward.image,
      isActive: reward.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรางวัลนี้?')) {
      try {
        await adminApi.deleteReward(id);
        await loadRewards();
      } catch (error) {
        console.error('Failed to delete reward:', error);
        alert('ไม่สามารถลบรางวัลได้');
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingReward) {
        await adminApi.updateReward(editingReward.id, formData);
      } else {
        await adminApi.createReward(formData);
      }
      await loadRewards();
      setShowModal(false);
      setEditingReward(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save reward:', error);
      alert('ไม่สามารถบันทึกรางวัลได้');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      pointsCost: 0,
      stock: 0,
      category: 'discount',
      image: '',
      isActive: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">กำลังโหลดรางวัล...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">จัดการรางวัล</h2>
        <button
          onClick={() => {
            setEditingReward(null);
            resetForm();
            setShowModal(true);
          }}
          className="gradient-red text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-transform flex items-center gap-2"
        >
          <Plus size={18} /> เพิ่มรางวัล
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-sm">รางวัลทั้งหมด</p>
          <p className="text-2xl font-bold text-gray-900">{rewards.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-sm">ใช้งานอยู่</p>
          <p className="text-2xl font-bold text-green-600">{rewards.filter(r => r.isActive).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-sm">แลกไปแล้ว</p>
          <p className="text-2xl font-bold text-purple-600">
            {rewards.reduce((sum, r) => sum + r.redemptionCount, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-sm">คงเหลือ</p>
          <p className="text-2xl font-bold text-blue-600">
            {rewards.reduce((sum, r) => sum + r.stock, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหารางวัล..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { value: 'all', label: 'ทั้งหมด' },
            { value: 'discount', label: '💰 ส่วนลด' },
            { value: 'service', label: '🔧 บริการ' },
            { value: 'product', label: '🎁 สินค้า' },
          ].map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                filterCategory === cat.value
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map(reward => (
          <div key={reward.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <img
              src={reward.image}
              alt={reward.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(reward.category)}`}>
                  {getCategoryLabel(reward.category)}
                </span>
                {reward.isActive ? (
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">เปิดใช้งาน</span>
                ) : (
                  <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">ปิดใช้งาน</span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{reward.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{reward.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ราคา:</span>
                  <span className="font-bold text-red-600">{reward.pointsCost} แต้ม</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">คงเหลือ:</span>
                  <span className={`font-semibold ${reward.stock < 20 ? 'text-red-600' : 'text-green-600'}`}>
                    {reward.stock} ชิ้น
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">แลกไป:</span>
                  <span className="font-semibold text-gray-900">{reward.redemptionCount} ครั้ง</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(reward)}
                  className="flex-1 bg-yellow-50 text-yellow-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={16} /> แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(reward.id)}
                  className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRewards.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <Gift className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">ไม่พบรางวัลที่ค้นหา</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingReward ? 'แก้ไขรางวัล' : 'เพิ่มรางวัลใหม่'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อรางวัล</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="เช่น ส่วนลด 50 บาท"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">คำอธิบาย</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="รายละเอียดรางวัล..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">แต้ม</label>
                  <input
                    type="number"
                    value={formData.pointsCost}
                    onChange={(e) => setFormData({ ...formData, pointsCost: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">จำนวน</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ประเภท</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="discount">ส่วนลด</option>
                  <option value="service">บริการ</option>
                  <option value="product">สินค้า</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL รูปภาพ</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="text-sm font-semibold text-gray-700">เปิดใช้งาน</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingReward(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 gradient-red text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsManagement;
