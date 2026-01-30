import React, { useState, useEffect } from 'react';
import { Wrench, Calendar, CheckCircle, AlertTriangle, Clock, Plus, Search, ArrowLeft, CheckSquare } from 'lucide-react';

type MaintenanceType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
type MaintenanceStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  branchId: string;
  branchName: string;
  assignedTo?: string;
  dueDate: string;
  completedDate?: string;
  completedBy?: string;
  notes?: string;
  checklist: {
    id: string;
    item: string;
    checked: boolean;
  }[];
  createdAt: string;
}

const MaintenanceManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [filterType, setFilterType] = useState<MaintenanceType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      // const data = await adminApi.getMaintenanceTasks();
      // setTasks(data);
      
      // Demo data
      setTasks([
        {
          id: 'm1',
          title: 'ตรวจเช็กประจำวัน - สาขาบางนา',
          description: 'ตรวจสอบเครื่องจักรประจำวันตามมาตรฐาน',
          type: 'daily',
          status: 'completed',
          branchId: 'b1',
          branchName: 'สาขาบางนา',
          assignedTo: 'ช่างสมชาย',
          dueDate: new Date().toISOString(),
          completedDate: new Date().toISOString(),
          completedBy: 'ช่างสมชาย',
          notes: 'ตรวจสอบเรียบร้อย ไม่พบปัญหา',
          checklist: [
            { id: 'c1', item: 'ตรวจสภาพเครื่องโดยรวม ดูเสียงผิดปกติ น้ำรั่ว หรือการสั่น', checked: true },
            { id: 'c2', item: 'ตรวจหัวฉีดน้ำและหัวฉีดโฟม ว่าไม่อุดตัน', checked: true },
            { id: 'c3', item: 'ตรวจระดับน้ำและน้ำยา เติมให้อยู่ในระดับที่เหมาะสม', checked: true },
            { id: 'c4', item: 'ทดสอบระบบเริ่ม–หยุด และการทำงานของเครื่องเบื้องต้น', checked: true },
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'm2',
          title: 'ตรวจเช็กรายสัปดาห์ - สาขาพระราม 9',
          description: 'ตรวจสอบและทำความสะอาดตามรอบสัปดาห์',
          type: 'weekly',
          status: 'in-progress',
          branchId: 'b2',
          branchName: 'สาขาพระราม 9',
          assignedTo: 'ช่างมานะ',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          checklist: [
            { id: 'c1', item: 'ถอดล้างและทำความสะอาดหัวฉีดทั้งหมด', checked: true },
            { id: 'c2', item: 'ตรวจสายท่อ ข้อต่อ และจุดเชื่อมต่าง ๆ ว่ามีการรั่วซึมหรือไม่', checked: true },
            { id: 'c3', item: 'ตรวจตู้ควบคุมและระบบไฟฟ้าเบื้องต้น', checked: false },
            { id: 'c4', item: 'ทำความสะอาดพื้นที่รอบเครื่องและพื้นที่ทำงาน', checked: false },
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'm3',
          title: 'เซอร์วิสรายเดือน - สาขารังสิต',
          description: 'ตรวจสอบระบบเชิงลึกตามรอบเดือน',
          type: 'monthly',
          status: 'overdue',
          branchId: 'b3',
          branchName: 'สาขารังสิต',
          assignedTo: 'ช่างปรีชา',
          dueDate: new Date(Date.now() - 86400000).toISOString(),
          checklist: [
            { id: 'c1', item: 'ตรวจการทำงานของปั๊มน้ำแรงดัน และแรงดันการใช้งาน', checked: false },
            { id: 'c2', item: 'ตรวจระบบไฟฟ้า การเชื่อมต่อ และอุปกรณ์ควบคุม', checked: false },
            { id: 'c3', item: 'ตรวจเซนเซอร์ สวิตช์ และระบบความปลอดภัย', checked: false },
            { id: 'c4', item: 'ตรวจระบบลม / ระบบเป่าแห้ง (ถ้ามี)', checked: false },
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'm4',
          title: 'เซอร์วิสรายไตรมาส - สาขาบางนา',
          description: 'บำรุงรักษาเชิงลึกตามรอบไตรมาส',
          type: 'quarterly',
          status: 'pending',
          branchId: 'b1',
          branchName: 'สาขาบางนา',
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          checklist: [
            { id: 'c1', item: 'เปลี่ยนหรือทำความสะอาดไส้กรองน้ำตามรอบ', checked: false },
            { id: 'c2', item: 'ตรวจชุดปั๊มหลัก และอุปกรณ์ที่มีการสึกหรอ', checked: false },
            { id: 'c3', item: 'ตรวจโครงสร้าง น็อต ฐานยึด และความแข็งแรงของเครื่อง', checked: false },
            { id: 'c4', item: 'ทดสอบระบบรวมทั้งหมด (Full System Test)', checked: false },
          ],
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to load maintenance tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesType = filterType === 'all' || task.type === filterType;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (task.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesType && matchesStatus && matchesSearch;
  });

  const getTypeLabel = (type: MaintenanceType) => {
    const labels = {
      daily: 'รายวัน',
      weekly: 'รายสัปดาห์',
      monthly: 'รายเดือน',
      quarterly: 'รายไตรมาส',
      yearly: 'รายปี',
    };
    return labels[type];
  };

  const getTypeColor = (type: MaintenanceType) => {
    const colors = {
      daily: 'bg-blue-50 text-blue-600',
      weekly: 'bg-green-50 text-green-600',
      monthly: 'bg-purple-50 text-purple-600',
      quarterly: 'bg-orange-50 text-orange-600',
      yearly: 'bg-red-50 text-red-600',
    };
    return colors[type];
  };

  const getStatusLabel = (status: MaintenanceStatus) => {
    const labels = {
      pending: 'รอดำเนินการ',
      'in-progress': 'กำลังดำเนินการ',
      completed: 'เสร็จสิ้น',
      overdue: 'เกินกำหนด',
    };
    return labels[status];
  };

  const getStatusColor = (status: MaintenanceStatus) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-600',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
    };
    return colors[status];
  };

  const getStatusIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'overdue':
        return <AlertTriangle size={18} className="text-red-600" />;
      case 'in-progress':
        return <Clock size={18} className="text-yellow-600" />;
      default:
        return <Clock size={18} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
          <ArrowLeft size={24} />
          <span className="font-medium">ย้อนกลับ</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Wrench size={28} className="text-red-600" />
          ระบบบำรุงรักษาเครื่องจักร
        </h2>
        <button
          onClick={() => alert('ฟีเจอร์เพิ่มงานจะเปิดใช้งานเร็วๆ นี้')}
          className="gradient-red text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-transform flex items-center gap-2"
        >
          <Plus size={18} /> เพิ่มงานบำรุงรักษา
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">งานทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Wrench size={32} className="text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">รอดำเนินการ</p>
              <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
            </div>
            <Clock size={32} className="text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">กำลังดำเนินการ</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <Clock size={32} className="text-yellow-400" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">เสร็จสิ้น</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle size={32} className="text-green-400" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">เกินกำหนด</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <AlertTriangle size={32} className="text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหางาน, สาขา, หรือผู้รับผิดชอบ..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full md:w-auto px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as MaintenanceType | 'all')}
        >
          <option value="all">ทุกประเภท</option>
          <option value="daily">รายวัน</option>
          <option value="weekly">รายสัปดาห์</option>
          <option value="monthly">รายเดือน</option>
          <option value="quarterly">รายไตรมาส</option>
          <option value="yearly">รายปี</option>
        </select>
        <select
          className="w-full md:w-auto px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as MaintenanceStatus | 'all')}
        >
          <option value="all">ทุกสถานะ</option>
          <option value="pending">รอดำเนินการ</option>
          <option value="in-progress">กำลังดำเนินการ</option>
          <option value="completed">เสร็จสิ้น</option>
          <option value="overdue">เกินกำหนด</option>
        </select>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedTask(task);
              setShowTaskModal(true);
            }}
          >
            <div className="p-5 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.branchName}</p>
                </div>
                {getStatusIcon(task.status)}
              </div>

              {/* Type & Status */}
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getTypeColor(task.type)}`}>
                  {getTypeLabel(task.type)}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>ความคืบหน้า</span>
                  <span>{task.checklist.filter(c => c.checked).length}/{task.checklist.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all"
                    style={{ width: `${(task.checklist.filter(c => c.checked).length / task.checklist.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Assigned & Due Date */}
              {task.assignedTo && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">ผู้รับผิดชอบ:</span>
                  <span>{task.assignedTo}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-gray-400" />
                <span className={task.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-600'}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Wrench size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">ไม่พบงานบำรุงรักษา</p>
        </div>
      )}

      {/* Task Detail Modal */}
      {showTaskModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onUpdate={() => {
            loadTasks();
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

interface TaskDetailModalProps {
  task: MaintenanceTask;
  onClose: () => void;
  onUpdate: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onUpdate }) => {
  const [checklist, setChecklist] = useState(task.checklist);
  const [notes, setNotes] = useState(task.notes || '');
  const [status, setStatus] = useState(task.status);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleComplete = () => {
    // Save to backend
    alert('บันทึกเรียบร้อย!');
    onUpdate();
  };

  const completionPercentage = (checklist.filter(c => c.checked).length / checklist.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl my-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">สาขา</p>
            <p className="font-semibold text-gray-900">{task.branchName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">ผู้รับผิดชอบ</p>
            <p className="font-semibold text-gray-900">{task.assignedTo || '-'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">กำหนดเสร็จ</p>
            <p className="font-semibold text-gray-900">
              {new Date(task.dueDate).toLocaleDateString('th-TH')}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">สถานะ</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MaintenanceStatus)}
              className="w-full px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="pending">รอดำเนินการ</option>
              <option value="in-progress">กำลังดำเนินการ</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="overdue">เกินกำหนด</option>
            </select>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium">ความคืบหน้า</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <CheckSquare size={20} className="text-red-600" />
            รายการตรวจเช็ก
          </h4>
          <div className="space-y-2">
            {checklist.map(item => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
                />
                <span className={`flex-1 ${item.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {item.item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block font-bold text-gray-900 mb-2">บันทึกเพิ่มเติม</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="ระบุรายละเอียด ปัญหาที่พบ หรือข้อมูลเพิ่มเติม..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 gradient-red text-white px-4 py-3 rounded-xl font-bold shadow-md active:scale-95 transition-transform"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagement;
