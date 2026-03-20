create table if not exists public.site_features (
  id int primary key default 1,
  data jsonb not null default '[]'
);

alter table public.site_features enable row level security;

drop policy if exists "Allow read and update" on public.site_features;
create policy "Allow read and update"
  on public.site_features for all
  using (true)
  with check (true);

insert into public.site_features (id, data) values (
  1,
  '[
    {"title":"Tối ưu hiển thị mobile","desc":"Giao diện responsive, trải nghiệm mượt trên mọi thiết bị.","icon":"1"},
    {"title":"Giao diện sang hơn web gốc","desc":"Thiết kế premium, màu vàng gold và bố cục chuyên nghiệp.","icon":"2"},
    {"title":"Dễ chỉnh sửa bằng Cursor","desc":"Code gọn, component tách rõ, dễ thay nội dung và style.","icon":"3"},
    {"title":"Dễ nâng cấp lên site thật","desc":"Cấu trúc Next.js + Tailwind sẵn sàng tích hợp API và deploy.","icon":"4"}
  ]'::jsonb
)
on conflict (id) do nothing;
