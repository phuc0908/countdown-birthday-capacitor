# Ứng dụng Đếm ngược Sinh nhật 🎂

Ứng dụng giúp tính toán số ngày còn lại đến sinh nhật tiếp theo của bạn, với các tính năng thông báo và chia sẻ kết quả.

## Tính năng chính
- Nhập ngày sinh (định dạng dd/mm)
- Tự động kiểm tra tính hợp lệ của ngày tháng
- Hiển thị số ngày còn lại đến sinh nhật
- Thông báo cục bộ khi tính toán
- Chia sẻ kết quả qua các ứng dụng khác
- Hiển thị trạng thái pin (bonus)

## Công nghệ sử dụng
- ReactJS
- Capacitor (Android/iOS)
- Plugins:
  - `@capacitor/share`
  - `@capacitor/local-notifications`
  - `@capacitor/device`

## Cài đặt
```bash
# Các bước cài đặt dự án

## 1. Clone dự án
`
git https://github.com/phuc0908/countdown-birthday-capacitor.git
cd [countdown-birthday-capacitor

## 2. Tải dependencies và Capacitor CLI

npm install
npm install -g @capacitor/cli

## 3. Tải plugin

npm install @capacitor/core @capacitor/share @capacitor/local-notifications @capacitor/device

## 3. Build dự án trên giả lập android

npm run build
npx cap sync android
npx cap open android  # Mở bằng Android Studio

