# Lưu nội dung "Lý do chọn" lên web (Supabase)

Để nút **Lưu lên web** hoạt động, cấu hình Supabase một lần (miễn phí).

## Cách nhanh

```bash
npm run setup:supabase
```

Script sẽ tạo `.env.local` nếu chưa có. Sau đó làm 3 bước dưới.

---

## 1. Tạo project Supabase

1. Vào [supabase.com](https://supabase.com) → **Sign in** (hoặc đăng ký) → **New project**.
2. Điền tên, mật khẩu DB, chọn region → **Create** (đợi vài phút).

## 2. Chạy SQL (tạo bảng)

1. Trong Supabase: **SQL Editor** → **New query**.
2. Mở file **`supabase-setup.sql`** trong project, copy toàn bộ nội dung.
3. Dán vào SQL Editor → **Run**. Thấy "Success" là xong.

## 3. Thêm URL và key vào project

1. Supabase: **Project Settings** (icon bánh răng) → **API**.
2. Copy **Project URL** và **anon public** (key).
3. Mở **`.env.local`** trong thư mục `xocdia-clone`, sửa hai dòng:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Chạy lại: `npm run dev`. Vào trang → **Chỉnh sửa 4 ô** → sửa → **Lưu lên web**. Xong.

## 4. (Tùy chọn) Bảng bài viết tin tức

Để dùng **Tin tức**: link "Xem thêm" sang bài chi tiết và nút **Viết bài viết** trên trang `/news`, chạy thêm file **`supabase-articles.sql`** trong SQL Editor (1 lần).
