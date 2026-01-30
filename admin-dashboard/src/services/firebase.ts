import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collections
const COLLECTIONS = {
  USERS: 'users',
  BRANCHES: 'branches',
  PACKAGES: 'packages',
  REWARDS: 'rewards',
  TRANSACTIONS: 'transactions',
  STOCK: 'stock',
  STOCK_MOVEMENTS: 'stockMovements',
  MAINTENANCE: 'maintenance',
  NOTIFICATIONS: 'notifications',
};

// ==================== USERS ====================
export const getUsers = async (filters?: { search?: string; tier?: string; limit?: number }) => {
  try {
    let q = query(collection(db, COLLECTIONS.USERS));
    
    if (filters?.tier && filters.tier !== 'all') {
      q = query(q, where('memberTier', '==', filters.tier));
    }
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Client-side search if needed
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      return users.filter((user: any) => 
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.includes(searchLower)
      );
    }
    
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const getUser = async (id: string) => {
  const docRef = doc(db, COLLECTIONS.USERS, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// ==================== BRANCHES ====================
export const getBranches = async () => {
  const snapshot = await getDocs(collection(db, COLLECTIONS.BRANCHES));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createBranch = async (data: any) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.BRANCHES), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
};

export const updateBranch = async (id: string, data: any) => {
  const docRef = doc(db, COLLECTIONS.BRANCHES, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return { id, ...data };
};

export const deleteBranch = async (id: string) => {
  await deleteDoc(doc(db, COLLECTIONS.BRANCHES, id));
};

// ==================== PACKAGES ====================
export const getPackages = async () => {
  const snapshot = await getDocs(collection(db, COLLECTIONS.PACKAGES));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createPackage = async (data: any) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.PACKAGES), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
};

export const updatePackage = async (id: string, data: any) => {
  const docRef = doc(db, COLLECTIONS.PACKAGES, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return { id, ...data };
};

export const deletePackage = async (id: string) => {
  await deleteDoc(doc(db, COLLECTIONS.PACKAGES, id));
};

// ==================== REWARDS ====================
export const getRewards = async () => {
  const snapshot = await getDocs(collection(db, COLLECTIONS.REWARDS));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createReward = async (data: any) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.REWARDS), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
};

export const updateReward = async (id: string, data: any) => {
  const docRef = doc(db, COLLECTIONS.REWARDS, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return { id, ...data };
};

export const deleteReward = async (id: string) => {
  await deleteDoc(doc(db, COLLECTIONS.REWARDS, id));
};

// ==================== TRANSACTIONS ====================
export const getTransactions = async (filters?: any) => {
  try {
    let q = query(collection(db, COLLECTIONS.TRANSACTIONS), orderBy('createdAt', 'desc'));
    
    if (filters?.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters?.branchId && filters.branchId !== 'all') {
      q = query(q, where('branchId', '==', filters.branchId));
    }
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

// ==================== STOCK ====================
export const getStockItems = async (filters?: { branchId?: string; category?: string }) => {
  try {
    let q = query(collection(db, COLLECTIONS.STOCK));
    
    if (filters?.branchId && filters.branchId !== 'all') {
      q = query(q, where('branchId', '==', filters.branchId));
    }
    
    if (filters?.category && filters.category !== 'all') {
      q = query(q, where('category', '==', filters.category));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting stock items:', error);
    throw error;
  }
};

export const createStockItem = async (data: any) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.STOCK), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
};

export const updateStockItem = async (id: string, data: any) => {
  const docRef = doc(db, COLLECTIONS.STOCK, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return { id, ...data };
};

export const deleteStockItem = async (id: string) => {
  await deleteDoc(doc(db, COLLECTIONS.STOCK, id));
};

export const stockIn = async (itemId: string, quantity: number, reason: string, branchId?: string) => {
  const itemRef = doc(db, COLLECTIONS.STOCK, itemId);
  const itemSnap = await getDoc(itemRef);
  
  if (!itemSnap.exists()) {
    throw new Error('Stock item not found');
  }
  
  const currentQuantity = itemSnap.data().quantity || 0;
  const newQuantity = currentQuantity + quantity;
  
  // Update stock quantity
  await updateDoc(itemRef, {
    quantity: newQuantity,
    lastRestockDate: serverTimestamp(),
  });
  
  // Create stock movement record
  await addDoc(collection(db, COLLECTIONS.STOCK_MOVEMENTS), {
    stockItemId: itemId,
    type: 'in',
    quantity,
    previousQuantity: currentQuantity,
    newQuantity,
    reason,
    branchId,
    createdAt: serverTimestamp(),
  });
  
  return { id: itemId, quantity: newQuantity };
};

export const stockOut = async (itemId: string, quantity: number, reason: string, branchId?: string) => {
  const itemRef = doc(db, COLLECTIONS.STOCK, itemId);
  const itemSnap = await getDoc(itemRef);
  
  if (!itemSnap.exists()) {
    throw new Error('Stock item not found');
  }
  
  const currentQuantity = itemSnap.data().quantity || 0;
  
  if (currentQuantity < quantity) {
    throw new Error('Insufficient stock');
  }
  
  const newQuantity = currentQuantity - quantity;
  
  // Update stock quantity
  await updateDoc(itemRef, {
    quantity: newQuantity,
  });
  
  // Create stock movement record
  await addDoc(collection(db, COLLECTIONS.STOCK_MOVEMENTS), {
    stockItemId: itemId,
    type: 'out',
    quantity,
    previousQuantity: currentQuantity,
    newQuantity,
    reason,
    branchId,
    createdAt: serverTimestamp(),
  });
  
  return { id: itemId, quantity: newQuantity };
};

export const getStockMovements = async (filters?: { stockItemId?: string; branchId?: string }) => {
  try {
    let q = query(collection(db, COLLECTIONS.STOCK_MOVEMENTS), orderBy('createdAt', 'desc'));
    
    if (filters?.stockItemId) {
      q = query(q, where('stockItemId', '==', filters.stockItemId));
    }
    
    if (filters?.branchId && filters.branchId !== 'all') {
      q = query(q, where('branchId', '==', filters.branchId));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting stock movements:', error);
    throw error;
  }
};

// ==================== MAINTENANCE ====================
export const getMaintenanceTasks = async (filters?: any) => {
  try {
    let q = query(collection(db, COLLECTIONS.MAINTENANCE), orderBy('dueDate', 'asc'));
    
    if (filters?.type && filters.type !== 'all') {
      q = query(q, where('type', '==', filters.type));
    }
    
    if (filters?.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters?.branchId && filters.branchId !== 'all') {
      q = query(q, where('branchId', '==', filters.branchId));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting maintenance tasks:', error);
    throw error;
  }
};

export const createMaintenanceTask = async (data: any) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.MAINTENANCE), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
};

export const updateMaintenanceTask = async (id: string, data: any) => {
  const docRef = doc(db, COLLECTIONS.MAINTENANCE, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return { id, ...data };
};

export const completeMaintenanceTask = async (id: string, completedBy: string, notes: string, checklist: any[]) => {
  const docRef = doc(db, COLLECTIONS.MAINTENANCE, id);
  await updateDoc(docRef, {
    status: 'completed',
    completedDate: serverTimestamp(),
    completedBy,
    notes,
    checklist,
    updatedAt: serverTimestamp(),
  });
  return { id };
};

// ==================== DASHBOARD ====================
export const getDashboardStats = async () => {
  try {
    const [usersSnap, branchesSnap, transactionsSnap] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.USERS)),
      getDocs(collection(db, COLLECTIONS.BRANCHES)),
      getDocs(query(collection(db, COLLECTIONS.TRANSACTIONS), where('status', '==', 'completed'))),
    ]);
    
    const users = usersSnap.docs.map(doc => doc.data());
    const branches = branchesSnap.docs.map(doc => doc.data());
    const transactions = transactionsSnap.docs.map(doc => doc.data());
    
    const totalRevenue = transactions.reduce((sum, t: any) => sum + (t.amount || 0), 0);
    const averageOrderValue = transactions.length > 0 ? totalRevenue / transactions.length : 0;
    
    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTransactions = transactions.filter((t: any) => {
      const createdAt = t.createdAt?.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
      return createdAt >= today;
    });
    const todayRevenue = todayTransactions.reduce((sum, t: any) => sum + (t.amount || 0), 0);
    
    const todayUsers = users.filter((u: any) => {
      const createdAt = u.createdAt?.toDate ? u.createdAt.toDate() : new Date(u.createdAt);
      return createdAt >= today;
    });
    
    return {
      stats: {
        totalRevenue,
        totalUsers: users.length,
        totalTransactions: transactions.length,
        averageOrderValue,
        todayRevenue,
        newUsersToday: todayUsers.length,
        activeBranches: branches.filter((b: any) => b.status === 'Available').length,
        totalBranches: branches.length,
        growth: {
          revenue: 12.5,
          users: 8.3,
          transactions: 15.2,
        }
      },
      recentTransactions: transactions.slice(0, 10)
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

export default {
  getUsers,
  getUser,
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  getTransactions,
  getStockItems,
  createStockItem,
  updateStockItem,
  deleteStockItem,
  stockIn,
  stockOut,
  getStockMovements,
  getMaintenanceTasks,
  createMaintenanceTask,
  updateMaintenanceTask,
  completeMaintenanceTask,
  getDashboardStats,
};
