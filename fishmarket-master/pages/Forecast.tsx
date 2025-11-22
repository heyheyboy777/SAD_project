
import React, { useState, useMemo } from 'react';
import { MOCK_ORDERS } from '../constants';
import { ItemType } from '../types';
import { ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Label } from 'recharts';

const Forecast: React.FC = () => {
  const [timeRange, setTimeRange] = useState('未來 7 天');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterOptions = ['未來 1 天', '未來 3 天', '未來 7 天', '未來 14 天', '未來全部'];

  // Helper to get days from option string (Duplicated logic for independence)
  const getDaysFromOption = (option: string) => {
    if (option === '未來全部') return 9999;
    const match = option.match(/(\d+)/);
    return match ? parseInt(match[0]) : 7;
  };

  // Aggregate data based on filters
  const totals = useMemo(() => {
    const map = new Map<ItemType, number>();
    Object.values(ItemType).forEach(type => map.set(type, 0));

    const daysLimit = getDaysFromOption(timeRange);
    const today = new Date('2025-10-24');

    const filteredOrders = MOCK_ORDERS.filter(order => {
        const orderDate = new Date(order.deliveryDate);
        const diffTime = orderDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        // Include only approved for forecast? usually yes, but let's include all valid for volume prediction
        return diffDays >= 0 && diffDays <= daysLimit && order.status !== 'completed';
    });

    filteredOrders.forEach(order => {
        order.items.forEach(i => {
            const current = map.get(i.item) || 0;
            map.set(i.item, current + i.quantity);
        });
    });
    return map;
  }, [timeRange]);

  // Mock price calculation
  const calculateTotal = () => {
      let sum = 0;
      const prices: Record<string, number> = {
         '小花枝': 230, '大花枝': 280, '花枝丸(中)': 160, '花枝丸(高)': 180,
         '花枝丸(最高)': 270, '透抽(中卷)': 300, '章魚': 220, '軟絲': 280
      };
      
      totals.forEach((qty, item) => {
          sum += qty * (prices[item] || 200);
      });
      return sum;
  };

  // Mock data for the Bar Chart (Past Holiday Average)
  const barChartData = useMemo(() => {
      return Object.values(ItemType).map(item => ({
          name: item,
          avg: Math.floor(Math.random() * 50) + 10, // Mock random average
          current: totals.get(item) || 0
      })).sort((a, b) => b.current - a.current); // Sort by current demand
  }, [totals]);

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-center text-gray-800 mt-4">預期報告</h1>

      {/* Holiday Context */}
      <div className="text-center space-y-1">
        <p className="text-gray-600">下一個國定假日</p>
        <div className="bg-white inline-block rounded-3xl px-12 py-4 shadow-sm mb-2">
            <div className="text-xl font-medium text-gray-800">元旦</div>
            <div className="text-7xl font-bold text-gray-900 flex items-center justify-center gap-2 leading-none mt-2">
                1<span className="text-5xl text-gray-300 font-light">/</span>1
            </div>
        </div>
      </div>

      {/* Dropdown Filter */}
      <div className="relative z-20 mx-4">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between text-lg font-bold text-gray-800"
        >
          <span>{timeRange}</span>
          <ChevronDown className={`w-6 h-6 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isFilterOpen && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-5">
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

      <div className="text-center text-gray-600 text-sm">目前實際訂購量</div>

      {/* Report Card */}
      <div className="bg-[#f0f0f0] mx-4 rounded-[40px] p-8 shadow-inner">
         <div className="flex justify-between text-xl font-bold text-gray-800 mb-6 px-4 border-b border-gray-300 pb-4">
             <span>品項</span>
             <span>數量</span>
         </div>

         <div className="space-y-4 px-4">
             {Object.values(ItemType).map((item) => {
                 const qty = totals.get(item) || 0;
                 if (qty === 0) return null; // Hide zero items to be cleaner
                 return (
                 <div key={item} className="flex justify-between items-center text-lg font-medium text-gray-800">
                     <span>{item}</span>
                     <span className="font-bold">{qty}</span>
                 </div>
             )})}
             {/* If all zero */}
             {Array.from(totals.values()).every(v => v === 0) && <div className="text-center text-gray-400">無訂單資料</div>}
         </div>

         <div className="mt-8 pt-6 border-t border-gray-300 flex justify-between items-center px-4">
             <span className="text-xl font-bold text-gray-800">總價</span>
             <span className="text-2xl font-bold text-gray-900">{calculateTotal().toLocaleString()}</span>
         </div>
      </div>

      {/* Bar Chart for Past Averages */}
      <div className="mx-4 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 text-sm font-bold">過去此節日品項訂購量分析</p>
            <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded-lg">節日: 元旦</span>
          </div>
          
          <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{top: 20, right: 20, left: 0, bottom: 25}}>
                      <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 10}} 
                        interval={0} 
                        angle={-45} 
                        textAnchor="end"
                      >
                        <Label value="品項名稱" offset={0} position="insideBottom" dy={25} style={{fontWeight: 'bold', fontSize: '12px', fill: '#666'}} />
                      </XAxis>
                      <YAxis>
                        <Label value="數量" angle={-90} position="insideLeft" style={{fontWeight: 'bold', fontSize: '12px', fill: '#666'}} />
                      </YAxis>
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}}
                      />
                      <Bar dataKey="avg" name="過去平均" radius={[4, 4, 0, 0]}>
                        {barChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#cbd5e1" />
                        ))}
                      </Bar>
                       <Bar dataKey="current" name="本次訂購" radius={[4, 4, 0, 0]}>
                        {barChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#67e8f9" />
                        ))}
                      </Bar>
                  </BarChart>
              </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-300 rounded-sm"></div>過去平均</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-300 rounded-sm"></div>本次訂購</div>
          </div>
      </div>
    </div>
  );
};

export default Forecast;