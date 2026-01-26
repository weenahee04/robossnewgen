import React, { useState } from 'react';
import { LogIn, Loader } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';

const LoginPageNew: React.FC = () => {
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
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden font-kanit">
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-roboss-red/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-yellow-500/10 rounded-full blur-[100px]"></div>

      <div className="flex-1 flex flex-col justify-center px-10 space-y-12 relative z-10">
        <div className="space-y-6">
          <div className="w-20 h-20 bg-roboss-red rounded-[2rem] flex items-center justify-center shadow-2xl shadow-red-600/40">
            <span className="text-4xl font-black text-white italic">R</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">ROBOSS</h1>
            <p className="text-gray-400 text-lg">AUTOMATIC CAR WASH</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">เข้าสู่ระบบ</h2>
            <p className="text-gray-500">ระบบสะสมแต้มและรับสิทธิพิเศษ</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full gradient-red text-white py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-red-600/40 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={24} />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              <>
                <LogIn size={24} />
                เข้าสู่ระบบ Demo
              </>
            )}
          </button>

          <div className="text-center space-y-2">
            <p className="text-gray-600 text-xs">
              Demo Account: demo@roboss.com
            </p>
            <p className="text-gray-700 text-[10px]">
              คลิกปุ่มด้านบนเพื่อเข้าสู่ระบบทันที
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-white">1,250</p>
              <p className="text-gray-500 text-xs">แต้มสะสม</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-yellow-500">Gold</p>
              <p className="text-gray-500 text-xs">สมาชิก</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-white">7/10</p>
              <p className="text-gray-500 text-xs">สแตมป์</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 text-center space-y-2 relative z-10">
        <p className="text-gray-600 text-xs">
          ระบบล้างรถอัตโนมัติ ROBOSS
        </p>
        <p className="text-gray-700 text-[10px]">
          Powered by Full Stack API v1.0
        </p>
      </div>
    </div>
  );
};

export default LoginPageNew;
