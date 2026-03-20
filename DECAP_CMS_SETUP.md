# Decap CMS (Git-based) + Next.js static export

Hướng dẫn triển khai **Decap CMS** trên **Netlify**, repo Git, và site Next.js (`output: "export"`).

## Cấu trúc đã có trong project

| Đường dẫn | Mô tả |
|-----------|--------|
| `app/admin/page.tsx` | **Netlify Identity** — đăng nhập / invite / recovery (Next.js, không còn form email+mật khẩu tùy chỉnh). |
| `public/cms/index.html` | **Decap CMS** (CDN) + Identity (CDN) — mở sau khi đăng nhập tại `/admin` hoặc dùng widget trên `/cms`. |
| `public/cms/config.yml` | Collection `news` → `content/news/*.md` |
| `content/news/` | Bài viết Markdown + front matter |
| `public/uploads/` | Ảnh upload từ CMS → URL `/uploads/...` |

**Lưu ý:** **`/site-admin`** = hub localStorage (FAQ / game guides) — giờ cũng **chỉ mở sau khi đăng nhập Netlify Identity** (cùng widget, không còn form env). **`/admin`** = cổng Identity; **`/cms/`** = Decap.

### Netlify Identity Widget (invite / khôi phục mật khẩu)

- **Toàn site:** `lib/netlifyIdentitySingleton.ts` + `NetlifyIdentityProvider` trong `app/layout.tsx` — một lần `init`, tự `open()` khi hash có token (mọi route, kể cả trang chủ).
- **`/admin`:** UI nút “Đăng nhập quản trị”, log debug console (tạm), sau login có link **Mở Decap CMS** → `/cms/`.
- **`/cms/`** (file tĩnh): Decap + Identity CDN (dùng khi bookmark trực tiếp `/cms/`).
- **Biến tuỳ chọn:** `NEXT_PUBLIC_NETLIFY_IDENTITY_URL` — xem `.env.example`.

---

## 1. Chuẩn bị repo Git

1. Khởi tạo Git và push lên GitHub/GitLab/Bitbucket (Netlify kết nối được).
2. Trong `public/cms/config.yml`, chỉnh **`branch`** cho khớp nhánh mặc định (ví dụ `main`).

---

## 2. Netlify: site & build

1. **New site from Git** → chọn repo này.
2. **Build command:** `npm run build`  
3. **Publish directory:** `out` (Next.js static export).
4. **Environment (tuỳ chọn):** biến site URL nếu project của bạn dùng (xem `lib/siteUrl.ts`).

---

## 3. Bật Netlify Identity + Git Gateway (bắt buộc cho Git backend)

Decap cần **Netlify Identity** và **Git Gateway** để commit file lên repo.

1. Netlify → **Identity** → **Enable Identity**.
2. **Identity → Settings → Services → Git Gateway** → **Enable Git Gateway**.
3. Mời user (hoặc bật đăng ký tuỳ chính sách) để có tài khoản đăng nhập CMS.

---

## 4. Chỉnh `config.yml` cho production

Trong `public/cms/config.yml`:

