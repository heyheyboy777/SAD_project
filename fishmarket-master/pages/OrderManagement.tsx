
import React, { useState, useMemo } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { MOCK_ORDERS } from '../constants';
import { Link } from 'react-router-dom';

const OrderManagement: React.FC = () => {
  const [timeRange, setTimeRange] = useState('未來 7 天');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
                <tr key={row.id} className="hover:bg-gray-50/50">
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
    </div>
  );
};

export default OrderManagement;
