# React + Express + MongoDB Starter

## Cấu trúc

- `client`: React + Vite
- `server`: Express + MongoDB/Mongoose
- Root `package.json`: chạy đồng thời frontend và backend

## Chuẩn bị

1. Cài Node.js.
2. Cài và chạy MongoDB local, hoặc dùng MongoDB Atlas.
3. Tạo file môi trường:

```bash
copy client\.env.example client\.env
copy server\.env.example server\.env
```

Trên macOS/Linux:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

## Cài thư viện

Tại thư mục root:

```bash
npm install
npm run install:all
```

## Chạy dự án

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:9999
- API kiểm tra: http://localhost:9999/api/health
