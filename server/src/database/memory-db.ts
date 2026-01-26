import { User, Vehicle, Transaction, Reward, RewardRedemption, Branch, WashPackage, Notification, QRCode, StockItem, StockMovement } from '../types/index.js';

interface Database {
  users: Map<string, User>;
  vehicles: Map<string, Vehicle>;
  transactions: Map<string, Transaction>;
  rewards: Map<string, Reward>;
  redemptions: Map<string, RewardRedemption>;
  branches: Map<string, Branch>;
  packages: Map<string, WashPackage>;
  notifications: Map<string, Notification>;
  qrCodes: Map<string, QRCode>;
  stockItems: Map<string, StockItem>;
  stockMovements: Map<string, StockMovement>;
}

export const db: Database = {
  users: new Map(),
  vehicles: new Map(),
  transactions: new Map(),
  rewards: new Map(),
  redemptions: new Map(),
  branches: new Map(),
  packages: new Map(),
  notifications: new Map(),
  qrCodes: new Map(),
  stockItems: new Map(),
  stockMovements: new Map()
};

export function findUser(predicate: (user: User) => boolean): User | undefined {
  for (const user of db.users.values()) {
    if (predicate(user)) return user;
  }
  return undefined;
}

export function findUsers(predicate: (user: User) => boolean): User[] {
  const results: User[] = [];
  for (const user of db.users.values()) {
    if (predicate(user)) results.push(user);
  }
  return results;
}

export function findVehicles(predicate: (vehicle: Vehicle) => boolean): Vehicle[] {
  const results: Vehicle[] = [];
  for (const vehicle of db.vehicles.values()) {
    if (predicate(vehicle)) results.push(vehicle);
  }
  return results;
}

export function findTransactions(predicate: (tx: Transaction) => boolean): Transaction[] {
  const results: Transaction[] = [];
  for (const tx of db.transactions.values()) {
    if (predicate(tx)) results.push(tx);
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function findNotifications(predicate: (notif: Notification) => boolean): Notification[] {
  const results: Notification[] = [];
  for (const notif of db.notifications.values()) {
    if (predicate(notif)) results.push(notif);
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function findRedemptions(predicate: (redemption: RewardRedemption) => boolean): RewardRedemption[] {
  const results: RewardRedemption[] = [];
  for (const redemption of db.redemptions.values()) {
    if (predicate(redemption)) results.push(redemption);
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllBranches(): Branch[] {
  return Array.from(db.branches.values());
}

export function getAllPackages(): WashPackage[] {
  return Array.from(db.packages.values());
}

export function getAllRewards(): Reward[] {
  return Array.from(db.rewards.values());
}

export function findQRCode(predicate: (qr: QRCode) => boolean): QRCode | undefined {
  for (const qr of db.qrCodes.values()) {
    if (predicate(qr)) return qr;
  }
  return undefined;
}

export function findStockItems(predicate: (item: StockItem) => boolean): StockItem[] {
  const results: StockItem[] = [];
  for (const item of db.stockItems.values()) {
    if (predicate(item)) results.push(item);
  }
  return results;
}

export function findStockMovements(predicate: (movement: StockMovement) => boolean): StockMovement[] {
  const results: StockMovement[] = [];
  for (const movement of db.stockMovements.values()) {
    if (predicate(movement)) results.push(movement);
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export default db;
