
import React, { useState } from 'react';
import { INITIAL_PRICES } from '../constants';
import { ItemType } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

const PriceControl: React.FC = () => {
  // Local state to handle edits
  const [prices, setPrices] = useState(INITIAL_PRICES);
  const [editBuffer, setEditBuffer] = useState(INITIAL_PRICES); // For temporary values during edit
  const [editing, setEditing] = useState(false);
  const [selectedItemForChart, setSelectedItemForChart] = useState<ItemType | null>(null);

  const activeChartData = prices.find(p => p.item === selectedItemForChart);

  const handleInputChange = (item: ItemType, field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = parseInt(value) || 0;
    setEditBuffer(prev => prev.map(p => 
        p.item === item ? { ...p, [field]: numValue } : p
    ));
  };

  const savePrices = () => {
      setPrices(editBuffer);
      setEditing(false);
  };

  const cancelEdit = () => {
      setEditBuffer(prices);
      setEditing(false);
  };

  return (
    <div className="space-y-6 pb-20 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mt-4">價格管理</h1>

      {/* Price List Card */}
      <div className="bg-white mx-4 rounded-[30px] p-6 shadow-lg min-h-[60vh]">
        <div className="flex justify-between text-gray-500 font-bold mb-4 px-2">
            <span>品項</span>
            <span>目前價格</span>
        </div>

        <div className="space-y-6">
            {prices.map((p, idx) => {
                // Use buffer if editing, otherwise real state
                const displayData = editing ? editBuffer[idx] : p; 
                
                return (
                <div key={p.item} className="flex items-center justify-between group">
                    <span 
                        className="text-xl font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => setSelectedItemForChart(p.item)}
                    >
                        {p.item}
                    </span>
                    <div className="flex items-center gap-4">
                        {editing ? (
                            <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                                <input 
                                    type="number" 
                                    className="w-14 bg-transparent text-right text-red-500 font-bold outline-none"
                                    value={displayData.minPrice}
                                    onChange={(e) => handleInputChange(p.item, 'minPrice', e.target.value)}
                                />
                                <span className="text-gray-400">-</span>
                                <input 
                                    type="number" 
                                    className="w-14 bg-transparent text-right text-red-500 font-bold outline-none"
                                    value={displayData.maxPrice} 
                                    onChange={(e) => handleInputChange(p.item, 'maxPrice', e.target.value)}
                                />
                            </div>
                        ) : (
                             <span 
                                className={`text-lg font-bold cursor-pointer ${p.item === ItemType.CuttlefishBallMed ? 'text-red-500' : 'text-red-400'}`}
                                onClick={() => setSelectedItemForChart(p.item)}
                             >
                                {p.minPrice === p.maxPrice ? p.minPrice : `${p.minPrice}-${p.maxPrice}`}
                            </span>
                        )}
                        <span className="text-gray-500 text-sm font-medium">每斤</span>
                    </div>
                </div>
            )})}
        </div>

        <div className="mt-12 flex justify-end">
            {editing ? (
                 <div className="flex gap-4 w-full">
                     <button 
                        onClick={savePrices}
                        className="flex-1 bg-cyan-200 hover:bg-cyan-300 text-cyan-900 py-3 rounded-xl font-bold transition-colors"
                    >
                        確認
                    </button>
                    <button 
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-xl font-bold transition-colors"
                    >
                        取消
                    </button>
                 </div>
            ) : (
                <div className="w-full space-y-4">
                    <button 
                        onClick={() => setEditing(true)}
                        className="w-full bg-cyan-200 hover:bg-cyan-300 text-cyan-900 py-3 rounded-xl font-bold transition-colors shadow-sm"
                    >
                        調整價格
                    </button>
                     <button 
                        onClick={() => setSelectedItemForChart(ItemType.BigSquid)}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-xl font-bold transition-colors shadow-sm"
                    >
                        查看過去價格走勢
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Chart Modal */}
      {selectedItemForChart && activeChartData && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedItemForChart(null)}>
              <div className="bg-white/90 w-full max-w-md rounded-[30px] p-6 shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-600">歷史價格</h3>
                  </div>

                  <div className="bg-white rounded-lg p-2 mb-6 shadow-inner flex justify-between items-center border border-gray-200">
                      <span className="px-4 text-lg font-bold text-gray-800">{selectedItemForChart}</span>
                      <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
                  </div>
                  
                  <div className="h-64 w-full bg-blue-50/50 rounded-xl border border-blue-100 p-2">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={activeChartData.history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#6b7280'}}
                                    dy={10}
                                />
                                <YAxis 
                                    hide={false} 
                                    axisLine={false}
                                    tickLine={false}
                                    domain={['dataMin - 20', 'dataMax + 20']}
                                    tick={{fontSize: 12, fill: '#6b7280'}}
                                />
                                <Tooltip 
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="#0ea5e9" 
                                    strokeWidth={3} 
                                    dot={{r: 4, fill: 'white', stroke: '#0ea5e9', strokeWidth: 2}} 
                                    activeDot={{r: 6}}
                                />
                          </LineChart>
                      </ResponsiveContainer>
                  </div>

                  <button 
                    onClick={() => setSelectedItemForChart(null)}
                    className="w-full mt-8 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-full font-bold transition-colors"
                  >
                      關閉
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default PriceControl;
