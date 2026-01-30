import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, ArrowLeft, Search } from 'lucide-react';
import { adminApi } from '../services/api';

interface PackageItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  stamps: number;
  isActive: boolean;
  category: 'basic' | 'premium' | 'deluxe';
  features: string[];
}

const PackagesManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    stamps: 1,
    category: 'basic' as 'basic' | 'premium' | 'deluxe',
    features: [] as string[],
    isActive: true
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getPackages();
      setPackages(data);
    } catch (error) {
      console.error('Failed to load packages:', error);
      // Use demo data as fallback
      setPackages([
        {
          id: 'p1',
          name: 'ล้างพื้นฐาน',
          description: 'ล้างรถภายนอก เช็ดตัวถัง ดูดฝุ่นเบื้องต้น',
          price: 150,
          duration: 30,
          stamps: 1,
          isActive: true,
          category: 'basic',
          features: ['ล้างรถภายนอก', 'เช็ดตัวถัง', 'ดูดฝุ่นภายใน', 'เช็ดกระจก']
        },
        {
          id: 'p2',
          name: 'ล้างพรีเมียม',
          description: 'ล้างรถทั้งภายนอกและภายใน ขัดเคลือบสีพื้นฐาน',
          price: 350,
          duration: 60,
          stamps: 1,
          isActive: true,
          category: 'premium',
          features: ['ล้างรถภายนอก', 'ทำความสะอาดภายใน', 'ขัดเคลือบสี', 'ดูดฝุ่นละเอียด', 'เคลือบยางล้อ']
        },
        {
          id: 'p3',
          name: 'ล้างเต็มรูปแบบ',
          description: 'ล้างรถทั้งคัน ขัดเคลือบสีเกรดพรีเมียม ทำความสะอาดเครื่องยนต์',
          price: 550,
          duration: 90,
          stamps: 2,
          isActive: true,
          category: 'deluxe',
          features: ['ล้างรถภายนอก', 'ทำความสะอาดภายใน', 'ขัดเคลือบสีพรีเมียม', 'ทำความสะอาดเครื่องยนต์', 'เคลือบยางล้อ', 'ฟอกเบาะ']
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'deluxe': return 'bg-purple-100 text-purple-700';
      case 'premium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'deluxe': return 'เดอลักซ์';
      case 'premium': return 'พรีเมียม';
      default: return 'พื้นฐาน';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleEdit = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      stamps: pkg.stamps,
      category: pkg.category,
      features: pkg.features,
      isActive: pkg.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบแพ็กเกจนี้?')) {
      try {
        await adminApi.deletePackage(id);
        await loadPackages();
      } catch (error) {
        console.error('Failed to delete package:', error);
        alert('ไม่สามารถลบแพ็กเกจได้');
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingPackage) {
        await adminApi.updatePackage(editingPackage.id, formData);
      } else {
        await adminApi.createPackage(formData);
      }
      await loadPackages();
      setShowModal(false);
      setEditingPackage(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save package:', error);
      alert('ไม่สามารถบันทึกแพ็กเกจได้');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 30,
      stamps: 1,
      category: 'basic',
      features: [],
      isActive: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">กำลังโหลดแพ็กเกจ...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">จัดการแพ็กเกจ</h2>
        <button
          onClick={() => {
            setEditingPackage(null);
            resetForm();
            setShowModal(true);
          }}
          className="gradient-red text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-transform flex items-center gap-2"
        >
          <Plus size={18} /> เพิ่มแพ็กเกจ
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-sm">แพ็กเกจทั้งหมด</p>
          <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-sm">ใช้งานอยู่</p>
          <p className="text-2xl font-bold text-green-600">{packages.filter(p => p.isActive).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-sm">ราคาเฉลี่ย</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(packages.reduce((sum, p) => sum + p.price, 0) / packages.length)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-sm">ราคาสูงสุด</p>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(Math.max(...packages.map(p => p.price)))}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาแพ็กเกจ..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map(pkg => (
          <div key={pkg.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(pkg.category)}`}>
                {getCategoryLabel(pkg.category)}
              </span>
              {pkg.isActive ? (
                <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">เปิดใช้งาน</span>
              ) : (
                <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">ปิดใช้งาน</span>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ราคา:</span>
                <span className="font-bold text-red-600">{formatCurrency(pkg.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ระยะเวลา:</span>
                <span className="font-semibold text-gray-900">{pkg.duration} นาที</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">แสตมป์:</span>
                <span className="font-semibold text-blue-600">{pkg.stamps} ดวง</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">รายละเอียด:</p>
              <ul className="space-y-1">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                    <span className="text-green-600">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleEdit(pkg)}
                className="flex-1 bg-yellow-50 text-yellow-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2"
              >
                <Edit size={16} /> แก้ไข
              </button>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <Package className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">ไม่พบแพ็กเกจที่ค้นหา</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingPackage ? 'แก้ไขแพ็กเกจ' : 'เพิ่มแพ็กเกจใหม่'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อแพ็กเกจ</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="เช่น ล้างพื้นฐาน"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">คำอธิบาย</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="รายละเอียดแพ็กเกจ..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ราคา (บาท)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ระยะเวลา (นาที)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">แสตมป์</label>
                  <input
                    type="number"
                    value={formData.stamps}
                    onChange={(e) => setFormData({ ...formData, stamps: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ประเภท</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="basic">พื้นฐาน</option>
                    <option value="premium">พรีเมียม</option>
                    <option value="deluxe">เดอลักซ์</option>
                  </select>
                </div>
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
                    setEditingPackage(null);
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

export default PackagesManagement;
