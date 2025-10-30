Favorite Movies & TV Shows Web App
A simple full-stack web app to manage your favorite movies and TV shows. Users can add, edit,
delete, and view entries with authentication.
---
Tech Stack
Frontend: React + Vite + TypeScript + Tailwind + ShadCN UI
Backend: Node.js + Express + Prisma + MySQL
Hosting: Frontend (Vercel), Backend (Render)
---
Setup Instructions

Backend Setup:
1. cd server
2. npm install
3. Create .env file with:
DATABASE_URL="your_mysql_url"
JWT_SECRET="your_secret"
4. npx prisma migrate dev
5. npm run dev

Frontend Setup:
1. cd frontend
2. npm install
3. Create .env file with:
VITE_API_URL="https://your-backend-url.onrender.com"
4. npm run dev

---
Features
- Add, edit, delete movies/TV shows
- Infinite scroll for media list
- JWT-based login/signup
- Responsive design
- Protected routes
---
API Routes
Auth:
POST /auth/signup
POST /auth/login

Media:
POST /media
GET /media (paginated)
PUT /media/:id
DELETE /media/:id

Frontend: https://xcode-assignment-4clc.vercel.app
Backend: https://xcode-assignment.onrender.com
