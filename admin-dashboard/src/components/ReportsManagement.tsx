import React, { useState } from 'react';
import { ArrowLeft, Download, Calendar, TrendingUp, DollarSign, Users, Package } from 'lucide-react';

const ReportsManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const reports = [
    {
      title: 'รายงานยอดขาย',
      description: 'รายงานสรุปยอดขายรายวัน/รายเดือน',
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
      value: formatCurrency(125000),
      growth: '+12.5%'
    },
    {
      title: 'รายงานลูกค้า',
      description: 'รายงานข้อมูลลูกค้าและสมาชิก',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      value: '1,250 คน',
      growth: '+8.3%'
    },
    {
      title: 'รายงานบริการ',
      description: 'รายงานสรุปการใช้บริการแต่ละแพ็กเกจ',
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
      value: '345 ครั้ง',
      growth: '+15.2%'
    },
    {
      title: 'รายงานแต้มสะสม',
      description: 'รายงานการแลกและใช้แต้มสะสม',
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600',
      value: '45,000 แต้ม',
      growth: '+10.1%'
    },
  ];

  const monthlyData = [
    { month: 'ม.ค. 2024', revenue: 98000, customers: 850, transactions: 280 },
    { month: 'ก.พ. 2024', revenue: 105000, customers: 920, transactions: 310 },
    { month: 'มี.ค. 2024', revenue: 125000, customers: 1250, transactions: 345 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">รายงาน</h2>
        <div className="w-6"></div>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { value: '7days', label: '7 วันล่าสุด' },
            { value: '30days', label: '30 วันล่าสุด' },
            { value: 'thisMonth', label: 'เดือนนี้' },
            { value: 'lastMonth', label: 'เดือนที่แล้ว' },
            { value: 'thisYear', label: 'ปีนี้' },
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
              <Calendar size={16} className="inline mr-2" />
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {reports.map((report, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 rounded-xl ${report.color} flex items-center justify-center mb-4`}>
              <report.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{report.value}</p>
                <p className="text-sm text-green-600 font-semibold">{report.growth}</p>
              </div>
              <button className="gradient-red text-white p-2 rounded-lg hover:opacity-90 transition-opacity">
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">ภาพรวมรายเดือน</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">เดือน</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700">รายรับ</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700">ลูกค้า</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700">รายการ</th>
                <th className="text-center p-4 text-sm font-semibold text-gray-700">ดาวน์โหลด</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, index) => (
                <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">{data.month}</td>
                  <td className="p-4 text-right font-bold text-green-600">{formatCurrency(data.revenue)}</td>
                  <td className="p-4 text-right text-gray-900">{data.customers}</td>
                  <td className="p-4 text-right text-gray-900">{data.transactions}</td>
                  <td className="p-4 text-center">
                    <button className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export All */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ส่งออกรายงานทั้งหมด</h3>
            <p className="text-gray-600 text-sm">ดาวน์โหลดรายงานทั้งหมดในรูปแบบ Excel หรือ PDF</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-green-50 text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-100 transition-colors flex items-center gap-2">
              <Download size={20} />
              Excel
            </button>
            <button className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center gap-2">
              <Download size={20} />
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;
