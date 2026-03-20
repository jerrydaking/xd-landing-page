# XOCDIA88 — Landing Page

> **Bản đồ dự án** — một landing page dark luxury cho nền tảng giải trí XOCDIA88, xây bằng **Next.js 16 + Tailwind CSS**, build ra **HTML tĩnh** (`out/`).  
> Không cần Node trên hosting: upload folder `out/` là chạy được.

---

## Bạn đang ở đâu trong dự án? 🧭

| Nếu bạn muốn… | Đi đâu |
|---|---|
| Xem / sửa giao diện trang chủ | `app/page.tsx` + các file trong `components/` (bảng dưới) |
| Sửa bài **Cẩm nang Tân Thủ** (tin, block editor) | `app/news/page.tsx`, dữ liệu: `localStorage` key `news-articles-v1` |
| Sửa **FAQ** | `app/faq/page.tsx`, key `faq-items-v1` |
| Sửa **Cẩm nang Game** (theo từng game) | `app/game-guides/page.tsx` |
| Vào bảng điều khiển admin | `app/admin/page.tsx` → link sang các kênh trên |
| Đổi SEO / title toàn site | `app/layout.tsx` + biến `NEXT_PUBLIC_SITE_URL` |
| Nhân bản nhiều site / tránh trùng SEO | Mục **“Nhân bản hàng loạt”** trong README + `DEPLOY_STATIC_GUIDE.md` |
| Đổi ảnh, video public | `public/image/` |

---

## Luồng người dùng (từ ngoài vào trong) 🛤️

```
Khách truy cập
    → Header (menu + AnnouncementTicker + MobileMenu)
    → Trang chủ: Hero → StatsBar → GameGrid → Promo → WhyChooseUs → News → FAQ → Footer
    → FloatingQuickActions (3 nút nổi phải màn hình)

Đọc nội dung dài
    → /news      (Cẩm nang: danh sách + chi tiết bài)
    → /faq       (FAQ)
    → /game-guides (bài theo từng trò chơi)

Quản trị nội dung (không backend)
    → /admin     (đăng nhập bằng env, xem bảng điều hướng)
    → /news?admin=1  |  /faq?admin=1  |  /game-guides?admin=1
    → Thêm ?edit=1 khi cần mở sẵn form sửa (một số luồng đã hỗ trợ)
```

**Lưu ý:** Dữ liệu bài viết / FAQ lưu **trong trình duyệt** (`localStorage`). Mỗi máy / mỗi domain là một bộ dữ liệu riêng; có chức năng xuất/nhập JSON và đồng bộ giữa tab (xem trong từng trang admin).

---

## Cấu trúc trang (chi tiết)

```
Trang chủ  /
├── Header            — Logo, menu desktop, nút mở MobileMenu, thanh AnnouncementTicker
├── Hero              — Banner, CTA, video/ảnh (cấu hình trong file)
├── StatsBar          — Thanh số liệu nổi bật
├── GameGrid          — 6 ô trò chơi (link sang /game-guides …)
├── PromoSection      — Khuyến mãi
├── WhyChooseUs       — Lý do chọn nền tảng
├── NewsSection       — Cẩm nang Tân Thủ (slider), đọc từ cùng nguồn với /news
├── FaqSection        — FAQ rút gọn trên chủ
└── Footer            — Liên kết & thông tin

Trang phụ (App Router)
├── /news             — Danh sách + chi tiết bài; block editor khi ?admin=1
├── /faq              — FAQ đầy đủ
├── /game-guides      — Bài theo game
└── /admin            — Hub đăng nhập + link nhanh tới các kênh quản trị

Layout toàn cục: app/layout.tsx
├── Header + FloatingQuickActions bọc ngoài {children}
└── metadata (title, description, Open Graph, metadataBase)
```

---

## Sơ đồ thư mục (file quan trọng)

