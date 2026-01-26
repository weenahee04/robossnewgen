import React, { useEffect, useState } from 'react';
import liff from '@line/liff';
import { useAuth } from '../src/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const LineLoginPage: React.FC = () => {
  const { lineLogin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLiff();
  }, []);

  const initializeLiff = async () => {
    try {
      const liffId = import.meta.env.VITE_LIFF_ID || '2006582434-VXwpBGPy';
      
      await liff.init({ liffId });

      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }

      const profile = await liff.getProfile();
      
      await lineLogin(
        profile.userId,
        profile.displayName,
        profile.pictureUrl
      );

      setLoading(false);
    } catch (err: any) {
      console.error('LIFF initialization failed:', err);
      setError(err.message || 'Failed to initialize LINE login');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-roboss-red/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-roboss-red animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">กำลังเชื่อมต่อกับ LINE...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-roboss-red/20 flex items-center justify-center p-6">
        <div className="bg-roboss-dark p-8 rounded-3xl border border-red-500/20 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-roboss-red text-white px-6 py-3 rounded-xl font-medium hover:bg-roboss-red/80 transition-colors"
            >
              ลองอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LineLoginPage;
