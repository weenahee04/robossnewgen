# Roboss Loyalty App - Backend API

Backend API server for Roboss Car Wash Loyalty Application.

## Features

- 🔐 JWT Authentication
- 👤 User Management
- 🚗 Vehicle Registration
- 💰 Points & Stamps System
- 🎁 Rewards & Redemption
- 📱 QR Code Generation & Scanning
- 📊 Admin Dashboard
- 🏢 Branch Management
- 📦 Wash Package Management
- 📜 Transaction History
- 🔔 Notifications

## Tech Stack

- Node.js + Express
- TypeScript
- SQLite (better-sqlite3)
- JWT Authentication
- bcryptjs for password hashing
- QRCode generation

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```env
PORT=3001
JWT_SECRET=your-secret-key
NODE_ENV=development
DATABASE_PATH=./database.sqlite
```

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/demo-login` - Demo login (no password required)

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Vehicles
- `GET /api/vehicles` - Get user vehicles
- `POST /api/vehicles` - Add new vehicle
- `DELETE /api/vehicles/:id` - Remove vehicle

### Transactions
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get transaction details

### Branches
- `GET /api/branches` - Get all branches (with optional location sorting)
- `GET /api/branches/:id` - Get branch details

### Packages
- `GET /api/packages` - Get all wash packages
- `GET /api/packages/:id` - Get package details

### Rewards
- `GET /api/rewards` - Get all rewards
- `POST /api/rewards/redeem` - Redeem reward
- `GET /api/rewards/redemptions` - Get redemption history

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### QR Code
- `POST /api/qr/generate` - Generate QR code for user
- `POST /api/qr/scan` - Scan and validate QR code

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users (with filters)
- `GET /api/admin/analytics` - Get analytics data

## Database

The database is automatically created and seeded with demo data on first run.

### Demo Account
- Email: `demo@roboss.com`
- Password: `password123`
- User ID: `ROBOSS-9921`

## License

MIT
