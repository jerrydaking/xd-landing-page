# Triển khai (deploy)

## 1. Supabase (bảng cho "Lưu lên web")

**Cách A – Supabase Dashboard (nhanh):**

1. [supabase.com](https://supabase.com) → New project.
2. **SQL Editor** → New query → copy toàn bộ file **`supabase-setup.sql`** → Run.
3. **Project Settings** → **API** → copy **Project URL** và **anon key** vào **`.env.local`**:
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

**Cách B – Supabase CLI (đã có migration trong repo):**

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npm run db:push
```

(Lấy `project-ref` từ Supabase: Project Settings → General → Reference ID.)

---

## 2. Deploy web (Vercel)

```bash
npx vercel
```

Lần đầu: đăng nhập Vercel (browser), chọn project. Sau đó:

- Thêm **Environment Variables** trong Vercel Dashboard → Project → Settings → Environment Variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy lại hoặc chạy: `npx vercel --prod`

**Hoặc:** Đẩy code lên GitHub → [vercel.com](https://vercel.com) → Import project → thêm 2 biến env trên → Deploy.

---

Sau khi xong: web chạy trên Vercel, chỉnh 4 ô → **Lưu lên web** → nội dung lưu trên Supabase, mọi người vào đều thấy.
