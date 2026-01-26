import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import db from './memory-db.js';
import { User, Vehicle, Transaction, Branch, WashPackage, Reward, Notification, StockItem, StockMovement } from '../types/index.js';

export async function seedDatabase() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const demoUserId = 'ROBOSS-9921';
  
  if (!db.users.has(demoUserId)) {
    const demoUser: User = {
      id: demoUserId,
      email: 'demo@roboss.com',
      password: hashedPassword,
      name: 'คุณณัฐพล ใจดี',
      phone: '0812345678',
      points: 1250,
      currentStamps: 7,
      totalStamps: 10,
      memberTier: 'Gold',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.set(demoUserId, demoUser);

    const vehicle: Vehicle = {
      id: randomUUID(),
      userId: demoUserId,
      make: 'Toyota',
      model: 'Camry',
      licensePlate: 'กข 1234',
      createdAt: new Date().toISOString()
    };
    db.vehicles.set(vehicle.id, vehicle);
  }

  if (db.branches.size === 0) {
    const branches: Branch[] = [
      {
        id: randomUUID(),
        name: 'สาขาบางนา',
        address: 'เมกาบางนา ชั้น B',
        lat: 13.6685,
        lng: 100.6433,
        status: 'Available',
        waitingCars: 2,
        image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600',
        createdAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'สาขาพระราม 9',
        address: 'ศูนย์การค้าเซ็นทรัล พระราม 9',
        lat: 13.7594,
        lng: 100.5647,
        status: 'Available',
        waitingCars: 4,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
        createdAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'สาขารังสิต',
        address: 'ฟิวเจอร์พาร์ค รังสิต',
        lat: 14.0208,
        lng: 100.5954,
        status: 'Busy',
        waitingCars: 1,
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=600',
        createdAt: new Date().toISOString()
      }
    ];

    branches.forEach(b => db.branches.set(b.id, b));
  }

  if (db.packages.size === 0) {
    const packages: WashPackage[] = [
      {
        id: randomUUID(),
        name: 'Express Shine',
        description: 'ล้างด่วน สะอาดเร็ว',
        price: 150,
        features: ['ล้างภายนอก', 'เช็ดแห้ง', 'ทำความสะอาดล้อ'],
        pointsReward: 15,
        stampsReward: 1,
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600',
        recommended: false,
        isActive: true
      },
      {
        id: randomUUID(),
        name: 'Premium Wax',
        description: 'ล้าง + เคลือบเงา',
        price: 250,
        features: ['ล้างภายนอก', 'เคลือบเงา', 'ดูแลยาง', 'ทำความสะอาดภายใน'],
        pointsReward: 25,
        stampsReward: 1,
        image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=600',
        recommended: true,
        isActive: true
      },
      {
        id: randomUUID(),
        name: 'Ultimate Care',
        description: 'บริการครบวงจร',
        price: 490,
        features: ['ล้างภายนอก', 'เคลือบสี', 'ดูแลภายใน', 'ฆ่าเชื้อโรค', 'ดูแลเครื่องยนต์'],
        pointsReward: 50,
        stampsReward: 2,
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600',
        recommended: false,
        isActive: true
      }
    ];

    packages.forEach(p => db.packages.set(p.id, p));
  }

  if (db.rewards.size === 0) {
    const rewards: Reward[] = [
      {
        id: randomUUID(),
        name: 'ล้างรถฟรี 1 ครั้ง',
        description: 'แลกล้างรถฟรี แพ็กเกจ Express Shine',
        points: 500,
        category: 'บริการ',
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=300',
        stock: 100,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'ส่วนลด 100 บาท',
        description: 'คูปองส่วนลดสำหรับบริการครั้งถัดไป',
        points: 300,
        category: 'คูปอง',
        image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&q=80&w=300',
        stock: 200,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'น้ำยาล้างรถ Premium',
        description: 'น้ำยาล้างรถคุณภาพสูง 500ml',
        points: 800,
        category: 'สินค้า',
        image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=300',
        stock: 50,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    rewards.forEach(r => db.rewards.set(r.id, r));
  }

  if (db.users.has(demoUserId)) {
    const userTransactions = Array.from(db.transactions.values()).filter(t => t.userId === demoUserId);
    
    if (userTransactions.length === 0) {
      const packagesArray = Array.from(db.packages.values());
      const branchesArray = Array.from(db.branches.values());
      
      const transactions: Transaction[] = [
        {
          id: randomUUID(),
          userId: demoUserId,
          branchId: branchesArray[0].id,
          packageId: packagesArray[1].id,
          packageName: packagesArray[1].name,
          amount: packagesArray[1].price,
          pointsEarned: packagesArray[1].pointsReward,
          stampsEarned: packagesArray[1].stampsReward,
          status: 'completed',
          paymentMethod: 'credit_card',
          createdAt: '2024-05-15T14:30:00Z'
        },
        {
          id: randomUUID(),
          userId: demoUserId,
          branchId: branchesArray[1].id,
          packageId: packagesArray[0].id,
          packageName: packagesArray[0].name,
          amount: packagesArray[0].price,
          pointsEarned: packagesArray[0].pointsReward,
          stampsEarned: packagesArray[0].stampsReward,
          status: 'completed',
          paymentMethod: 'cash',
          createdAt: '2024-05-02T09:15:00Z'
        },
        {
          id: randomUUID(),
          userId: demoUserId,
          branchId: branchesArray[0].id,
          packageId: packagesArray[0].id,
          packageName: packagesArray[0].name,
          amount: packagesArray[0].price,
          pointsEarned: packagesArray[0].pointsReward,
          stampsEarned: packagesArray[0].stampsReward,
          status: 'completed',
          paymentMethod: 'cash',
          createdAt: '2024-04-18T17:45:00Z'
        }
      ];

      transactions.forEach(t => db.transactions.set(t.id, t));
    }

    const userNotifications = Array.from(db.notifications.values()).filter(n => n.userId === demoUserId);
    
    if (userNotifications.length === 0) {
      const notifications: Notification[] = [
        {
          id: randomUUID(),
          userId: demoUserId,
          title: 'ยินดีด้วย!',
          message: 'คุณได้รับ 25 แต้มจากการใช้บริการครั้งล่าสุด',
          type: 'success',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: randomUUID(),
          userId: demoUserId,
          title: 'โปรโมชั่นพิเศษ',
          message: 'ล้างรถวันนี้ รับแต้มคูณ 2 เฉพาะสาขาบางนา',
          type: 'info',
          isRead: false,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: randomUUID(),
          userId: demoUserId,
          title: 'ระบบแจ้งเตือน',
          message: 'คุณลงทะเบียนรถคันใหม่สำเร็จแล้ว (กข 1234)',
          type: 'info',
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      notifications.forEach(n => db.notifications.set(n.id, n));
    }
  }

  // Seed Stock Items
  if (db.stockItems.size === 0) {
    const stockItems: StockItem[] = [
      {
        id: randomUUID(),
        name: 'น้ำยาล้างรถ Premium',
        category: 'chemical',
        unit: 'ลิตร',
        quantity: 150,
        minQuantity: 50,
        maxQuantity: 500,
        unitPrice: 120,
        supplier: 'บริษัท เคมีคลีน จำกัด',
        location: 'คลังสินค้าหลัก',
        lastRestockDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'แชมพูล้างรถ',
        category: 'chemical',
        unit: 'ลิตร',
        quantity: 80,
        minQuantity: 30,
        maxQuantity: 300,
        unitPrice: 85,
        supplier: 'บริษัท เคมีคลีน จำกัด',
        location: 'คลังสินค้าหลัก',
        lastRestockDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'ขี้ผึ้งเคลือบสี',
        category: 'chemical',
        unit: 'กิโลกรัม',
        quantity: 25,
        minQuantity: 20,
        maxQuantity: 100,
        unitPrice: 450,
        supplier: 'บริษัท ออโต้แคร์ จำกัด',
        location: 'คลังสินค้าหลัก',
        lastRestockDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'ผ้าไมโครไฟเบอร์',
        category: 'consumable',
        unit: 'ผืน',
        quantity: 45,
        minQuantity: 30,
        maxQuantity: 200,
        unitPrice: 35,
        supplier: 'บริษัท ซัพพลายคลีน จำกัด',
        location: 'คลังสินค้าหลัก',
        lastRestockDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'ฟองน้ำล้างรถ',
        category: 'consumable',
        unit: 'ชิ้น',
        quantity: 120,
        minQuantity: 50,
        maxQuantity: 300,
        unitPrice: 25,
        supplier: 'บริษัท ซัพพลายคลีน จำกัด',
        location: 'คลังสินค้าหลัก',
        lastRestockDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'เครื่องฉีดน้ำแรงดันสูง',
        category: 'equipment',
        unit: 'เครื่อง',
        quantity: 3,
        minQuantity: 2,
        maxQuantity: 10,
        unitPrice: 15000,
        supplier: 'บริษัท เครื่องมือโปร จำกัด',
        location: 'คลังอุปกรณ์',
        lastRestockDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'เครื่องดูดฝุ่น',
        category: 'equipment',
        unit: 'เครื่อง',
        quantity: 5,
        minQuantity: 3,
        maxQuantity: 15,
        unitPrice: 8500,
        supplier: 'บริษัท เครื่องมือโปร จำกัด',
        location: 'คลังอุปกรณ์',
        lastRestockDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'น้ำยาเคลือบกระจก',
        category: 'chemical',
        unit: 'ลิตร',
        quantity: 15,
        minQuantity: 20,
        maxQuantity: 100,
        unitPrice: 280,
        supplier: 'บริษัท ออโต้แคร์ จำกัด',
        location: 'คลังสินค้าหลัก',
        lastRestockDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'แปรงล้างล้อ',
        category: 'equipment',
        unit: 'ชิ้น',
        quantity: 18,
        minQuantity: 15,
        maxQuantity: 50,
        unitPrice: 180,
        supplier: 'บริษัท ซัพพลายคลีน จำกัด',
        location: 'คลังอุปกรณ์',
        lastRestockDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        name: 'ถุงมือยาง',
        category: 'consumable',
        unit: 'คู่',
        quantity: 200,
        minQuantity: 100,
        maxQuantity: 500,
        unitPrice: 15,
        supplier: 'บริษัท ซัพพลายคลีน จำกัด',
        location: 'คลังสินค้าหลัก',
        lastRestockDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    stockItems.forEach(item => db.stockItems.set(item.id, item));

    // Seed Stock Movements
    const stockItemsArray = Array.from(db.stockItems.values());
    const movements: StockMovement[] = [
      {
        id: randomUUID(),
        stockItemId: stockItemsArray[0].id,
        type: 'in',
        quantity: 100,
        previousQuantity: 50,
        newQuantity: 150,
        reason: 'รับสินค้าเข้าคลัง',
        userId: demoUserId,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: randomUUID(),
        stockItemId: stockItemsArray[1].id,
        type: 'out',
        quantity: 20,
        previousQuantity: 100,
        newQuantity: 80,
        reason: 'ใช้งานสาขาบางนา',
        branchId: Array.from(db.branches.values())[0]?.id,
        userId: demoUserId,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: randomUUID(),
        stockItemId: stockItemsArray[7].id,
        type: 'out',
        quantity: 5,
        previousQuantity: 20,
        newQuantity: 15,
        reason: 'ใช้งานสาขาพระราม 9',
        branchId: Array.from(db.branches.values())[1]?.id,
        userId: demoUserId,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    movements.forEach(m => db.stockMovements.set(m.id, m));
  }

  console.log('✅ In-memory database seeded successfully!');
  console.log(`   - Users: ${db.users.size}`);
  console.log(`   - Branches: ${db.branches.size}`);
  console.log(`   - Packages: ${db.packages.size}`);
  console.log(`   - Rewards: ${db.rewards.size}`);
  console.log(`   - Transactions: ${db.transactions.size}`);
  console.log(`   - Notifications: ${db.notifications.size}`);
  console.log(`   - Stock Items: ${db.stockItems.size}`);
  console.log(`   - Stock Movements: ${db.stockMovements.size}`);
}
