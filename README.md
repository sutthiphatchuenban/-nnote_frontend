# NNote - Modern Note Taking & Sharing Platform

NNote เป็นแพลตฟอร์มสำหรับการจดบันทึกและแชร์ความรู้ที่ทันสมัย ใช้เทคโนโลยี React, Node.js, PostgreSQL และ Docker

## ✨ Features

- 📝 **จดบันทึกส่วนตัว**: สร้างและจัดการบันทึกส่วนตัว
- 🌐 **แชร์สาธารณะ**: แชร์บันทึกให้ทุกคนเข้าชมได้
- 🎭 **โหมดไม่ระบุชื่อ**: เลือกแสดงหรือซ่อนชื่อผู้เขียน
- 🔐 **Google OAuth**: ระบบ authentication ที่ปลอดภัย
- 🌓 **Dark/Light Theme**: เปลี่ยนธีมตามต้องการ
- 📱 **Responsive Design**: ใช้งานได้ทุกอุปกรณ์
- 🚀 **Docker Support**: รันง่ายด้วย Docker

## 🛠 Tech Stack

### Frontend
- **React** + **TypeScript**
- **Vite** (Development Server)
- **Tailwind CSS** (Styling)
- **React Router** (Routing)
- **Lucide React** (Icons)

### Backend
- **Node.js** + **Express**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** Authentication
- **bcryptjs** Password Hashing

### DevOps
- **Docker** + **Docker Compose**
- **PostgreSQL** Container

## 🚀 Quick Start

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd nnote
\`\`\`

### 2. ใช้ Docker (แนะนำ)
\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### 3. Manual Setup (ถึงไม่ใช้ Docker)

#### Backend Setup
\`\`\`bash
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database settings

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start backend
npm run dev
\`\`\`

#### Frontend Setup
\`\`\`bash
# Install dependencies
npm install

# Start frontend
npm run dev
\`\`\`

## 📁 Project Structure

\`\`\`
nnote/
├── backend/              # Backend API
│   ├── prisma/          # Database schema & migrations
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── server.js        # Express server
├── src/                 # Frontend source
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── context/        # React contexts
│   └── services/       # API services
├── docker-compose.yml   # Docker compose config
└── README.md
\`\`\`

## 🔧 Environment Variables

### Backend (.env)
\`\`\`
DATABASE_URL="postgresql://postgres:password@localhost:5432/nnote"
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=3001
NODE_ENV=development
\`\`\`

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 🔐 OAuth Setup

### Google OAuth Configuration
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจกต์ใหม่หรือเลือกโปรเจกต์ที่มีอยู่
3. เปิดใช้งาน Google+ API
4. ไปที่ Credentials และสร้าง OAuth 2.0 Client ID
5. เพิ่ม authorized origins:
   - `http://localhost:3000` (สำหรับ development)
   - `http://localhost:5173` (สำหรับ Vite dev server)
6. คัดลอก Client ID ไปใส่ใน environment variables

### Development Mode
- แอปมี **Demo Mode** ที่ไม่ต้องใช้ Google OAuth จริง
- เหมาะสำหรับการทดสอบและพัฒนา
- สลับระหว่าง Demo Mode และ Real OAuth ได้ในหน้า Login

## 📊 Database Schema

### Users Table
- id (String, Primary Key)
- email (String, Unique)
- name (String)
- avatar (String, Optional)
- googleId (String, Optional)
- createdAt (DateTime)
- updatedAt (DateTime)

### Notes Table
- id (String, Primary Key)
- title (String)
- content (String)
- isPublic (Boolean)
- isAnonymous (Boolean)
- slug (String, Unique)
- authorId (String, Foreign Key)
- createdAt (DateTime)
- updatedAt (DateTime)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### Notes (Protected)
- `GET /api/notes` - Get user's notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/:id` - Get single note

### Public
- `GET /api/public/notes` - Get public notes
- `GET /api/public/notes/:slug` - Get public note by slug

## 🎨 Features Showcase

### Theme System
- Light/Dark/System modes
- Persistent theme selection
- Smooth transitions

### Note Management
- Rich text editing
- Public/Private visibility
- Anonymous posting option
- Unique slug generation

### Authentication
- Mock Google OAuth (for demo)
- JWT token management
- Protected routes

## 🚀 Production Deployment

### Docker Production
\`\`\`bash
# Build and run in production mode
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### Manual Deployment
\`\`\`bash
# Build frontend
npm run build

# Start backend in production
cd backend
NODE_ENV=production npm start
\`\`\`

## 🤝 Contributing

1. Fork the project
2. Create feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit changes (\`git commit -m 'Add AmazingFeature'\`)
4. Push to branch (\`git push origin feature/AmazingFeature\`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React + Vite for awesome development experience
- Tailwind CSS for beautiful styling
- Prisma for excellent database management
- Lucide React for beautiful icons