import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Car
} from 'lucide-react';
import { adminApi } from '../services/api';

const BranchManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [branchStats, setBranchStats] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    image: '',
    status: 'Available' as 'Available' | 'Busy' | 'Closed',
    waitingCars: 0
  });

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      loadBranchStats(selectedBranch);
    }
  }, [selectedBranch]);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getBranches();
      setBranches(data);
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
        // Demo data
        setBranches([
          {
            id: '1',
            name: 'สาขาบางนา',
            address: 'เมกาบางนา ชั้น B',
            lat: 13.6685,
            lng: 100.6433,
            status: 'Available',
            waitingCars: 2,
            image: 'https://via.placeholder.com/600x300/E5E7EB/6B7280?text=Branch+Banner',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'สาขาพระราม 9',
            address: 'ศูนย์การค้าเซ็นทรัล พระราม 9',
            lat: 13.7594,
            lng: 100.5647,
            status: 'Available',
            waitingCars: 4,
            image: 'https://via.placeholder.com/600x300/E5E7EB/6B7280?text=Branch+Banner',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'สาขารังสิต',
            address: 'ฟิวเจอร์พาร์ค รังสิต',
            lat: 14.0208,
            lng: 100.5954,
            status: 'Busy',
            waitingCars: 1,
            image: 'https://via.placeholder.com/600x300/E5E7EB/6B7280?text=Branch+Banner',
            createdAt: new Date().toISOString()
          }
        ]);
      } else {
        console.error('Failed to load branches:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBranchStats = async (branchId: string) => {
    try {
      const stats = await adminApi.getBranchStats(branchId);
      setBranchStats(stats);
    } catch (error: any) {
      const errorMessage = error?.message || '';
      if (
        errorMessage.includes('API_URL not configured') ||
        errorMessage.includes('Empty response') ||
        errorMessage.includes('Network error') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('ERR_CONNECTION_REFUSED')
      ) {
        // Demo stats
        setBranchStats({
          branchId,
          branchName: branches.find(b => b.id === branchId)?.name || 'Unknown',
          totalRevenue: Math.floor(Math.random() * 100000) + 50000,
          totalTransactions: Math.floor(Math.random() * 200) + 100,
          todayTransactions: Math.floor(Math.random() * 20) + 5,
          waitingCars: Math.floor(Math.random() * 5),
          status: 'Available'
        });
      }
    }
  };

  const handleCreate = async () => {
    try {
      await adminApi.createBranch({
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        waitingCars: parseInt(formData.waitingCars.toString())
      });
      setShowAddModal(false);
      resetForm();
      loadBranches();
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถสร้างสาขาได้'));
    }
  };

  const handleUpdate = async () => {
    if (!showEditModal) return;
    try {
      await adminApi.updateBranch(showEditModal.id, {
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        waitingCars: parseInt(formData.waitingCars.toString())
      });
      setShowEditModal(null);
      resetForm();
      loadBranches();
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถอัพเดทสาขาได้'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสาขานี้?')) return;
    try {
      await adminApi.deleteBranch(id);
      loadBranches();
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถลบสาขาได้'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      lat: '',
      lng: '',
      image: '',
      status: 'Available',
      waitingCars: 0
    });
  };

  const openEditModal = (branch: any) => {
    setFormData({
      name: branch.name,
      address: branch.address,
      lat: branch.lat.toString(),
      lng: branch.lng.toString(),
      image: branch.image || '',
      status: branch.status,
      waitingCars: branch.waitingCars
    });
    setShowEditModal(branch);
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Busy': return 'bg-yellow-100 text-yellow-700';
      case 'Closed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Available': return 'พร้อมให้บริการ';
      case 'Busy': return 'ไม่ว่าง';
      case 'Closed': return 'ปิด';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="text-gray-700" size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">จัดการสาขา</h1>
              <p className="text-gray-600 mt-1">จัดการข้อมูลสาขาแฟรนไชส์ทั้งหมด</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg"
          >
            <Plus size={20} />
            เพิ่มสาขาใหม่
          </button>
        </div>

        {/* Stats Card */}
        {selectedBranch && branchStats && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">สถิติสาขา: {branchStats.branchName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">รายได้ทั้งหมด</p>
                <p className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(branchStats.totalRevenue)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">รายการทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-600">{branchStats.totalTransactions}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">วันนี้</p>
                <p className="text-2xl font-bold text-purple-600">{branchStats.todayTransactions}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">รถรอ</p>
                <p className="text-2xl font-bold text-orange-600">{branchStats.waitingCars}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedBranch(null)}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900"
            >
              ปิดสถิติ
            </button>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ค้นหาสาขา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Branches List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedBranch(branch.id)}
            >
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={branch.image || 'https://via.placeholder.com/600x300/E5E7EB/6B7280?text=Branch+Banner'}
                  alt={branch.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(branch.status)}`}>
                    {getStatusText(branch.status)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{branch.name}</h3>
                <div className="flex items-start gap-2 text-gray-600 mb-4">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{branch.address}</p>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car size={16} />
                    <span className="text-sm">{branch.waitingCars} คันรอ</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(branch);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    แก้ไข
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(branch.id);
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBranches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">ไม่พบสาขา</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">เพิ่มสาขาใหม่</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อสาขา</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="เช่น สาขาบางนา"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ที่อยู่</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="ที่อยู่สาขา"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="13.6685"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="100.6433"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">สถานะ</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Available">พร้อมให้บริการ</option>
                  <option value="Busy">ไม่ว่าง</option>
                  <option value="Closed">ปิด</option>
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
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">แก้ไขสาขา</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อสาขา</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ที่อยู่</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">สถานะ</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Available">พร้อมให้บริการ</option>
                  <option value="Busy">ไม่ว่าง</option>
                  <option value="Closed">ปิด</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">รถรอ</label>
                <input
                  type="number"
                  value={formData.waitingCars}
                  onChange={(e) => setFormData({ ...formData, waitingCars: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL รูปภาพ</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowEditModal(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
