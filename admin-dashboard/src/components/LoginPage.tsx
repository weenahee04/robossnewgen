import React, { useState } from 'react';
import { LogIn, Loader, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { demoLogin } = useAuth();

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await demoLogin();
    } catch (err: any) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-red rounded-2xl shadow-2xl shadow-red-600/30">
            <Shield className="text-white" size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">ROBOSS</h1>
            <p className="text-gray-600 text-lg mt-2">Admin Dashboard</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h2>
            <p className="text-gray-600">ระบบจัดการหลังบ้าน</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full gradient-red text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={24} />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              <>
                <LogIn size={24} />
                เข้าสู่ระบบ Admin
              </>
            )}
          </button>

          <div className="text-center space-y-2">
            <p className="text-gray-600 text-xs">
              Demo Admin Account
            </p>
            <p className="text-gray-500 text-[10px]">
              คลิกปุ่มด้านบนเพื่อเข้าสู่ระบบทันที
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs">
          Roboss Management System v2.0
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
