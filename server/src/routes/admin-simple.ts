import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db, { findTransactions, findUsers } from '../database/memory-db.js';

const router = Router();

// Dashboard Overview
router.get('/dashboard', authenticateToken, (req: AuthRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // รายรับวันนี้
    const todayTransactions = findTransactions(t => 
      t.status === 'completed' && 
      new Date(t.createdAt) >= today
    );
    const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.amount, 0);

    // ผู้ใช้ใหม่วันนี้
    const newUsersToday = findUsers(u => new Date(u.createdAt) >= today).length;

    // สถิติทั้งหมด
    const totalUsers = db.users.size;
    const activeBranches = Array.from(db.branches.values()).filter(b => b.status !== 'Closed').length;
    const totalBranches = db.branches.size;

    // รายการล่าสุด
    const recentTransactions = findTransactions(t => t.status === 'completed')
      .slice(0, 10)
      .map(t => {
        const user = db.users.get(t.userId);
        const branch = db.branches.get(t.branchId);
        return {
          ...t,
          userName: user?.name || 'Unknown',
          branchName: branch?.name || 'Unknown'
        };
      });

    // สถิติแต่ละสาขา
    const branchStats = Array.from(db.branches.values()).map(branch => {
      const branchTransactions = findTransactions(t => 
        t.branchId === branch.id && 
        t.status === 'completed' &&
        new Date(t.createdAt) >= today
      );
      const revenue = branchTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        id: branch.id,
        name: branch.name,
        status: branch.status,
        waitingCars: branch.waitingCars,
        revenue,
        transactionCount: branchTransactions.length
      };
    }).sort((a, b) => b.revenue - a.revenue);

    res.json({
      stats: {
        todayRevenue,
        newUsersToday,
        totalUsers,
        activeBranches,
        totalBranches
      },
      recentTransactions,
      branchStats
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// รายงานรายรับรายจ่าย
router.get('/financial-report', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;

    let start = startDate ? new Date(startDate as string) : new Date();
    let end = endDate ? new Date(endDate as string) : new Date();

    // ถ้าไม่ระบุวันที่ ให้ดู 7 วันย้อนหลัง
    if (!startDate) {
      start.setDate(start.getDate() - 7);
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // ดึงรายการทั้งหมดในช่วงเวลา
    const transactions = findTransactions(t => {
      const txDate = new Date(t.createdAt);
      return t.status === 'completed' && txDate >= start && txDate <= end;
    });

    // คำนวณรายรับ
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalTransactions = transactions.length;

    // รายรับแยกตามวัน
    const revenueByDay = new Map<string, { date: string; revenue: number; transactions: number }>();
    
    transactions.forEach(t => {
      const date = new Date(t.createdAt);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!revenueByDay.has(dateKey)) {
        revenueByDay.set(dateKey, {
          date: dateKey,
          revenue: 0,
          transactions: 0
        });
      }
      
      const dayData = revenueByDay.get(dateKey)!;
      dayData.revenue += t.amount;
      dayData.transactions += 1;
    });

    // รายรับแยกตามแพ็กเกจ
    const revenueByPackage = new Map<string, { packageName: string; revenue: number; count: number }>();
    
    transactions.forEach(t => {
      if (!revenueByPackage.has(t.packageName)) {
        revenueByPackage.set(t.packageName, {
          packageName: t.packageName,
          revenue: 0,
          count: 0
        });
      }
      
      const pkgData = revenueByPackage.get(t.packageName)!;
      pkgData.revenue += t.amount;
      pkgData.count += 1;
    });

    // รายรับแยกตามสาขา
    const revenueByBranch = new Map<string, { branchId: string; branchName: string; revenue: number; count: number }>();
    
    transactions.forEach(t => {
      const branch = db.branches.get(t.branchId);
      const branchName = branch?.name || 'Unknown';
      
      if (!revenueByBranch.has(t.branchId)) {
        revenueByBranch.set(t.branchId, {
          branchId: t.branchId,
          branchName,
          revenue: 0,
          count: 0
        });
      }
      
      const branchData = revenueByBranch.get(t.branchId)!;
      branchData.revenue += t.amount;
      branchData.count += 1;
    });

    // คำนวณรายจ่าย (จากการแลกรางวัล)
    const redemptions = Array.from(db.redemptions.values()).filter(r => {
      const rDate = new Date(r.createdAt);
      return rDate >= start && rDate <= end;
    });

    const totalExpenses = redemptions.reduce((sum, r) => sum + r.pointsUsed, 0);
    const totalRedemptions = redemptions.length;

    // รายจ่ายแยกตามประเภทรางวัล
    const expensesByCategory = new Map<string, { category: string; points: number; count: number }>();
    
    redemptions.forEach(r => {
      const reward = db.rewards.get(r.rewardId);
      const category = reward?.category || 'อื่นๆ';
      
      if (!expensesByCategory.has(category)) {
        expensesByCategory.set(category, {
          category,
          points: 0,
          count: 0
        });
      }
      
      const catData = expensesByCategory.get(category)!;
      catData.points += r.pointsUsed;
      catData.count += 1;
    });

    // กำไรสุทธิ (รายรับ - มูลค่ารางวัลที่แลก)
    // สมมติว่า 1 แต้ม = 1 บาท
    const netProfit = totalRevenue - totalExpenses;

    res.json({
      summary: {
        period: {
          start: start.toISOString(),
          end: end.toISOString()
        },
        revenue: {
          total: totalRevenue,
          transactions: totalTransactions,
          average: totalTransactions > 0 ? totalRevenue / totalTransactions : 0
        },
        expenses: {
          total: totalExpenses,
          redemptions: totalRedemptions,
          average: totalRedemptions > 0 ? totalExpenses / totalRedemptions : 0
        },
        netProfit
      },
      revenueByDay: Array.from(revenueByDay.values()).sort((a, b) => a.date.localeCompare(b.date)),
      revenueByPackage: Array.from(revenueByPackage.values()).sort((a, b) => b.revenue - a.revenue),
      revenueByBranch: Array.from(revenueByBranch.values()).sort((a, b) => b.revenue - a.revenue),
      expensesByCategory: Array.from(expensesByCategory.values()).sort((a, b) => b.points - a.points)
    });
  } catch (error) {
    console.error('Get financial report error:', error);
    res.status(500).json({ error: 'Failed to get financial report' });
  }
});

