# LINE LIFF Integration Guide

## การตั้งค่า LINE LIFF สำหรับ Roboss Loyalty App

### 1. สร้าง LINE Developers Account

1. ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
2. Login ด้วย LINE Account
3. สร้าง Provider ใหม่ (ถ้ายังไม่มี)

### 2. สร้าง LINE Login Channel

1. คลิก "Create a new channel"
2. เลือก "LINE Login"
3. กรอกข้อมูล:
   - Channel name: `ROBOSS Loyalty App`
   - Channel description: `ระบบสะสมแต้มและสิทธิพิเศษสำหรับลูกค้า ROBOSS`
   - App types: เลือก `Web app`

### 3. สร้าง LIFF App

1. ไปที่ Channel ที่สร้างไว้
2. ไปที่แท็บ "LIFF"
3. คลิก "Add"
4. กรอกข้อมูล:
   - LIFF app name: `ROBOSS Loyalty`
   - Size: `Full`
   - Endpoint URL: `https://your-domain.com` (หรือ `http://localhost:3000` สำหรับ development)
   - Scope: เลือก `profile` และ `openid`
   - Bot link feature: `Off` (หรือ `On` ถ้าต้องการเชื่อมกับ LINE Bot)
5. คลิก "Add"
6. คัดลอก **LIFF ID** ที่ได้

### 4. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์หลัก:

```env
VITE_LIFF_ID=your-liff-id-here
VITE_API_BASE_URL=http://localhost:3001/api
```

แทนที่ `your-liff-id-here` ด้วย LIFF ID ที่คัดลอกมา

### 5. ทดสอบ LIFF App

#### Development Mode (Local)

1. รัน Backend Server:
```bash
cd server
npm run dev
```

2. รัน Frontend:
```bash
npm run dev
```

3. เปิด LINE App บนมือถือ
4. ส่งข้อความใน LINE Chat ด้วย URL:
```
https://liff.line.me/YOUR-LIFF-ID
```

#### Production Mode

1. Deploy Frontend ไปยัง hosting service (Netlify, Vercel, etc.)
2. อัพเดท Endpoint URL ใน LIFF settings ให้เป็น production URL
3. ตั้งค่า environment variables บน hosting service
4. เปิดใช้งานผ่าน LINE App

### 6. Features ที่รองรับ

- ✅ LINE Login อัตโนมัติ
- ✅ ดึงข้อมูล Profile จาก LINE (ชื่อ, รูปโปรไฟล์)
- ✅ สร้าง Account อัตโนมัติสำหรับผู้ใช้ LINE ใหม่
- ✅ เชื่อมโยง LINE User ID กับระบบ Loyalty
- ✅ ใช้งานได้ทั้งใน LINE App และ Web Browser

### 7. API Endpoints

#### LINE Login
```
POST /api/auth/line-login
Body: {
  "lineUserId": "U1234567890abcdef",
  "displayName": "John Doe",
  "pictureUrl": "https://profile.line-scdn.net/..."
}
```

### 8. การทดสอบ

#### ทดสอบบน Web Browser (ไม่ใช่ LINE App)
- App จะแสดงหน้า Login ปกติ
- สามารถ Login ด้วย Email/Password หรือ Demo Account

#### ทดสอบบน LINE App
- App จะตรวจจับว่าอยู่ใน LINE environment
- แสดงหน้า LINE Login อัตโนมัติ
- Login ด้วย LINE Account

### 9. Troubleshooting

**ปัญหา: LIFF initialization failed**
- ตรวจสอบว่า LIFF ID ถูกต้อง
- ตรวจสอบว่า Endpoint URL ตรงกับ URL ที่เปิดใช้งาน
- ตรวจสอบว่าเปิดใน LINE App

**ปัญหา: Cannot read profile**
- ตรวจสอบว่าได้เลือก Scope `profile` ใน LIFF settings
- ตรวจสอบว่า User ได้ทำการ Login แล้ว

**ปัญหา: Backend connection failed**
- ตรวจสอบว่า Backend Server กำลังรันอยู่
- ตรวจสอบ CORS settings
- ตรวจสอบ API_BASE_URL ใน environment variables

### 10. Security Notes

- ⚠️ อย่า commit `.env.local` ไปใน Git
- ⚠️ ใช้ HTTPS สำหรับ Production
- ⚠️ เก็บ LIFF ID และ Channel Secret ไว้เป็นความลับ
- ⚠️ Validate LINE User ID ที่ Backend ก่อนสร้าง Account

### 11. Next Steps

- [ ] เพิ่ม LINE Messaging API สำหรับส่งการแจ้งเตือน
- [ ] เพิ่ม Rich Menu ใน LINE Chat
- [ ] เพิ่ม LINE Pay integration
- [ ] เพิ่ม LINE Beacon สำหรับ check-in ที่สาขา
