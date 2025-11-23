export enum ItemType {
  SmallSquid = '小花枝',
  BigSquid = '大花枝',
  CuttlefishBallMed = '花枝丸(中)',
  CuttlefishBallHigh = '花枝丸(高)',
  CuttlefishBallMax = '花枝丸(最高)',
  SquidMedium = '透抽(中卷)',
  Octopus = '章魚',
  SoftCuttlefish = '軟絲'
}

export interface OrderItem {
  item: ItemType;
  quantity: number; // in catties (斤)
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  status: 'pending' | 'approved' | 'completed';
  deliveryDate: string; // ISO Date string
  isNewCustomer: boolean;
  address: string;      // New field
  submissionTime: string; // New field
}

export interface PriceData {
  item: ItemType;
  minPrice: number;
  maxPrice: number;
  history: { date: string; price: number }[];
}

export interface Notification {
  id: string;
  customerName: string;
  type: 'holiday' | 'reorder' | 'system';
  scheduledTime: string;
  details: string;
  status: 'pending' | 'sent';
  // New fields for detailed view
  email: string;
  contentBody: string;
  sendType: string; 
}

export interface CustomerReorderAlert {
  customerName: string;
  daysRemaining: number;
  autoSendTime: string;
  // New field for prediction formula
  usualOrderItems: OrderItem[]; 
}