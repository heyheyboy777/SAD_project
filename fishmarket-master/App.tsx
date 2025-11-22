
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import OrderManagement from './pages/OrderManagement';
import OrderReview from './pages/OrderReview';
import NotificationCenter from './pages/NotificationCenter';
import Forecast from './pages/Forecast';
import PriceControl from './pages/PriceControl';
import InventoryPrediction from './pages/InventoryPrediction';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<OrderManagement />} />
          <Route path="review" element={<OrderReview />} />
          <Route path="notifications" element={<NotificationCenter />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="prices" element={<PriceControl />} />
          <Route path="prediction" element={<InventoryPrediction />} />
          <Route path="customers" element={<div className="p-8 text-center text-gray-500">客戶管理功能開發中...</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
