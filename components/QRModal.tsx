
import React from 'react';
import { X, Share2, Download } from 'lucide-react';
import { User } from '../types';

interface QRModalProps {
  user: User;
  onClose: () => void;
}

const QRModal: React.FC<QRModalProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-roboss-dark rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="p-8 flex flex-col items-center space-y-6">
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-white">Scan to Wash</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400">
              <X size={24} />
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <div className="w-56 h-56 bg-white flex flex-col items-center justify-center relative border-8 border-gray-100">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ROBOSS-USER-9921" 
                alt="QR Code" 
                className="w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center p-1">
                    <div className="w-full h-full bg-roboss-red rounded-lg flex items-center justify-center text-white font-black italic text-xs">R</div>
                 </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-white font-bold text-lg">{user.name}</p>
            <p className="text-gray-400 text-sm">แสดง QR Code นี้กับเจ้าหน้าที่หรือสแกนที่ตู้</p>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          <div className="w-full grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 py-4 rounded-2xl text-gray-300 font-medium hover:bg-white/10 active:scale-95 transition-all">
              <Download size={18} /> บันทึกรูป
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 py-4 rounded-2xl text-gray-300 font-medium hover:bg-white/10 active:scale-95 transition-all">
              <Share2 size={18} /> แชร์
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
