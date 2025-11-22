
import { ItemType, Order, PriceData, Notification, CustomerReorderAlert } from './types';

// Helper to get date string for "Today + N days"
const getDate = (daysAdd: number) => {
  const date = new Date('2025-10-24'); // Anchor date
  date.setDate(date.getDate() + daysAdd);
  return date.toISOString().split('T')[0];
};

export const MOCK_ORDERS: Order[] = [
  {
    id: '2025102401',
    customerName: '台灣小吃',
    items: [{ item: ItemType.SquidMedium, quantity: 15 }],
    status: 'approved',
    deliveryDate: getDate(0), // Today
    isNewCustomer: false,
    address: '台北市信義區松山路 123 號',
    submissionTime: '2025-10-23 14:30'
  },
  {
    id: '2025102402',
    customerName: '日料店',
    items: [
      { item: ItemType.SmallSquid, quantity: 5 },
      { item: ItemType.SoftCuttlefish, quantity: 5 },
    ],
    status: 'approved',
    deliveryDate: getDate(0), // Today
    isNewCustomer: false,
    address: '台北市大安區忠孝東路四段 55 號',
    submissionTime: '2025-10-23 20:15'
  },
  {
    id: '2025102403',
    customerName: '飽處',
    items: [
      { item: ItemType.BigSquid, quantity: 10 },
      { item: ItemType.Octopus, quantity: 10 },
    ],
    status: 'approved',
    deliveryDate: getDate(1), // Tomorrow
    isNewCustomer: false,
    address: '新北市板橋區文化路一段 20 號',
    submissionTime: '2025-10-24 09:00'
  },
  {
    id: '2025102404',
    customerName: '鍋台銘',
    items: [{ item: ItemType.CuttlefishBallMed, quantity: 20 }],
    status: 'approved',
    deliveryDate: getDate(2), // +2 days
    isNewCustomer: false,
    address: '台北市內湖區瑞光路 500 號',
    submissionTime: '2025-10-23 11:45'
  },
  {
    id: '2025102405',
    customerName: '山海珍',
    items: [
        { item: ItemType.Octopus, quantity: 15 },
        { item: ItemType.BigSquid, quantity: 10 },
    ],
    status: 'pending',
    deliveryDate: getDate(5), // +5 days (in 7 day range)
    isNewCustomer: false,
    address: '基隆市仁愛區愛三路 88 號',
    submissionTime: '2025-10-24 13:20'
  },
  {
    id: '2025102406',
    customerName: '品味格',
    items: [
        { item: ItemType.SmallSquid, quantity: 10 },
        { item: ItemType.CuttlefishBallMax, quantity: 10 },
    ],
    status: 'pending',
    deliveryDate: getDate(10), // +10 days (in 14 day range)
    isNewCustomer: true,
    address: '台北市士林區文林路 101 號',
    submissionTime: '2025-10-24 15:50'
  },
   {
    id: '2025102407',
    customerName: '宴飲方',
    items: [
        { item: ItemType.SquidMedium, quantity: 20 },
    ],
    status: 'pending',
    deliveryDate: getDate(13), // +13 days
    isNewCustomer: false,
    address: '新北市新莊區中正路 330 號',
    submissionTime: '2025-10-24 16:10'
  },
];

export const INITIAL_PRICES: PriceData[] = [
  { item: ItemType.SmallSquid, minPrice: 220, maxPrice: 240, history: generateHistory(220) },
  { item: ItemType.BigSquid, minPrice: 260, maxPrice: 300, history: generateHistory(260) },
  { item: ItemType.CuttlefishBallMed, minPrice: 160, maxPrice: 160, history: generateHistory(160) },
  { item: ItemType.CuttlefishBallHigh, minPrice: 180, maxPrice: 180, history: generateHistory(180) },
  { item: ItemType.CuttlefishBallMax, minPrice: 270, maxPrice: 270, history: generateHistory(270) },
  { item: ItemType.SquidMedium, minPrice: 260, maxPrice: 350, history: generateHistory(260) },
  { item: ItemType.Octopus, minPrice: 180, maxPrice: 260, history: generateHistory(180) },
  { item: ItemType.SoftCuttlefish, minPrice: 280, maxPrice: 280, history: generateHistory(280) },
];

export const REORDER_ALERTS: CustomerReorderAlert[] = [
    { 
      customerName: '海鮮餐廳', 
      daysRemaining: 2, 
      autoSendTime: '10:00 AM',
      usualOrderItems: [{ item: ItemType.BigSquid, quantity: 20 }, { item: ItemType.Octopus, quantity: 10 }]
    },
    { 
      customerName: '私廚', 
      daysRemaining: 1, 
      autoSendTime: '09:30 AM',
      usualOrderItems: [{ item: ItemType.SoftCuttlefish, quantity: 10 }]
    },
    { 
      customerName: '馬可波羅', 
      daysRemaining: 0, 
      autoSendTime: '08:00 AM',
      usualOrderItems: [{ item: ItemType.SmallSquid, quantity: 30 }]
    },
];

export const PAST_NOTIFICATIONS: Notification[] = [
    { 
        id: '1', 
        customerName: '小劉', 
        type: 'holiday', 
        scheduledTime: '11/22 7:59 AM', 
        details: '節慶提醒', 
        status: 'sent',
        email: 'liu_restaurant@gmail.com',
        sendType: '節慶活動',
        contentBody: '親愛的小劉老闆，元旦假期將至，市場預計需求量大增。建議您提早備貨小花枝與軟絲，我們已為您保留部分額度，請盡快確認訂單。'
    },
    { 
        id: '2', 
        customerName: '郭台銘', 
        type: 'holiday', 
        scheduledTime: '11/22 7:59 AM', 
        details: '節慶提醒', 
        status: 'sent',
        email: 'kuo_hotpot@foxconn.com',
        sendType: '節慶活動',
        contentBody: '郭老闆您好，佳節愉快！感謝您對我們海鮮的支持。因應節日，花枝丸系列目前供應緊張，建議您於本週五前下單以確保供貨無虞。'
    },
    { 
        id: '3', 
        customerName: '陳先生', 
        type: 'reorder', 
        scheduledTime: '11/22 7:59 AM', 
        details: '週期提醒', 
        status: 'sent',
        email: 'chen_seafood@yahoo.com.tw',
        sendType: '訂貨週期',
        contentBody: '陳大哥您好，系統顯示您的庫存週期將近，依照往例您可能需要補貨透抽(中卷)約 20 斤。是否照常幫您安排配送？'
    },
];

export const PREDICTION_CONSTANTS = {
    WALK_IN_BASE_DAILY: 30, // catties
    HOLIDAY_MULTIPLIER: 1.5,
};

function generateHistory(base: number) {
    const history = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < 7; i++) {
        history.push({
            date: days[i],
            price: base + Math.floor(Math.random() * 40) - 20
        });
    }
    return history;
}