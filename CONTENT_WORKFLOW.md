# Quy trình nội dung public (repo → Vercel)

Site dùng **static export**: nội dung khách thấy **chỉ** đến từ **mã nguồn đã commit**, không lấy từ `localStorage`.

---

## 1. Nguồn sự thật (production)

| Kênh | File trong repo | Ghi chú |
|------|------------------|--------|
| **Tin / Cẩm nang** | `lib/defaultNewsArticles.ts` | Danh sách + chi tiết `/news`, `/news/[slug]` |
| **FAQ** | `lib/faqContent.ts` → `DEFAULT_FAQS` | Trang `/faq` + khối FAQ trên chủ |
| **Cẩm nang game** | `lib/gameGuidesContent.ts` → `DEFAULT_GAME_GUIDES` | Trang `/game-guides` |

Sau `npm run build`, các file này được **đóng gói vào bundle** → Vercel và localhost **cùng một dữ liệu** khi không bật admin.

---

## 2. Muốn thêm / sửa bài lên web public

1. Sửa đúng một trong các file bảng trên (thêm object bài, sửa `slug`, `title`, `content`…).
2. Với **tin tức**: nếu cần URL tĩnh mới, thêm slug vào `DEFAULT_NEWS_ARTICLES` — `generateStaticParams` trong `app/news/[slug]/page.tsx` lấy slug từ đó.
3. Chạy `npm run build` local để kiểm tra không lỗi.
4. **Commit + push** lên GitHub.
5. Vercel (nếu đã nối repo) **tự build và deploy** — khách thấy nội dung mới sau khi deploy xong.

---

## 3. `localStorage` và `/admin` dùng để làm gì?

- **Không** dùng để render trang **public** (khách, không `?admin=1`, chưa đăng nhập admin).
- **Có** dùng khi **admin** (`?admin=1` hoặc đã đăng nhập `/admin`) để:
  - soạn thử,
  - xuất / nhập JSON,
  - đồng bộ tạm giữa tab (chỉ ảnh hưởng máy bạn).

Muốn **lên production thật**: phải **chép nội dung vào file TS** trong repo rồi push — không chỉ lưu trong admin/localStorage.

---

## 4. Tóm tắt một dòng

**Public = Git + build. localStorage = nháp admin, không phải CMS production.**
