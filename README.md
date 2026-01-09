# Magic English - Ứng dụng Học tiếng Anh "All-in-One"

Một ứng dụng web hiện đại được xây dựng với React và Tailwind CSS, hỗ trợ người tự học tiếng Anh với ba chức năng chính được hỗ trợ bởi AI.

## 🌟 Tính năng chính

### 1. **Magic Vocab** - Quản lý Từ vựng Thông minh
- ✨ Tự động làm giàu dữ liệu với AI
- 📝 Nhập từ → AI tự động điền IPA, nghĩa, loại từ, ví dụ và cấp độ CEFR
- 🔍 Tìm kiếm và lọc từ vựng
- 📚 Sổ tay từ vựng cá nhân

### 2. **Grammar Checker** - Kiểm tra Ngữ pháp
- 🎯 Chấm điểm văn bản (0-10)
- 🔴 Highlight lỗi ngữ pháp và chính tả
- 💡 Gợi ý sửa lỗi chi tiết
- ✍️ Đề xuất cải thiện phong cách viết

### 3. **Stats & Streaks** - Theo dõi Tiến độ
- 🔥 Chuỗi ngày học liên tục (Streak tracking)
- 📊 Biểu đồ phân tích từ vựng
- 🏆 Hệ thống huy hiệu thành tích
- 📈 Thống kê tiến bộ theo cấp độ CEFR

## 🎨 Thiết kế

- **Màu sắc chủ đạo**: Emerald Green (xanh lá nhẹ nhàng)
- **Font**: Inter
- **UI/UX**: Tối giản, gọn gàng, dễ sử dụng
- **Responsive**: Hỗ trợ đầy đủ cho desktop, tablet và mobile

## 💾 Lưu trữ dữ liệu

Ứng dụng sử dụng **Local Storage** để lưu trữ:
- Danh sách từ vựng cá nhân
- Chuỗi ngày học (streak)
- Dữ liệu thống kê

**Lưu ý**: Dữ liệu được lưu trên trình duyệt của bạn. Xóa cache có thể mất dữ liệu.

## 🤖 AI Mock

Hiện tại ứng dụng sử dụng **mock AI responses** để demo tính năng:
- Phân tích từ vựng: Trả về dữ liệu mẫu cho các từ phổ biến
- Chấm điểm ngữ pháp: Phát hiện một số lỗi cơ bản

Trong phiên bản production, có thể tích hợp với:
- Ollama Cloud API
- OpenAI API
- Google Gemini API
- Hoặc các LLM khác

## 🚀 Bắt đầu

Ứng dụng sẽ tự động:
1. Hiển thị màn hình chào mừng cho người dùng mới
2. Đề xuất tải dữ liệu mẫu (6 từ vựng + streak 5 ngày)
3. Người dùng có thể bỏ qua và bắt đầu từ đầu

## 📱 Sử dụng

### Thêm từ mới
1. Click nút **+** (FAB) ở góc phải dưới
2. Nhập từ tiếng Anh
3. Nhấn "✨ Phân tích Thần kỳ"
4. Xem và chỉnh sửa thông tin (nếu cần)
5. Lưu vào sổ tay

### Kiểm tra ngữ pháp
1. Chuyển sang tab "Grammar Check"
2. Nhập hoặc dán văn bản tiếng Anh
3. Nhấn "🎯 Kiểm tra Ngữ pháp Ngay"
4. Xem điểm số và gợi ý sửa lỗi

### Xem tiến độ
1. Chuyển sang tab "Stats & Streaks"
2. Xem chuỗi ngày học
3. Phân tích biểu đồ từ vựng
4. Theo dõi huy hiệu thành tích

## 🎯 Mục tiêu

Giúp người tự học tiếng Anh:
- ✅ Quản lý từ vựng hiệu quả
- ✅ Cải thiện kỹ năng viết
- ✅ Duy trì động lực học tập
- ✅ Theo dõi tiến độ rõ ràng

## 💡 Tips

- **Học đều đặn**: Duy trì streak để không mất động lực
- **Đa dạng từ vựng**: Học cả danh từ, động từ, tính từ
- **Luyện viết thường xuyên**: Sử dụng Grammar Checker mỗi ngày
- **Đặt mục tiêu**: Hướng đến các mốc huy hiệu (7 ngày, 30 ngày, 100 từ)

---

**Phát triển bởi**: Figma Make AI  
**Công nghệ**: React, TypeScript, Tailwind CSS, Recharts, Radix UI  
**Phiên bản**: 1.0.0
