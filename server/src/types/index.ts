export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  points: number;
  currentStamps: number;
  totalStamps: number;
  memberTier: 'Silver' | 'Gold' | 'Platinum';
  lineUserId?: string;
  pictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  licensePlate: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  branchId: string;
  packageId: string;
  packageName: string;
  amount: number;
  pointsEarned: number;
  stampsEarned: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod?: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  image: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  pointsUsed: number;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: 'Available' | 'Busy' | 'Closed';
  waitingCars: number;
  image: string;
  createdAt: string;
}

export interface WashPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  pointsReward: number;
  stampsReward: number;
  image: string;
  recommended: boolean;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  isRead: boolean;
  createdAt: string;
}

export interface QRCode {
  id: string;
  userId: string;
  code: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: 'chemical' | 'equipment' | 'consumable' | 'other';
  unit: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  supplier?: string;
  location?: string;
  branchId?: string; // แยกสต็อกตามสาขา
  lastRestockDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  branchId?: string;
  userId: string;
  createdAt: string;
}
