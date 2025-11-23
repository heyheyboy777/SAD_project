import React, { useState, useMemo } from 'react';
import { ItemType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { ChevronDown, History } from 'lucide-react';

const HistoryAnalysis: React.FC = () => {
  const [timeRange, setTimeRange] = useState('過去 7 天');
  const [selectedItem, setSelectedItem] = useState<ItemType>(ItemType.SmallSquid);

  const timeOptions = ['過去 7 天', '過去 30 天', '過去 3 個月'];
  const itemOptions = Object.values(ItemType);

  // Generate mock data based on selection
  const chartData = useMemo(() => {
    const data = [];
    let days = 7;
    if (timeRange === '過去 30 天') days = 30;
    if (timeRange === '過去 3 個月') days = 90;

    // Anchor date is Oct 24, 2025 as per other files
    const endDate = new Date('2025-10-24');

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - i);
      
      // Generate "Reasonable" random values
      // Base volume depends on item popularity (mock logic)
      let base = 30; 
      if (selectedItem === ItemType.BigSquid) base = 20;
      if (selectedItem === ItemType.Octopus) base = 25;
      if (selectedItem.includes('丸')) base = 40; // Balls sell more volume
      
      // Add randomness
      const randomFluctuation = Math.floor(Math.random() * 20) - 10;
      
      // Add Weekend Spike
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const weekendBoost = isWeekend ? 15 : 0;

      let quantity = base + randomFluctuation + weekendBoost;
      quantity = Math.max(5, quantity); // Min 5 catties

      data.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        quantity: quantity,
        fullDate: d.toLocaleDateString()
      });
    }
    return data;
  }, [timeRange, selectedItem]);

  // Calculate stats
  const totalVolume = chartData.reduce((acc, curr) => acc + curr.quantity, 0);
  const avgVolume = Math.round(totalVolume / chartData.length);

  return (
    <div className="space-y-6 pb-24 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mt-4 flex items-center justify-center gap-3">
        <History className="w-8 h-8 text-cyan-600" />
        歷史訂單分析
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4 px-4">
        {/* Time Selector */}
        <div className="relative">
           <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">時間範圍</label>
           <div className="relative">
             <select 
                className="w-full appearance-none bg-white p-3 pr-10 rounded-xl shadow-sm text-sm font-bold text-gray-800 outline-none border border-transparent focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 transition-all"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
             >
               {timeOptions.map(opt => (
                 <option key={opt} value={opt}>{opt}</option>
               ))}
             </select>
             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
           </div>
        </div>

        {/* Item Selector */}
        <div className="relative">
           <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">選擇品項</label>
           <div className="relative">
             <select 
                className="w-full appearance-none bg-white p-3 pr-10 rounded-xl shadow-sm text-sm font-bold text-gray-800 outline-none border border-transparent focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 transition-all"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value as ItemType)}
             >
               {itemOptions.map(item => (
                 <option key={item} value={item}>{item}</option>
               ))}
             </select>
             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 px-4">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="text-xs text-blue-500 font-bold mb-1">總出貨量</div>
              <div className="text-2xl font-black text-blue-900">{totalVolume.toLocaleString()} <span className="text-sm font-medium">斤</span></div>
          </div>
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <div className="text-xs text-purple-500 font-bold mb-1">平均日出貨</div>
              <div className="text-2xl font-black text-purple-900">{avgVolume} <span className="text-sm font-medium">斤</span></div>
          </div>
      </div>

      {/* Chart Card */}
      <div className="mx-4 bg-white rounded-[30px] p-6 shadow-lg border border-gray-100 min-h-[400px]">
         <div className="flex justify-between items-center mb-6">
             <div>
                <h2 className="text-lg font-bold text-gray-800">{selectedItem}</h2>
                <p className="text-xs text-gray-400">出貨趨勢圖</p>
             </div>
             <div className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-lg text-xs font-bold">
                 {timeRange}
             </div>
         </div>

         <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{fontSize: 11, fill: '#9ca3af'}}
                        dy={10}
                        minTickGap={30}
                    />
                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{fontSize: 11, fill: '#9ca3af'}}
                    />
                    <Tooltip 
                        contentStyle={{
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                        }}
                        labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                        cursor={{ stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="quantity" 
                        stroke="#06b6d4" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorQty)" 
                        name="出貨量(斤)"
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
         </div>
         
         <div className="text-center text-xs text-gray-400 mt-4">
             * 數據包含所有已完成與歷史訂單
         </div>
      </div>
    </div>
  );
};

export default HistoryAnalysis;