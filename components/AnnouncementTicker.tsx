"use client";

import { useState } from "react";

/**
 * Danh sách thông báo ticker — sửa tại đây khi cần đổi nội dung.
 * Mỗi phần tử là một câu hiển thị lần lượt, chạy từ phải sang trái.
 */
export const ANNOUNCEMENTS = [
  "Ưu đãi hôm nay: Thành viên mới nhận thưởng chào mừng lên tới 888k 👑✨",
  "Khuyến mãi nổi bật: Nạp lần đầu nhận thêm ưu đãi hấp dẫn, khuyến mại lên tới 100% giá trị nạp 🎉⚡",
  "Thông báo mới: Hệ thống ổn định, giao diện mượt, trải nghiệm truy cập tiện lợi hơn mỗi ngày 💎🚀",
];

/** Tốc độ chạy mỗi câu (ms). Tăng = chạy chậm hơn, giảm = nhanh hơn. */
const TICKER_DURATION_MS = 24000;

export default function AnnouncementTicker() {
  const [index, setIndex] = useState(0);
  const text = ANNOUNCEMENTS[index] ?? ANNOUNCEMENTS[0];

  const goNext = () => {
    setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
  };

  return (
    <div className="announcement-ticker-wrap relative flex w-full items-center overflow-hidden">
      <div
        key={index}
        className="announcement-ticker-text inline-block whitespace-nowrap will-change-transform"
        onAnimationEnd={goNext}
        style={{
          animation: `announcement-ticker-scroll ${TICKER_DURATION_MS}ms linear 1 forwards`,
        }}
      >
        {text}
      </div>
    </div>
  );
}
