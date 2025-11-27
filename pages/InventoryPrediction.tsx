import React, { useMemo, useState } from 'react';
import { MOCK_ORDERS, REORDER_ALERTS, PREDICTION_CONSTANTS } from '../constants';
import { ItemType } from '../types';
import { Calculator, Info } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

const InventoryPrediction: React.FC = () => {
  const [timeRange, setTimeRange] = useState('未來 7 天');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterOptions = ['未來 3 天', '未來 7 天', '未來 14 天'];

  const getDaysFromOption = (option: string) => {
    const match = option.match(/(\d+)/);
    return match ? parseInt(match[0]) : 7;
  };
  const daysLimit = getDaysFromOption(timeRange);

  // 1. Calculate Actual Orders (Pending + Approved) within timeframe
  const actualOrders = useMemo(() => {
     const map = new Map<ItemType, number>();
     Object.values(ItemType).forEach(type => map.set(type, 0));
     
     const today = new Date('2025-10-24');
     MOCK_ORDERS.forEach(order => {
         const orderDate = new Date(order.deliveryDate);
         const diffDays = Math.ceil((orderDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
         
         if (diffDays >= 0 && diffDays <= daysLimit) {
             order.items.forEach(i => {
                 map.set(i.item, (map.get(i.item) || 0) + i.quantity);
             });
         }
     });
     return map;
  }, [daysLimit]);

  // 2. Calculate Predicted Reorders (from Cycle Clients)
  const cyclePredictions = useMemo(() => {
      const map = new Map<ItemType, number>();
      Object.values(ItemType).forEach(type => map.set(type, 0));

      // If a client needs to reorder within the time range, add their "Usual Order"
      REORDER_ALERTS.forEach(alert => {
          if (alert.daysRemaining <= daysLimit) {
              alert.usualOrderItems.forEach(i => {
                  map.set(i.item, (map.get(i.item) || 0) + i.quantity);
              });
          }
      });
      return map;
  }, [daysLimit]);

  // 3. Walk-in Estimate
  const walkInEstimate = useMemo(() => {
      // Base * Days * HolidayMultiplier
      const totalBase = PREDICTION_CONSTANTS.WALK_IN_BASE_DAILY * daysLimit * PREDICTION_CONSTANTS.HOLIDAY_MULTIPLIER;
      // Distribute this total base arbitrarily across popular items for the demo
      const map = new Map<ItemType, number>();
      
      // Distribution logic (simplified for demo)
      map.set(ItemType.SmallSquid, Math.floor(totalBase * 0.3));
      map.set(ItemType.SquidMedium, Math.floor(totalBase * 0.3));
      map.set(ItemType.Octopus, Math.floor(totalBase * 0.2));
      map.set(ItemType.SoftCuttlefish, Math.floor(totalBase * 0.2));
      
      return map;
  }, [daysLimit]);


  // Combined Total
  const totalPrediction = useMemo(() => {
      const map = new Map<ItemType, number>();
      Object.values(ItemType).forEach(type => {
          const sum = (actualOrders.get(type) || 0) + 
                      (cyclePredictions.get(type) || 0) + 
                      (walkInEstimate.get(type) || 0);
          map.set(type, sum);
      });
      return map;
  }, [actualOrders, cyclePredictions, walkInEstimate]);

  return (
    <div className="space-y-6 pb-24">
       <h1 className="text-2xl font-bold text-gray-800 px-1 mt-4 flex items-center gap-2 justify-center">
           <Calculator className="w-8 h-8 text-cyan-500" />
           進貨預測系統
       </h1>

        {/* Filter */}
       <div className="relative z-20 px-4">
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

       {/* Formula Explanation */}
       <div className="bg-blue-50 border border-blue-100 mx-4 p-4 rounded-xl text-sm text-blue-800 flex gap-3">
           <Info className="w-10 h-10 shrink-0 text-blue-500" />
           <div>
               <span className="font-bold block mb-1">計算公式:</span>
               總量 = 目前訂單 + (週期客戶預測)×0.8 + (散客 × 節慶係數 :元旦{PREDICTION_CONSTANTS.HOLIDAY_MULTIPLIER})
           </div>
       </div>

       {/* Prediction Table */}
       <div className="bg-white mx-4 rounded-xl shadow-sm overflow-hidden">
           <div className="flex bg-gray-100 p-3 text-xs font-bold text-gray-500 border-b border-gray-200">
               <div className="w-1/3">品項</div>
               <div className="w-1/6 text-center">訂單</div>
               <div className="w-1/6 text-center">週期</div>
               <div className="w-1/6 text-center">散客</div>
               <div className="w-1/6 text-right pr-2 text-cyan-600">總計</div>
           </div>
           
           <div className="divide-y divide-gray-100">
               {Object.values(ItemType).map(item => {
                   const actual = actualOrders.get(item) || 0;
                   const cycle = cyclePredictions.get(item) || 0;
                   const walkIn = walkInEstimate.get(item) || 0;
                   const total = totalPrediction.get(item) || 0;
                   
                   if (total === 0) return null;

                   return (
                       <div key={item} className="flex p-4 text-sm items-center">
                           <div className="w-1/3 font-bold text-gray-800">{item}</div>
                           <div className="w-1/6 text-center text-gray-500">{actual}</div>
                           <div className="w-1/6 text-center text-gray-500">{cycle}</div>
                           <div className="w-1/6 text-center text-gray-500">{walkIn}</div>
                           <div className="w-1/6 text-right font-black text-xl text-cyan-600 pr-2">{total}</div>
                       </div>
                   );
               })}
           </div>
       </div>

       <div className="px-6">
           <button className="w-full bg-cyan-400 text-cyan-900 font-bold py-4 rounded-2xl shadow-lg hover:bg-cyan-300 transition-colors">
               匯出進貨單
           </button>
       </div>

    </div>
  );
};

export default InventoryPrediction;
