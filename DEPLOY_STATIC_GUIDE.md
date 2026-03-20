# Hướng dẫn deploy static (HTML trong `out/`)

Dự án dùng **Next.js `output: "export"`** — sau khi build, toàn bộ file tĩnh nằm trong thư mục **`out/`**. Bạn có thể upload `out/` lên bất kỳ hosting chỉ phục vụ file tĩnh (không cần Node.js trên server).

---

## 1. Chuẩn bị

- **Node.js** (khuyến nghị LTS) và **npm** đã cài.
- Trong thư mục project (`xocdia-clone`), chạy một lần:

```bash
npm install
```

---

## 2. Domain / URL site (SEO)

Tạo file **`.env.local`** (ở root project, cùng cấp `package.json`):

```env
NEXT_PUBLIC_SITE_URL=https://ten-mien-cua-ban.com
```

- Dùng **https** và **không** thêm dấu `/` ở cuối (ví dụ đúng: `https://example.com`).
- Biến này dùng cho metadata, Open Graph, `sitemap.xml`, `robots.txt` lúc build.

Nếu không đặt, build vẫn chạy và dùng URL mặc định trong code (`lib/siteUrl.ts`).

---

## 3. Build ra thư mục `out/`

```bash
npm run build
```

Hoặc (tương đương):

```bash
npm run build:static
```

Khi thành công, Next.js tạo folder **`out/`** chứa HTML, JS, CSS, ảnh public, `robots.txt`, `sitemap.xml`, v.v.

---

## 4. Upload lên hosting

1. Mở folder **`out/`** sau khi build.
2. Upload **toàn bộ nội dung** bên trong `out/` lên **thư mục gốc web** (thường là `public_html`, `www`, hoặc `htdocs` — tùy nhà cung cấp).
3. Đảm bảo server trả file **`index.html`** khi truy cập `/` (hầu hết hosting tĩnh mặc định như vậy).

**Lưu ý:** Không cần cài Node.js trên hosting — chỉ cần máy chủ phục vụ file tĩnh (Apache, Nginx, CDN, GitHub Pages với adapter phù hợp, v.v.).

---

## 5. Kiểm tra nhanh trên máy (tùy chọn)

Sau build, có thể dùng bất kỳ server tĩnh nào, ví dụ:

```bash
npx serve out
```

Rồi mở trình duyệt tại địa chỉ hiển thị (thường `http://localhost:3000`) để xem giống production.

---

## 6. Trang `/admin` và dữ liệu `localStorage`

- Trang admin và nội dung chỉnh sửa (tin, FAQ) lưu **trên trình duyệt** (`localStorage`), không có backend trên server.
- Deploy static **không ảnh hưởng** logic đó; mỗi người dùng vẫn có dữ liệu riêng trên máy họ.

---

## 7. Không tương thích với static export (đã tránh trong project này)

Các tính năng sau **không** dùng được với `output: "export"`:

- API Routes (`app/api/.../route.ts`)
- Middleware Edge
- Server Actions cần server lúc chạy
- `next/image` với tối ưu ảnh phía server (project đã bật `images.unoptimized: true` trong `next.config.ts`)

Project hiện tại chỉ dùng trang và metadata tĩnh + component client, phù hợp export HTML.

---

## Tóm tắt lệnh

| Mục đích        | Lệnh              |
|----------------|-------------------|
| Cài dependency | `npm install`     |
| Build static   | `npm run build`   |
| Kết quả        | Thư mục **`out/`** |

Chúc deploy thuận lợi.
