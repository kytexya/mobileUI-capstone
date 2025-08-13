# Luồng Đặt Lịch - React Native

## Tổng quan

Đây là luồng đặt lịch hoàn chỉnh cho ứng dụng React Native, bao gồm 4 bước chính:

1. **Chọn dịch vụ** - Màn hình đầu tiên với accordion expandable
2. **Thông tin cá nhân** - Form nhập thông tin và chọn xe
3. **Chọn ngày giờ** - Calendar và time slots
4. **Xác nhận** - Tổng quan và xác nhận đặt lịch

## Cấu trúc Files

```
src/
├── screens/
│   ├── BookingFlowScreen.js      # Màn hình 1: Chọn dịch vụ
│   ├── PersonalInfoScreen.js     # Màn hình 2: Thông tin cá nhân
│   ├── DateTimeScreen.js         # Màn hình 3: Chọn ngày giờ
│   ├── ConfirmationScreen.js     # Màn hình 4: Xác nhận
│   └── BookingSuccessScreen.js   # Màn hình thành công
├── components/
│   └── ProgressBar.js            # Component progress bar tái sử dụng
└── navigation/
    └── AppNavigator.js           # Navigation đã được cập nhật
```

## Tính năng chính

### 1. BookingFlowScreen (Màn hình chọn dịch vụ)
- ✅ Accordion expandable cho các danh mục dịch vụ
- ✅ Checkbox để chọn từng dịch vụ
- ✅ Progress bar hiển thị bước hiện tại
- ✅ Warning message về thời gian đặt lịch
- ✅ Nút "Tiếp theo" chỉ active khi có dịch vụ được chọn

### 2. PersonalInfoScreen (Màn hình thông tin cá nhân)
- ✅ Form nhập thông tin cá nhân (họ tên, email, số điện thoại)
- ✅ Radio button chọn xe (lấy từ thông tin có sẵn hoặc thêm mới)
- ✅ Progress bar bước 2
- ✅ Validation và UI thân thiện

### 3. DateTimeScreen (Màn hình chọn ngày giờ)
- ✅ Calendar tháng với navigation
- ✅ Time slots để chọn giờ
- ✅ Radio button chọn thợ (không chỉ định)
- ✅ Progress bar bước 3

### 4. ConfirmationScreen (Màn hình xác nhận)
- ✅ Tổng quan tất cả thông tin đã chọn
- ✅ Tính tổng tiền dịch vụ
- ✅ Điều khoản và điều kiện
- ✅ Progress bar bước 4

### 5. BookingSuccessScreen (Màn hình thành công)
- ✅ Icon thành công
- ✅ Thông tin đặt lịch
- ✅ Hướng dẫn bước tiếp theo
- ✅ Nút về trang chủ và xem lịch sử

## Cách sử dụng

### 1. Bắt đầu luồng đặt lịch
```javascript
// Từ HomeScreen hoặc bất kỳ màn hình nào
navigation.navigate('BookingFlowScreen');
```

### 2. Truyền dữ liệu giữa các màn hình
```javascript
// Truyền dữ liệu từ màn hình này sang màn hình khác
navigation.navigate('PersonalInfoScreen', { 
  selectedServices: [1, 2, 3] 
});
```

### 3. Nhận dữ liệu từ màn hình trước
```javascript
const { selectedServices } = route.params;
```

## Dữ liệu mẫu

### Service Categories
```javascript
const serviceCategories = [
  {
    id: 1,
    title: 'Gói dịch vụ vệ sinh & bảo dưỡng',
    services: [
      { id: 1, name: 'Rửa xe cơ bản', price: '50.000đ' },
      { id: 2, name: 'Rửa xe cao cấp', price: '100.000đ' },
      { id: 3, name: 'Bảo dưỡng động cơ', price: '200.000đ' },
    ]
  },
  // ... các danh mục khác
];
```

### Personal Info
```javascript
const personalInfo = {
  fullName: 'Nguyễn Huỳnh Vân Anh',
  email: 'nhvanh2111@gmail.com',
  phone: '0123456789',
};
```

## Styling

### Màu sắc chính
- **Primary Green**: `#4CAF50` - Màu chủ đạo cho buttons và active states
- **Background**: `#fff` - Nền trắng
- **Text Primary**: `#333` - Text chính
- **Text Secondary**: `#666` - Text phụ
- **Border**: `#f0f0f0` - Viền

### Typography
- **Title**: 24px, bold
- **Section Title**: 18px, bold  
- **Body Text**: 14px, regular
- **Small Text**: 12px, regular

## Navigation Flow

```
HomeScreen
    ↓
BookingFlowScreen (Step 1)
    ↓
PersonalInfoScreen (Step 2)
    ↓
DateTimeScreen (Step 3)
    ↓
ConfirmationScreen (Step 4)
    ↓
BookingSuccessScreen
    ↓
HomeScreen (hoặc HistoryScreen)
```

## Tùy chỉnh

### 1. Thêm dịch vụ mới
Chỉnh sửa `serviceCategories` trong các màn hình liên quan.

### 2. Thay đổi màu sắc
Cập nhật các giá trị màu trong `styles` của từng component.

### 3. Thêm validation
Thêm logic validation trong các màn hình form.

### 4. Kết nối API
Thay thế mock data bằng API calls thực tế.

## Lưu ý

- Tất cả các màn hình đều sử dụng `SafeAreaView` để tương thích với notch
- Progress bar được tái sử dụng thông qua component `ProgressBar`
- Dữ liệu được truyền qua `route.params` giữa các màn hình
- UI được thiết kế responsive và thân thiện với người dùng