```
xocdia-clone/
├── app/
│   ├── layout.tsx          # SEO mặc định, font, Header + nút nổi
│   ├── page.tsx            # Ghép các section trang chủ
│   ├── globals.css         # Tailwind / style chung
│   ├── news/page.tsx       # Cẩm nang + editor
│   ├── faq/page.tsx        # FAQ + editor
│   ├── game-guides/page.tsx
│   └── admin/page.tsx      # Đăng nhập admin + link điều hướng
├── components/
│   ├── Header.tsx          # + AnnouncementTicker, MobileMenu
│   ├── Hero.tsx, StatsBar.tsx, GameGrid.tsx
│   ├── PromoSection.tsx, WhyChooseUs.tsx
│   ├── NewsSection.tsx, FaqSection.tsx, Footer.tsx
│   ├── FloatingQuickActions.tsx
│   └── article/            # Renderer + BlockEditor (paragraph, section, list, table, note, ảnh…)
├── lib/
│   ├── articleContent.ts   # Article, slugify, format markdown, repair encoding
│   ├── articleBlocks.ts    # Kiểu block & helper
│   ├── faqContent.ts       # FAQ mặc định + key storage
│   └── adminSession.ts     # Phiên admin (localStorage), withAdminHref
├── hooks/
│   └── usePersistedAdmin.ts
├── public/image/           # ảnh game, cover bài, video intro (nếu dùng)
├── next.config.ts          # output: "export" → static site
├── package.json
└── README.md               # File này
```

**Ghi chú:** `components/StepsSection.tsx` có trong repo; nếu chưa gắn vào `app/page.tsx` thì là module dự phòng / chưa dùng trên chủ.

---

## Tính năng chính (tóm tắt)

| Tính năng | Mô tả |
|---|---|
| **6 trò chơi nổi bật** | Ảnh, mô tả, CTA; chi tiết nối `/game-guides` |
| **Cẩm nang** | Slider trên chủ + trang `/news`; block editor (section, list, bảng, ghi chú, ảnh, v.v.) |
| **FAQ** | Trang chủ (rút gọn) + `/faq` đầy đủ |
| **Cẩm nang Game** | Nội dung theo từng game |
| **3 nút nổi** | Link chính, CSKH, nhận quà — theo cuộn trang |
| **Admin** | Hub `/admin`; trên từng kênh thêm `?admin=1` để sửa/xóa/thêm (client-only) |
| **Đồng bộ / backup** | Xuất & nhập JSON (clipboard), một số luồng đồng bộ giữa cổng localhost |
| **Lưu trữ** | `localStorage` + tự sửa chuỗi bị lỗi encoding khi đọc lại |

---

## Biến môi trường (tùy chọn)

Tạo `.env.local` trong `xocdia-clone/`:

| Biến | Ý nghĩa |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL chính của site (canonical / Open Graph). Mặc định trong code có fallback domain production. |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Email đăng nhập `/admin` (nếu cấu hình) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Mật khẩu đăng nhập `/admin` (nếu cấu hình) |

Build lại sau khi đổi env: `npm run build`.

---

## Nhân bản hàng loạt (multi-site) — không trùng lặp, SEO & Page Speed 🚀

Repo này **không có “nút tự động” tạo 100 site**, nhưng **cấu trúc static export + metadata tập trung** giúp bạn **nhân bản template** ra nhiều thương hiệu/domain **an toàn SEO** nếu làm đúng checklist dưới đây.

### Mục tiêu khi nhân bản

| Mục tiêu | Ý nghĩa ngắn gọn |
|---|---|
| **Không trùng nội dung** | Mỗi domain = bộ **title, mô tả, bài viết, FAQ, slug, ảnh** riêng — tránh Google coi là duplicate / thin content |
| **Liên kết chuẩn** | Một **canonical URL** rõ (`NEXT_PUBLIC_SITE_URL`), internal link đúng domain, CTA/tele không copy y nguyết sang site khác nếu khác thương hiệu |
| **Chuẩn SEO kỹ thuật** | `metadata` trong `app/layout.tsx`, `robots.txt` + `sitemap.xml` (build từ `app/robots.ts`, `app/sitemap.ts`), `metadataBase` khớp domain thật |
| **Tối ưu trang & Page Speed** | HTML tĩnh `out/`, ảnh nén trước khi đưa vào `public/image/`, font `display: swap` (đã dùng trong layout), tránh JS thừa |

### Quy trình gợi ý (mỗi site / mỗi thương hiệu một bản)

