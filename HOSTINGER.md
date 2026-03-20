# Tích hợp Hostinger & triển khai

## Domain đang dùng (chỉ 1 trong 3)

- **xocdia88club.sbs** ← đang dùng trong project
- xocdia88club.store
- xocdia88club.space

Đổi domain: sửa `NEXT_PUBLIC_SITE_URL` trong `.env.local` (copy từ `.env.example`), build lại rồi upload lại.

---

## Đã build sẵn (static export)

Project đã cấu hình `output: "export"` trong `next.config.ts`. Sau khi chạy `npm run build`, toàn bộ site nằm trong thư mục **`out`**.

---

## Cách triển khai lên Hostinger

### Bước 1: Upload thư mục `out`

1. Đăng nhập **Hostinger** → **hPanel** → **File Manager** (hoặc dùng FTP).
2. Vào thư mục gốc của domain (vd: `public_html` cho xocdia88club.sbs).
3. **Xóa sạch** nội dung trong đó (nếu là site mới thì bỏ qua).
4. Upload **toàn bộ nội dung bên trong** thư mục `out` (không upload cả thư mục tên "out"):
   - `index.html` (trang chủ)
   - `404.html`
   - thư mục `_next/`
   - thư mục `image/` (logo, hero, intro.mp4)
   - các file .svg, favicon nếu có

**Lưu ý:** Trong `out` phải có file `index.html` ngang hàng với thư mục `_next` và `image`. Cấu trúc đúng khi mở domain:

```
public_html/
  index.html
  _next/
  image/
     logo.jpg
     hero.jpg
     intro.mp4
```

### Bước 2: Trỏ domain

Trong Hostinger, trỏ **1** trong 3 domain (xocdia88club.sbs / .store / .space) về thư mục vừa upload. Chỉ cần 1 domain chính.

### Bước 3: Kiểm tra

Mở https://xocdia88club.sbs (hoặc domain bạn chọn). Trang chủ, video, ảnh và link phải hoạt động bình thường.

---

## Build lại sau khi sửa code

```bash
cd xocdia-clone
npm run build
```

Sau đó upload lại **toàn bộ nội dung** trong `out` lên Hostinger (ghi đè file cũ).

---

## Cấu hình MCP Hostinger trong Cursor (tùy chọn)

1. **Cursor** → **Settings** → **MCP**.
2. Thêm server **hostinger-mcp** với API token của bạn (không lưu token vào file trong repo).
3. Nếu MCP hỗ trợ deploy, có thể dùng để đẩy code lên Hostinger thay vì upload tay.
