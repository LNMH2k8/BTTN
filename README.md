# Modern Quiz Platform 🚀

Trang web thi trắc nghiệm hiện đại với giao diện Dark Mode, hiệu ứng Blur và hệ thống quản lý bài tập thời gian thực.

## ✨ Tính năng
- **Đăng nhập/Đăng ký**: Phân quyền Admin và Thí sinh.
- **Admin**: Tạo bài tập (12 câu hoặc 18 câu), quản lý danh mục, xem danh sách thí sinh.
- **Thí sinh**: Tìm phòng bằng ID, làm bài tính giờ, xem bảng xếp hạng thời gian thực.
- **Lưu trữ**: Toàn bộ dữ liệu (người dùng, bài tập, điểm số) được lưu trên **Supabase**.

## 🛠️ Hướng dẫn cài đặt

### 1. Thiết lập Database (BẮT BUỘC)
Dự án này sử dụng Supabase. Bạn cần tạo các bảng dữ liệu bằng cách:
1. Truy cập [Supabase Dashboard](https://supabase.com/).
2. Chọn dự án của bạn -> **SQL Editor**.
3. Bấm **New Query** và dán đoạn mã SQL sau:

```sql
-- Tạo bảng Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user'
);

-- Tạo bảng Danh mục
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Tạo bảng Bài tập
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id),
  type TEXT NOT NULL,
  time_limit INTEGER NOT NULL,
  created_at BIGINT NOT NULL,
  mc_answers JSONB,
  tf_answers JSONB,
  short_answers JSONB
);

-- Tạo bảng Bài làm
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT REFERENCES quizzes(id),
  user_id TEXT,
  username TEXT,
  score FLOAT NOT NULL,
  timestamp BIGINT NOT NULL,
  answers JSONB
);

-- Thêm danh mục mặc định
INSERT INTO categories (id, name) VALUES ('math', 'TOÁN HỌC'), ('physics', 'VẬT LÝ') ON CONFLICT DO NOTHING;
```
4. Nhấn **RUN**.

### 2. Chạy ứng dụng trên máy
- Cài đặt [Node.js](https://nodejs.org/).
- Mở terminal tại thư mục này và chạy:
  ```bash
  npx vite
  ```
- Mở trình duyệt tại: `http://localhost:5173`

## 🚀 Triển khai lên GitHub & Vercel
1. Upload code lên GitHub.
2. Truy cập [Vercel](https://vercel.com/), chọn **Add New Project**.
3. Import từ GitHub và nhấn **Deploy**.

---
*Phát triển bởi Gemini - Senior Frontend Engineer.*
