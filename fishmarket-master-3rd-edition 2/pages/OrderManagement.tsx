import React, { useState, useMemo } from 'react';
import { ChevronDown, AlertCircle, X, Calendar, Clock, Edit, MapPin, FileText } from 'lucide-react';
import { MOCK_ORDERS } from '../constants';
import { Link } from 'react-router-dom';
import { Order } from '../types';

const OrderManagement: React.FC = () => {
  const [timeRange, setTimeRange] = useState('未來 7 天');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filterOptions = ['未來 1 天', '未來 3 天', '未來 7 天', '未來 14 天', '未來全部'];

  // Helper to get days from option string
  const getDaysFromOption = (option: string) => {
    if (option === '未來全部') return 9999;
    const match = option.match(/(\d+)/);
    return match ? parseInt(match[0]) : 7;
  };

  const filteredOrders = useMemo(() => {
    const daysLimit = getDaysFromOption(timeRange);
    const today = new Date('2025-10-24'); // Anchor date
    
    return MOCK_ORDERS.filter(order => {
      const orderDate = new Date(order.deliveryDate);
      const diffTime = orderDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      // Filter: Date is today or future, AND within the limit
      return diffDays >= 0 && diffDays <= daysLimit;
    });
  }, [timeRange]);

  const pendingOrdersCount = filteredOrders.filter(o => o.status === 'pending').length;
  const pendingNewCustomerCount = filteredOrders.filter(o => o.status === 'pending' && o.isNewCustomer).length;

  // Mock grouping logic for the table - flattening items for display like the screenshot
  const tableData = useMemo(() => {
    return filteredOrders.map(order => {
      const row: any = {
        id: order.id,
        customer: order.customerName,
        item1: order.items[0]?.item || '',
        qty1: order.items[0]?.quantity || '',
        item2: order.items[1]?.item || '',
        qty2: order.items[1]?.quantity || '',
        status: order.status
      };
      return row;
    });
  }, [filteredOrders]);

  // Fill empty rows to match the grid aesthetic
  const emptyRows = Array(Math.max(0, 8 - tableData.length)).fill(null);

  const handleRowClick = (orderId: string) => {
    const order = MOCK_ORDERS.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header Filter */}
      <div className="relative z-20">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between text-xl font-bold text-gray-800"
        >
          <span>{timeRange}</span>
          <ChevronDown className={`w-6 h-6 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isFilterOpen && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-5 z-30">
            {filterOptions.map((option) => (
              <button
                key={option}
                className="w-full text-left p-4 text-lg font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                onClick={() => {
                  setTimeRange(option);
                  setIsFilterOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 px-1">訂單</h1>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[300px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-3 font-medium whitespace-nowrap">店家</th>
                <th className="p-3 font-medium whitespace-nowrap">品項一</th>
                <th className="p-3 font-medium whitespace-nowrap">數量(斤)</th>
                <th className="p-3 font-medium whitespace-nowrap">品項二</th>
                <th className="p-3 font-medium whitespace-nowrap">數量(斤)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.length > 0 ? tableData.map((row) => (
                <tr 
                    key={row.id} 
                    className="hover:bg-gray-50/50 cursor-pointer transition-colors active:bg-gray-100"
                    onClick={() => handleRowClick(row.id)}
                >
                  <td className="p-3 text-gray-900 font-medium">{row.customer}</td>
                  <td className="p-3 text-gray-600">{row.item1}</td>
                  <td className="p-3 text-right pr-8 text-gray-900">{row.qty1}</td>
                  <td className="p-3 text-gray-600">{row.item2}</td>
                  <td className="p-3 text-right pr-8 text-gray-900">{row.qty2}</td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">無此期間訂單</td>
                </tr>
              )}
              {emptyRows.map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="p-3">&nbsp;</td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4 px-2">
        <Link 
            to="/forecast"
            className="block w-full py-4 bg-gray-500 hover:bg-gray-600 text-white text-center rounded-2xl text-lg font-medium shadow-md transition-colors"
        >
            檢視訂單總結
        </Link>

        <Link 
            to="/review"
            className="block w-full py-4 bg-cyan-300 hover:bg-cyan-400 text-gray-900 text-center rounded-2xl text-lg font-bold shadow-md transition-colors flex items-center justify-center gap-2"
        >
            待審核訂單 
            {pendingOrdersCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] flex items-center justify-center">{pendingOrdersCount}</span>}
        </Link>

        <Link 
            to="/customers"
            className="block w-full py-4 bg-green-300 hover:bg-green-400 text-gray-900 text-center rounded-2xl text-lg font-bold shadow-md transition-colors"
        >
            待審核新客戶 
            {pendingNewCustomerCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingNewCustomerCount}</span>}
        </Link>
      </div>

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
                      {/* Customer Info */}
                      <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">客戶名稱</label>
                            <div className="font-bold text-lg text-gray-800">{selectedOrder.customerName}</div>
                            <div className="text-xs text-gray-500 mt-1">訂單編號 #{selectedOrder.id}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                              selectedOrder.status === 'approved' ? 'bg-green-100 text-green-700' : 
                              selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                              {selectedOrder.status === 'approved' ? '已確認' : selectedOrder.status === 'pending' ? '待審核' : '已完成'}
                          </div>
                      </div>

                      {/* Dates */}
                      <div className="flex gap-4">
                          <div className="flex-1">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                  <Clock className="w-3 h-3" /> 下單時間
                              </label>
                              <div className="font-medium text-gray-700 text-sm">{selectedOrder.submissionTime}</div>
                          </div>
                          <div className="flex-1">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                  <Calendar className="w-3 h-3" /> 交貨時間
                              </label>
                              <div className="font-medium text-cyan-700 text-sm">{selectedOrder.deliveryDate}</div>
                          </div>
                      </div>

                       {/* Address */}
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                              <MapPin className="w-3 h-3" /> 送貨地址
                          </label>
                          <div className="font-medium text-gray-800 text-sm border-l-4 border-cyan-200 pl-3 py-1">
                              {selectedOrder.address}
                          </div>
                      </div>

                      {/* Items List */}
                      <div className="border-t border-gray-100 pt-4">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">訂購品項</label>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {selectedOrder.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl">
                                      <span className="text-gray-700 font-medium">{item.item}</span>
                                      <span className="font-bold text-gray-900">{item.quantity} 斤</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* Edit Button */}
                  <button 
                    onClick={() => alert('此功能將連接到編輯頁面')}
                    className="w-full mt-8 bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-700 transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                      <Edit className="w-4 h-4" />
                      修改訂單
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default OrderManagement;