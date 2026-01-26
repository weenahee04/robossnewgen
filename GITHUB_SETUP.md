# 🚀 การอัพโหลดโปรเจคขึ้น GitHub

## ขั้นตอนที่ 1: สร้าง GitHub Repository

1. เข้าไปที่ [GitHub](https://github.com)
2. Login ด้วย Account ของคุณ
3. คลิก **"New repository"** (ปุ่มสีเขียวด้านบนขวา)
4. กรอกข้อมูล Repository:
   - **Repository name**: `roboss-loyalty-app`
   - **Description**: `Roboss Car Wash Loyalty App with LINE LIFF Integration`
   - **Visibility**: เลือก **Public** (หรือ Private ถ้าต้องการ)
   - ❌ ไม่ติ๊ก **"Add a README file"** (มีอยู่แล้ว)
   - ❌ ไม่ติ๊ก **"Add .gitignore"** (มีอยู่แล้ว)
   - ❌ ไม่ติ๊ก **"Choose a license"** (เพิ่มทีหลังได้)
5. คลิก **"Create repository"**

## ขั้นตอนที่ 2: อัพโหลดโปรเจค

### วิธีที่ 1: ใช้ HTTPS (แนะนำ)

หลังจากสร้าง Repository แล้ว คัดลอกคำสั่งที่ GitHub แสดง แล้วรันใน Terminal:

```bash
# แทนที่ YOUR_USERNAME ด้วย GitHub username ของคุณ
git remote add origin https://github.com/YOUR_USERNAME/roboss-loyalty-app.git
git push -u origin main
```

### วิธีที่ 2: ใช้ SSH (ถ้ามี SSH Key แล้ว)

```bash
git remote add origin git@github.com:YOUR_USERNAME/roboss-loyalty-app.git
git push -u origin main
```

## ขั้นตอนที่ 3: ตรวจสอบการอัพโหลด

1. กลับไปที่ GitHub Repository ของคุณ
2. คุณจะเห็นไฟล์ทั้งหมดถูกอัพโหลดแล้ว
3. ตรวจสอบว่ามีไฟล์สำคัญ:
   - ✅ `README.md`
   - ✅ `LINE_LIFF_SETUP.md`
   - ✅ `LIFF_IMPLEMENTATION_SUMMARY.md`
   - ✅ `package.json` (ทั้ง frontend และ server)
   - ✅ โฟลเดอร์ `admin-dashboard`
   - ✅ โฟลเดอร์ `server`

## ขั้นตอนที่ 4: ตั้งค่า GitHub Pages (Optional)

ถ้าต้องการ Deploy Frontend ผ่าน GitHub Pages:

1. ใน GitHub Repository คลิก **"Settings"**
2. ไปที่ **"Pages"** (ด้านซ้าย)
3. **Source**: เลือก **"Deploy from a branch"**
4. **Branch**: เลือก `main`
5. **Folder**: เลือก `/root`
6. คลิก **"Save"**
7. รอสักครู่ และเว็บจะพร้อมใช้งานที่: `https://YOUR_USERNAME.github.io/roboss-loyalty-app`

## ขั้นตอนที่ 5: ตั้งค่า Environment Variables สำหรับ Production

### สำหรับ GitHub Pages

สร้างไฟล์ `.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_LIFF_ID=your-production-liff-id
```

### สำหรับ Backend Deployment

ถ้าจะ Deploy Backend ด้วย (Heroku, Vercel, Railway):
1. คัดลอกไฟล์ `server/.env.example` เป็น `server/.env`
2. ตั้งค่า Environment Variables บน hosting platform

## 📋 คำสั่ง Git ที่ใช้บ่อย

```bash
# ดูสถานะ
git status

# ดู commit history
git log --oneline

# ดู remote repositories
git remote -v

# เพิ่มไฟล์ใหม่
git add .

# Commit การเปลี่ยนแปลง
git commit -m "Your commit message"

# อัพโหลดไป GitHub
git push origin main

# ดึงการเปลี่ยนแปลงจาก GitHub
git pull origin main
```

## 🔧 แก้ไขปัญหาที่พบบ่อย

**ปัญหา: "Authentication failed"**
- ตรวจสอบว่าใช้ GitHub username ที่ถูกต้อง
- ถ้าใช้ HTTPS อาจต้องใช้ GitHub Personal Access Token
- หรือใช้ SSH key แทน

**ปัญหา: "Permission denied"**
- ตรวจสอบว่า Repository เป็น Public หรือมีสิทธิ์เข้าถึง
- ถ้าเป็น Private ต้องเพิ่ม Collaborator หรือใช้ Personal Access Token

**ปัญหา: "Remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/roboss-loyalty-app.git
```

## 🎯 ถัดไป

หลังจากอัพโหลดขึ้น GitHub แล้ว:

1. **เขียน README ให้ดีขึ้น** - เพิ่ม screenshots, demo video
2. **เพิ่ม License** - MIT License เป็นที่นิยม
3. **สร้าง GitHub Actions** - สำหรับ CI/CD
4. **เพิ่ม Issues Template** - สำหรับรับ feedback
5. **เพิ่ม Contributing Guidelines** - ถ้าต้องการให้คนอื่น contribute

## 📞 ติดต่อ

ถ้ามีปัญหาในการอัพโหลด:
- ตรวจสอบ GitHub username และ repository name
- ตรวจสอบ internet connection
- ลองใช้ SSH key แทน HTTPS
- ตรวจสอบว่ามีสิทธิ์เข้าถึง repository

---

🎉 **เมื่ออัพโหลดเสร็จแล้ว คุณจะมีโปรเจค Roboss Loyalty App บน GitHub พร้อมให้ทีมอื่นๆ ดูและ contribute ได้!**
