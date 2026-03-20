const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const envLocal = path.join(root, ".env.local");
const envExample = path.join(root, ".env.example");
const sqlFile = path.join(root, "supabase-setup.sql");

if (!fs.existsSync(envLocal) && fs.existsSync(envExample)) {
  fs.copyFileSync(envExample, envLocal);
  console.log("Đã tạo .env.local từ .env.example. Giờ sửa .env.local, thêm SUPABASE URL và ANON KEY.");
} else if (fs.existsSync(envLocal)) {
  console.log("Đã có .env.local.");
} else {
  console.log("Chưa có .env.example. Tạo .env.local và thêm NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}

console.log("\n--- Chạy SQL trong Supabase (1 lần) ---");
console.log("1. Mở https://supabase.com/dashboard → chọn project → SQL Editor → New query");
console.log("2. Mở file này trong editor, copy toàn bộ nội dung:");
console.log("   " + sqlFile);
console.log("3. Dán vào SQL Editor → Run");
console.log("4. Vào Project Settings → API → copy Project URL và anon key vào .env.local");
console.log("5. Chạy: npm run dev");
console.log("");

if (fs.existsSync(sqlFile)) {
  const sql = fs.readFileSync(sqlFile, "utf8");
  console.log("(Nội dung SQL có " + sql.length + " ký tự, đã sẵn sàng copy.)");
}
