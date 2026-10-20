# FIND&GO Merchant Portal — Checkpoint 3

## Phạm vi và cách mở demo

Chạy `npm run dev`, đăng nhập bằng hệ thống hiện có. User có `role: 'Merchant'`
(không phân biệt hoa/thường) hoặc `roles` chứa `Merchant` tự chuyển tới `/merchant`.
Role khác giữ trang đích `/discover`. Cả đăng nhập email và Google dùng chung
`src/utils/accountNavigation.js` để chọn trang đích từ user trả về.
Merchant đã ở bản đồ có thể mở menu tài khoản → **Cổng đối tác** để quay về portal.
Trong môi trường dev có thể dùng tài khoản demo đã có của dự án, được mô tả
trong tài liệu discovery; portal không tạo tài khoản hoặc session demo riêng.

**Điều hướng theo role đã được bổ sung theo yêu cầu xử lý đăng nhập Merchant.**
Repo vẫn có `ProtectedRoute` kiểm tra token, chưa có role guard cho merchant.
Các route mới tái sử dụng lớp bảo vệ này, nên tài khoản đã đăng nhập đều có thể
mở giao diện mẫu. Đây chưa phải giới hạn truy cập theo vai trò Merchant.
Không đổi API, token, cơ chế đăng nhập Google/email hoặc trang đích Customer/Admin.

## Các trang và tương tác đã có

| Route | Chức năng |
| --- | --- |
| `/merchant` | Tổng quan, 4 KPI, đổi kỳ số liệu, biểu đồ SVG, bảng số liệu có thể mở, địa điểm và thao tác nhanh |
| `/merchant/venues` | Tìm theo tên/địa chỉ, lọc xác minh mẫu, xem chi tiết, trạng thái không có kết quả |
| `/merchant/campaigns` | Lọc trạng thái, xem chiến dịch mẫu, tạo form, kiểm tra khoảng ngày/giờ, xem trước, thêm bản nháp trong phiên |
| `/merchant/analytics` | Biểu đồ đổi kỳ, nhu cầu tìm kiếm và tiện ích minh họa, tín hiệu quan tâm theo địa điểm |
| `/merchant/plans` | Tạm gỡ route và liên kết menu theo yêu cầu; URL cũ chuyển về `/merchant`. Mã trang và mock gói được giữ để bật lại sau. |

Sidebar hiện trên desktop từ 1024px; tablet/mobile có nút mở Drawer.
Drawer đóng khi chọn trang, bấm ngoài, Escape hoặc nút đóng. Dialog MUI xử lý
focus trap và Escape. Các nút đều điều hướng, lọc, mở/đóng hoặc thông báo rõ trạng thái.

Luồng demo: đăng nhập → mở `/merchant` → xem hồ sơ địa điểm → mở Chiến dịch →
tạo chiến dịch cho sinh viên học nhóm, giờ 13:00–16:00 → xem trước → thêm bản nháp
vào phiên demo → mở Phân tích & nhu cầu. Đổi trang vẫn giữ bản nháp; tải lại sẽ mất.
Không có thông báo giả rằng dữ liệu đã lưu lên server hoặc chiến dịch đã phát hành.

## Mock data khi BE chưa có API

Các trang merchant sử dụng trực tiếp `src/data/merchantDemo.js`, không gọi API
địa điểm, chiến dịch, analytics hoặc gói dịch vụ. Không cần cấu hình biến môi
trường để bật mock; đăng nhập vẫn dùng cơ chế sẵn có.

Nguồn mock có 2 địa điểm kèm ảnh local và tiện ích, 3 chiến dịch đủ trạng thái
đang diễn ra/nháp/kết thúc, KPI và biểu đồ theo tuần/tháng, nhu cầu tìm kiếm,
lượt xem/chỉ đường theo địa điểm và 3 gói Free/Pilot/Growth. Số liệu chi tiết
khớp tổng KPI của từng kỳ; đổi kỳ ở trang Phân tích sẽ đổi cả biểu đồ và số chi tiết.

Trong form tạo chiến dịch, bấm **Điền dữ liệu mẫu** để có sẵn tên, địa điểm,
đối tượng sinh viên học nhóm, ngày, giờ 13:00–16:00 và quyền lợi. Sau đó có thể
sửa, xem trước và thêm bản nháp. Nút điền mẫu không phát hành chiến dịch.
`createDemoCampaigns()` tạo bản sao fixture cho mỗi lần mở portal để việc sửa
state không ảnh hưởng dữ liệu gốc. Tải lại trang sẽ trở về bộ mock ban đầu.

Khi BE sẵn sàng, thay nguồn đọc fixture bằng service/API ở từng trang và thay
khởi tạo state trong layout bằng danh sách chiến dịch trả về. Schema API thực tế
cần thống nhất với BE; hiện chưa tự đặt endpoint hay gửi request tới API chưa có.