1. **Tắt** `local_backend` (xóa dòng hoặc đặt `local_backend: false`).  
   - `local_backend: true` chỉ dùng khi chạy [`decap-server`](https://decapcms.org/docs/working-with-a-local-git-repository/) trên máy dev.
2. Giữ backend:

```yaml
backend:
  name: git-gateway
  branch: main   # đúng nhánh repo
```

Sau khi sửa, commit và push — Netlify build lại.

---

## 5. Redirect `/cms` (khuyến nghị)

Thêm file **`netlify.toml`** ở root repo (nếu chưa có):

```toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/cms"
  to = "/cms/"
  status = 301
```

Giúp vào thống nhất `out/cms/index.html` (Decap).

---

## 6. Dùng CMS sau khi deploy

1. Mở **`https://<site-của-bạn>.netlify.app/admin`** — đăng nhập **Netlify Identity** (invite / recovery qua hash).
2. Bấm **Mở Decap CMS** hoặc vào **`/cms/`** — soạn **Tin tức** → Decap commit vào `content/news/`.
4. Netlify build lại → trang `/news` và `/news/[slug]` đọc markdown mới (static).

---

## 7. Dev local (tuỳ chọn)

1. Giữ `local_backend: true` trong `config.yml` **chỉ trên máy dev** (không merge lên production nếu không chủ ý).
2. Chạy Decap proxy:

```bash
npx decap-server
```

3. Chạy Next: `npm run dev` — mở `/admin` (Identity) rồi `/cms/` (Decap) nếu cần soạn local.

---

## 8. Danh sách file: tạo mới, sửa, xoá

### Tạo mới

- `public/cms/index.html` — Decap CMS (CDN)
- `public/cms/config.yml` — collection `news`
- `public/uploads/.gitkeep` — thư mục ảnh upload (URL `/uploads/...`)
- `content/news/huong-dan-nap-rut-sieu-toc.md` — bài mẫu 1
- `content/news/cach-nhan-uu-dai-thanh-vien-moi.md` — bài mẫu 2
- `lib/markdown.ts` — front matter + `marked` → HTML
- `lib/newsMarkdown.ts` — đọc `content/news/*.md` lúc build
- `app/site-admin/layout.tsx` — metadata hub local
- `app/site-admin/page.tsx` — hub `/site-admin` (localStorage + link Decap)
- `DECAP_CMS_SETUP.md` — tài liệu này

### Sửa

- `package.json` — thêm `gray-matter`, `marked`
- `lib/defaultNewsArticles.ts` — chỉ còn `NewsPostCard` + `articlesToNewsPostCards`
- `lib/newsLinks.ts` — `hrefNewsArticle` nhận `bundledSlugs` tuỳ chọn
- `components/article/ArticleRenderer.tsx` — chuỗi nội dung dùng `markdownToHtml`
- `components/news/NewsContent.tsx` — prop `repoArticles`, slug bundle cho link
- `components/NewsSection.tsx` — prop bắt buộc `posts`
- `app/page.tsx` — `getNewsPostCards()` → `NewsSection`
- `app/news/page.tsx` — server: `getAllNewsArticles()` → `NewsContent`
- `app/news/[slug]/page.tsx` — `generateStaticParams` từ `getNewsSlugs()`
- `app/sitemap.ts` — tin tức từ `getAllNewsArticles()`
- `app/robots.ts` — `disallow` `/admin`, `/site-admin`, `/cms`, …

### Netlify Identity + `/admin` (App Router)

**Tạo / sửa**

- `app/admin/page.tsx`, `app/admin/layout.tsx` — cổng Netlify Identity (không form env).
- `lib/netlifyIdentitySingleton.ts` — init một lần + mở widget theo hash.
- `components/NetlifyIdentityProvider.tsx` — gọi singleton + `attachIdentityHashAutoOpen`.
- `public/cms/index.html` — Decap + Identity CDN (bookmark `/cms/`).
- `lib/netlifyIdentityApiUrl.ts`, `types/netlify-identity-widget.d.ts`
- `package.json` — `netlify-identity-widget`
- `.env.example` — `NEXT_PUBLIC_NETLIFY_IDENTITY_URL` (tuỳ chọn)

### Xoá / đổi route

- **`public/admin/*`** — đã chuyển Decap sang **`public/cms/`** để Next.js dùng **`/admin`** (trang Identity).
- Hub localStorage: **`/site-admin`** — không còn form email/mật khẩu env.

---

## 9. Khắc phục nhanh

| Hiện tượng | Gợi ý |
|------------|--------|
| CMS không đăng nhập được | Bật Identity + Git Gateway; user đã được mời |
| Không commit được file | Kiểm tra quyền repo; branch trong `config.yml` đúng |
| `/admin` 404 | Kiểm tra `out/admin.html` (Next). Decap nằm tại `out/cms/index.html` |
| Bài mới không hiện | Cần **build lại** sau khi Git có file mới trong `content/news/` |

---

Chúc bạn triển khai suôn sàn.