// สถิติผู้ใช้
router.get('/users', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { search, tier, limit = 50, offset = 0 } = req.query;
    
    let users = findUsers(() => true);

    if (search) {
      const searchTerm = (search as string).toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm) ||
        u.id.toLowerCase().includes(searchTerm)
      );
    }

    if (tier) {
      users = users.filter(u => u.memberTier === tier);
    }

    const start = Number(offset);
    const end = start + Number(limit);
    const paginatedUsers = users.slice(start, end);

    const usersWithoutPassword = paginatedUsers.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    res.json({
      total: users.length,
      users: usersWithoutPassword
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Analytics
router.get('/analytics', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { days = 7 } = req.query;
    const daysNum = Number(days);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    startDate.setHours(0, 0, 0, 0);

    // รายรับแยกตามวัน
    const revenueByDay = new Map<string, { date: string; revenue: number; transactions: number }>();
    
    for (let i = 0; i < daysNum; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      revenueByDay.set(dateKey, {
        date: dateKey,
        revenue: 0,
        transactions: 0
      });
    }

    const transactions = findTransactions(t => 
      t.status === 'completed' && 
      new Date(t.createdAt) >= startDate
    );

    transactions.forEach(t => {
      const date = new Date(t.createdAt);
      const dateKey = date.toISOString().split('T')[0];
      
      if (revenueByDay.has(dateKey)) {
        const dayData = revenueByDay.get(dateKey)!;
        dayData.revenue += t.amount;
        dayData.transactions += 1;
      }
    });

    // แพ็กเกจยอดนิยม
    const packageStats = new Map<string, { packageName: string; count: number; revenue: number }>();
    
    transactions.forEach(t => {
      if (!packageStats.has(t.packageName)) {
        packageStats.set(t.packageName, {
          packageName: t.packageName,
          count: 0,
          revenue: 0
        });
      }
      
      const pkgData = packageStats.get(t.packageName)!;
      pkgData.count += 1;
      pkgData.revenue += t.amount;
    });

    // การกระจายระดับสมาชิก
    const memberTierDistribution = new Map<string, number>();
    memberTierDistribution.set('Silver', 0);
    memberTierDistribution.set('Gold', 0);
    memberTierDistribution.set('Platinum', 0);

    Array.from(db.users.values()).forEach(u => {
      memberTierDistribution.set(u.memberTier, (memberTierDistribution.get(u.memberTier) || 0) + 1);
    });

    res.json({
      revenueByDay: Array.from(revenueByDay.values()),
      topPackages: Array.from(packageStats.values()).sort((a, b) => b.count - a.count).slice(0, 5),
      memberTierDistribution: Array.from(memberTierDistribution.entries()).map(([tier, count]) => ({
        memberTier: tier,
        count
      }))
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

export default router;
