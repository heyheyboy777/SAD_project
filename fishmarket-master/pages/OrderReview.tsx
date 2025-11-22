
import React, { useState } from 'react';
import { MOCK_ORDERS } from '../constants';
import { Order } from '../types';
import { Calendar, ArrowLeft, X, MapPin, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderReview: React.FC = () => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState(
    MOCK_ORDERS.filter(o => o.status === 'pending')
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleConfirm = (id: string) => {
    setPendingOrders(prev => prev.filter(o => o.id !== id));
    // In a real app, this would call an API
    alert(`訂單 ${id} 已確認`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-center shadow-sm">
        <button onClick={() => navigate(-1)} className="absolute left-4 p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">訂單審核</h1>
      </div>

      <div className="p-6 flex-1 space-y-6">
        <h2 className="text-center text-lg text-gray-600 mb-8">待審核的訂單</h2>

        {pendingOrders.length === 0 ? (
           <div className="text-center text-gray-400 mt-20">
             <div className="text-6xl mb-4">✓</div>
             <p>目前沒有待審核的訂單</p>
           </div>
        ) : (
          pendingOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-yellow-400"></div>
              
              <div className="flex justify-between items-start mb-4 pl-4">
                <span className="text-gray-400 text-sm">訂單 #{order.id}</span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                  審核中
                </span>
              </div>

              <div className="pl-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {order.items.map(i => `${i.item} ${i.quantity}斤`).join(', ')}
                </h3>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                   <Calendar className="w-4 h-4 mr-2" />
                   {order.deliveryDate === '2025-10-25' ? '明日交貨' : order.deliveryDate}
                </div>
              </div>

              <div className="pl-4 flex items-center justify-between">
                <button 
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200"
                >
                    查看詳情
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {pendingOrders.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0">
            <button 
                onClick={() => pendingOrders.forEach(o => handleConfirm(o.id))}
                className="w-full bg-cyan-200 hover:bg-cyan-300 text-cyan-900 py-4 rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-95"
            >
                全部確認
            </button>
          </div>
      )}

      {/* Details Modal */}
      {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
              <div className="bg-white w-full max-w-md rounded-3xl p-6 relative animate-in zoom-in-95 shadow-2xl" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                      <X className="w-5 h-5 text-gray-500" />
                  </button>

                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-cyan-500" />
                      訂單詳情
                  </h3>

                  <div className="space-y-6">
                      {/* Customer & Status */}
                      <div className="bg-gray-50 p-4 rounded-2xl">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">客戶名稱</label>
                          <div className="font-bold text-lg text-gray-800">{selectedOrder.customerName}</div>
                          <div className="text-xs text-yellow-600 font-medium mt-1 flex items-center gap-1">
                              {selectedOrder.isNewCustomer && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">新客戶</span>}
                              <span>訂單編號: #{selectedOrder.id}</span>
                          </div>
                      </div>

                      {/* Times */}
                      <div className="flex gap-4">
                          <div className="flex-1">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                  <Clock className="w-3 h-3" /> 訂單送出時間
                              </label>
                              <div className="font-medium text-gray-700 text-sm">{selectedOrder.submissionTime}</div>
                          </div>
                          <div className="flex-1">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                  <Calendar className="w-3 h-3" /> 希望領貨時間
                              </label>
                              <div className="font-medium text-cyan-700 text-sm">{selectedOrder.deliveryDate}</div>
                          </div>
                      </div>

                      {/* Address */}
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                              <MapPin className="w-3 h-3" /> 餐廳地址
                          </label>
                          <div className="font-medium text-gray-800 text-lg border-l-4 border-cyan-200 pl-3">
                              {selectedOrder.address}
                          </div>
                      </div>

                      {/* Items */}
                      <div className="border-t border-gray-100 pt-4">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">訂購品項</label>
                          <div className="space-y-2">
                              {selectedOrder.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
                                      <span className="text-gray-700">{item.item}</span>
                                      <span className="font-bold text-gray-900">{item.quantity} 斤</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  <button 
                    onClick={() => {
                        handleConfirm(selectedOrder.id);
                        setSelectedOrder(null);
                    }}
                    className="w-full mt-8 bg-cyan-300 text-cyan-900 font-bold py-3 rounded-xl hover:bg-cyan-400 transition-colors shadow-md"
                  >
                      確認此訂單
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default OrderReview;