1. **Copy cả folder project** (hoặc fork Git) → một repo/folder **một domain** — đừng dùng chung một `out/` upload lên nhiều domain với cùng nội dung.
2. Tạo **`.env.local`** với `NEXT_PUBLIC_SITE_URL=https://domain-cua-ban.com` (đúng **https**, không `/` cuối).
3. Sửa **metadata** trong `app/layout.tsx`: `title`, `description`, `openGraph.siteName` — **khác hẳn** site khác.
4. Sửa **nội dung hiển thị**: Hero, Promo, Footer, `components/*`, bài mặc định trong `app/news/page.tsx`, `lib/faqContent.ts`, `app/game-guides/page.tsx` — viết lại câu chữ, không copy-paste nguyên khối.
5. Đổi **ảnh** trong `public/image/` (tên file + alt trong code) để tránh trùng media giữa các site.
6. Trong **admin** (`/news`, `/faq`, …): xuất JSON site cũ nếu cần, nhưng **nhập sang site mới chỉ khi đã chỉnh tay** slug/title cho đủ unique.
7. Chạy `npm run build` → upload **`out/`** lên đúng hosting của domain đó.

### Checklist nhanh — tránh trùng lặp & dính SEO xấu

- [ ] Domain A và B có **title + description + đoạn giới thiệu** khác nhau rõ ràng  
- [ ] Mỗi site có **`NEXT_PUBLIC_SITE_URL`** đúng domain (ảnh hưởng OG, canonical, sitemap)  
- [ ] **Slug bài viết / FAQ** không trùng *và* nội dung đoạn đầu không y hệt giữa các site  
- [ ] **CTA / link ngoài** (Telegram, live chat, đăng ký) trỏ đúng kênh của **từng** thương hiệu  
- [ ] Sau deploy: kiểm tra `/robots.txt`, `/sitemap.xml` trên domain thật  

### Page Speed (thực tế với static export)

- Đã có: export tĩnh, **không cần Node** trên host, `next/image` với **`unoptimized`** trong `next.config.ts` (phù hợp CDN/hosting tĩnh).  
- Nên thêm: nén ảnh (WebP/JPEG chất lượng hợp lý), không nhét video nặng autoplay trên mobile nếu không cần.  
- Chi tiết build & upload: xem **`DEPLOY_STATIC_GUIDE.md`**.

### Một dòng tóm tắt

**Mỗi domain = một bản project (hoặc một nhánh build) + env + nội dung/ảnh/link viết lại; dùng chung code được, dùng chung nội dung copy-paste thì dễ trùng SEO.**

---

## Deploy

```bash
npm install          # Cài dependency
npm run dev          # Dev mặc định (thường port 3000)
npm run dev:3002     # Dev port 3002 (đã có trong package.json)
npm run build        # Sinh thư mục out/ (static export)
npm run start        # Chạy next start (thường dùng khi không export; project này ưu tiên export)
npm run lint         # ESLint
```

Mở trình duyệt: `http://localhost:3000` hoặc `http://localhost:3002` tùy script.

---

## Cách vào quản trị

1. Mở `/admin` → đăng nhập (nếu đã cấu hình env).
2. Chọn kênh: Cẩm nang (`/news?admin=1`), FAQ, Game guides.
3. Trên danh sách / chi tiết: thêm bài, sửa, xóa; dùng xuất/nhập JSON khi cần backup hoặc chuyển máy.

Người dùng chỉ vào `/news`, `/faq` **không** thấy thanh công cụ admin trừ khi có `?admin=1` hoặc phiên admin (tùy logic từng trang).

---

## Deploy

```bash
npm run build
```

- Thư mục **`out/`** chứa toàn bộ file tĩnh.
- Đưa lên **Vercel / Netlify / CDN / hosting tĩnh** bất kỳ; không bắt buộc Node.js phía server.

Script `npm run deploy` (nếu dùng) gọi `build` + `vercel --prod` — cần CLI Vercel đã login.

---

## Công nghệ

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS 4** (theme dark + gold)
- **TypeScript**
- **emoji-picker-react** (editor)
- **Static export** (`output: "export"` trong `next.config.ts`)

---

## Một dòng để nhớ ✨

**Trang chủ = ghép section trong `app/page.tsx`; nội dung động = `localStorage` + các trang `/news`, `/faq`, `/game-guides`; admin = `/admin` + `?admin=1`.**
