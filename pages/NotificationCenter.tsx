import React, { useState } from 'react';
import { PAST_NOTIFICATIONS, REORDER_ALERTS } from '../constants';
import { Bell, X, Mail } from 'lucide-react';
import { Notification } from '../types';

const NotificationCenter: React.FC = () => {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  return (
    <div className="space-y-8 pb-20 relative">
      <h1 className="text-2xl font-bold text-center mb-6">通知管理</h1>

      {/* Holiday Notification Card */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-center text-gray-700">下一個通知的國定假日</h2>
        <div className="bg-white rounded-3xl p-8 shadow-sm text-center relative overflow-hidden">
           <h3 className="text-2xl font-medium text-gray-800 mb-2">元旦</h3>
           <div className="text-8xl font-black text-gray-900 tracking-tighter flex justify-center items-center gap-2">
             1<span className="text-6xl text-gray-300 font-light">/</span>1
           </div>
        </div>
        <div className="text-center mt-2">
            <span className="text-gray-500 text-sm">將於</span>
            <div className="text-red-500 text-xl font-bold mt-1 flex items-center justify-center gap-2">
                12/24 8:00 AM <span className="text-black text-sm font-normal">前寄發</span>
            </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="bg-cyan-300 hover:bg-cyan-400 text-cyan-900 px-12 py-3 rounded-xl text-lg font-bold shadow-md transition-colors">
            過去通知
        </button>
      </div>

      {/* Reorder Alerts */}
      <div className="space-y-3">
         <h2 className="text-lg font-medium text-center text-gray-700">訂貨週期將近的客戶</h2>
         
         <div className="bg-gray-400 rounded-t-2xl p-4 flex justify-between text-white text-xs font-medium">
             <span className="w-1/3">客戶名稱</span>
             <span className="w-1/3 text-center">離訂貨週期剩餘</span>
             <span className="w-1/3 text-right">自動寄發時間</span>
         </div>
         
         <div className="bg-gray-300/50 rounded-b-2xl p-4 space-y-4">
             {REORDER_ALERTS.map((alert, idx) => (
                <div key={`real-${idx}`} className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
                     <span className="w-1/3 font-medium text-gray-800">{alert.customerName}</span>
                     <span className="w-1/3 text-center">
                        <span className={`px-2 py-1 rounded ${alert.daysRemaining <= 1 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                             {alert.daysRemaining} 天
                        </span>
                     </span>
                     <span className="w-1/3 text-right text-gray-500 text-sm">{alert.autoSendTime}</span>
                </div>
            ))}
         </div>
      </div>

      {/* History Section */}
      <div className="space-y-3 pt-8 border-t border-gray-200">
         <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">過去通知 :</h2>
         <div className="bg-gray-400 rounded-t-2xl p-3 flex text-white text-sm font-bold">
             <span className="w-1/3 pl-4">寄發時間</span>
             <span className="w-1/3 text-center">客戶名稱</span>
             <span className="w-1/3 text-right pr-4">寄發種類</span>
         </div>

         <div className="bg-gray-400/80 rounded-b-3xl p-4 space-y-4 pb-8">
             {PAST_NOTIFICATIONS.map((note) => (
                 <div key={note.id} className="bg-white rounded-3xl p-5 shadow-md">
                     <div className="flex justify-between items-start mb-4">
                         <div className="w-1/3 text-sm font-bold text-gray-900">
                             {note.scheduledTime.split(' ').slice(0, 2).join(' ')}
                             <div className="text-xs">{note.scheduledTime.split(' ')[2]}</div>
                         </div>
                         <div className="w-1/3 text-center font-bold text-xl text-gray-800">
                             {note.customerName}
                         </div>
                         <div className="w-1/3 text-right text-sm font-medium">
                             <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">{note.type === 'holiday' ? '節慶' : '週期'}</span>
                         </div>
                     </div>
                     <div className="flex justify-center">
                        <button 
                            onClick={() => setSelectedNotification(note)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-10 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                            查看詳情
                        </button>
                     </div>
                 </div>
             ))}
         </div>
      </div>

      {/* Details Modal */}
      {selectedNotification && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6" onClick={() => setSelectedNotification(null)}>
              <div className="bg-white w-full max-w-md rounded-3xl p-6 relative animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setSelectedNotification(null)}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                      <X className="w-5 h-5 text-gray-500" />
                  </button>

                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Mail className="w-6 h-6 text-cyan-500" />
                      通知詳情
                  </h3>

                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">客戶 / Email</label>
                          <div className="font-medium text-gray-800">{selectedNotification.customerName}</div>
                          <div className="text-sm text-blue-500">{selectedNotification.email}</div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">寄發種類</label>
                             <div className="font-medium text-gray-800">{selectedNotification.sendType}</div>
                        </div>
                         <div className="flex-1">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">寄發時間</label>
                             <div className="font-medium text-gray-800">{selectedNotification.scheduledTime}</div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">發送內容</label>
                          <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed border border-gray-100">
                              {selectedNotification.contentBody}
                          </div>
                      </div>
                  </div>

                  <button 
                    onClick={() => setSelectedNotification(null)}
                    className="w-full mt-6 bg-cyan-300 text-cyan-900 font-bold py-3 rounded-xl hover:bg-cyan-400 transition-colors"
                  >
                      關閉
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default NotificationCenter;