## Tổ chức mã và comment

- `src/App.jsx`: thêm route con, lazy load các trang, tái sử dụng ProtectedRoute.
- `src/pages/merchant/MerchantLayout.jsx`: sidebar, Drawer, header, Outlet và state bản nháp.
- `src/pages/merchant/MerchantDashboard.jsx`: KPI và chọn kỳ số liệu.
- `src/pages/merchant/MerchantVenues.jsx`: tìm kiếm, lọc và xem trước địa điểm.
- `src/pages/merchant/MerchantCampaigns.jsx`: form → kiểm tra → xem trước → thêm bản nháp.
- `src/pages/merchant/MerchantAnalytics.jsx`: phân tích minh họa.
- `src/pages/merchant/MerchantPlans.jsx`: gói dịch vụ đề xuất.
- `src/components/merchant/MerchantUi.jsx`: nhãn demo, tiêu đề, venue card, dialog và biểu đồ dùng chung.
- `src/data/merchantDemo.js`: toàn bộ fixture địa điểm, chiến dịch, KPI, biểu đồ và nhu cầu.
- `src/pages/merchant/merchant.css`: CSS riêng, breakpoint và kiểu dialog.

Comment tiếng Việt giải thích vị trí state, giới hạn dữ liệu mẫu, cách đổi dữ liệu
sang tọa độ SVG, kiểm tra ngày/giờ và lý do dùng các breakpoint responsive.
Ảnh tái sử dụng từ `public/images/venues`; tên, địa chỉ và trạng thái là fixture,
không khẳng định người dùng sở hữu hay quản lý các doanh nghiệp này.
Không thêm thư viện, API, database hoặc thay đổi service xác thực.

## Responsive và xác minh

CSS đã xử lý: lưới có `minmax(0, 1fr)` chống phần tử đẩy tràn, SVG co theo card,
sidebar chuyển Drawer dưới 1024px, card về một cột dưới 768px, nút chạm tối thiểu
44px, form ngày/giờ về một cột, tên dài được xuống dòng, dialog giới hạn theo `dvh`.
Style được scope bằng `mp-` để không đổi giao diện B2C. Không dùng ẩn overflow ngang
toàn trang để che lỗi bố cục.

Đã chạy: `npm run lint`, `npm run typecheck`, `npm test` (25 test), `npm run build`.
Smoke check render React cũng đã qua cho cả 5 trang với layout và nhãn dữ liệu mẫu.
Build có cảnh báo chunk lớn hơn 500 kB; các trang merchant đã được lazy load riêng.

Chưa có trình duyệt khả dụng trong công cụ của phiên làm việc này. Vì vậy chưa
xác minh trực quan hay tương tác end-to-end ở các kích thước sau; cần kiểm tra thủ công:

| Viewport | Kiểm tra |
| --- | --- |
| 375px | Drawer, card một cột, không tràn ngang; mở preview và điền form ngày/giờ |
| 768px | Drawer, lưới thích ứng; chart và bộ lọc không đè nhau |
| 1024px | Sidebar xuất hiện; KPI, biểu đồ và card không tràn phần nội dung |
| 1440px | Khoảng cách, chiều rộng nội dung, ảnh và các cột cân đối |

Kiểm tra thêm: tìm địa điểm không tồn tại → xóa lọc; đổi kỳ chart; lọc từng trạng
thái chiến dịch; form thiếu trường/ngày sai/giờ sai; quay lại sửa từ preview;
thêm nháp rồi chuyển trang/quay lại; tải lại để thấy nháp được reset; Escape và
Tab trong dialog; mở trực tiếp link sâu; tài khoản chưa đăng nhập về `/login`.

## Chưa triển khai và bước tích hợp sau này

- Điều hướng hỗ trợ role Merchant; cần bổ sung giới hạn truy cập merchant theo schema
  đã thống nhất khi kết nối API. Backend phải kiểm tra
  quyền và quyền sở hữu trên mọi thao tác, không dựa vào frontend để bảo vệ dữ liệu.
- API địa điểm theo merchant, upload ảnh, chỉnh sửa, xác minh quyền quản lý và lưu hồ sơ.
- API chiến dịch: validation server, bản nháp, lưu trữ, phát hành, lịch chạy, phạm vi đối tượng.
- Sự kiện analytics với định nghĩa rõ impression/view/directions/redemption, khoảng
  thời gian và quyền riêng tư. Không quy đổi lượt chỉ đường thành lượt ghé thăm.
- Giá dịch vụ cần kiểm chứng mô hình kinh doanh. Chưa có đăng ký gói hoặc thanh toán.
- P2 chưa làm: QR thực tế, billing, realtime analytics, báo cáo nâng cao, tối ưu chiến dịch.
