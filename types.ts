
export interface WashPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  recommended?: boolean;
  image: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
}

export interface Reward {
  id: string;
  name: string;
  points: number;
  image: string;
  category: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  unread: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  currentStamps: number;
  totalStamps: number;
  memberTier: 'Silver' | 'Gold' | 'Platinum';
  lineUserId?: string;
  pictureUrl?: string;
  vehicles?: Vehicle[];
}

export interface WashHistory {
  id: string;
  date: string;
  package: string;
  price: number;
  pointsEarned: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  distance: string;
  status: 'Available' | 'Busy' | 'Closed';
  waitingCars: number;
  lat: number;
  lng: number;
  image: string;
}
