# FE Task — luồng tìm địa điểm cho khách chưa đăng nhập

## Mục tiêu

Authenticated discovery implementation and login setup: [Discovery documentation](docs/discovery.md).
Google Sign-In configuration and backend contract: [Google Sign-In](docs/google-sign-in.md).

Xây dựng giao diện để khách chưa đăng nhập đi hết luồng tìm địa điểm F&B của FIND&GO: bắt đầu từ landing page, nhập nhu cầu, xem và so sánh gợi ý, mở chi tiết, chọn địa điểm và chuyển sang Google Maps.

Phạm vi này chỉ dành cho khách chưa đăng nhập. Luồng đăng ký/đăng nhập, hồ sơ người dùng, follow bạn bè và chức năng tài khoản doanh nghiệp chưa thuộc task này.

## Luồng màn hình

1. **Landing Page** — giới thiệu ngắn FIND&GO và nút bắt đầu.
2. **Nhập nhu cầu** — form hoặc giao diện prompt cho người dùng nhập tối đa 1–3 lệnh tìm kiếm. Hỗ trợ các tiêu chí bên dưới; thiết kế cụ thể cần thống nhất với team trước khi chốt UI.
3. **Kết quả gợi ý** — hiển thị danh sách theo thứ tự backend trả về, thông tin tóm tắt và lý do đề xuất.
4. **Chi tiết địa điểm** — hiển thị thông tin có sẵn như tên, loại hình, khoảng giá, địa chỉ, không gian, tiện ích, giờ mở cửa và hình ảnh.
5. **Chọn địa điểm / mở bản đồ** — cho phép chọn địa điểm và mở Google Maps với địa điểm đó.

## Tiêu chí tìm kiếm cần thể hiện

- **Purpose:** Study / Work, Eat & Drink, Hangout, Date, Group Gathering, Explore.
- **Budget:** ngân sách mỗi người; nhập số tiền hoặc chọn mức.
- **Distance:** Near me, bán kính hoặc khoảng cách tối đa.
- **Group Size:** Solo, 2 people, 3–5 people, 6+ people hoặc nhập số cụ thể.
- **Category:** Café, Restaurant, Tea & Beverage, Dessert, Fast Food, Other F&B.
- **Atmosphere:** Quiet, Cozy, Social, Spacious, Outdoor, Aesthetic.
- **Amenities:** Wi-Fi, Power Outlets, Group Seating, Air Conditioning, Parking, Restroom.

## Checklist công việc

### Khởi tạo và thống nhất

- [ ] Xác nhận framework, cách chạy dự án và cấu trúc thư mục FE với team.
- [ ] Thống nhất với BE cách nhập 1–3 prompt/lệnh và định dạng request/response.
- [ ] Chốt cách FE gửi vị trí Near me và quyền truy cập vị trí của trình duyệt.

### Giao diện

- [ ] Tạo Landing Page giới thiệu sản phẩm và CTA bắt đầu.
- [ ] Tạo form/giao diện nhập prompt và các tiêu chí tìm kiếm.
- [ ] Validate dữ liệu nhập cơ bản và cho phép sửa/xóa lựa chọn.
- [ ] Tạo danh sách kết quả theo thứ tự backend trả về.
- [ ] Hiển thị tóm tắt và lý do gợi ý trên mỗi kết quả.
- [ ] Tạo trang hoặc panel chi tiết địa điểm.
- [ ] Tạo thao tác chọn địa điểm và mở Google Maps.
- [ ] Đảm bảo các màn hình dùng được ở kích thước mobile và desktop.

### Trạng thái và kết nối API

- [ ] Hiển thị trạng thái đang tải khi gửi tìm kiếm.
- [ ] Hiển thị lỗi có thể hiểu được khi API thất bại và cho phép thử lại.
- [ ] Hiển thị trạng thái không có kết quả phù hợp.
- [ ] Tích hợp `POST /api/recommendations` sau khi BE chốt contract.
- [ ] Tích hợp `GET /api/venues/{id}` sau khi BE chốt contract.
- [ ] Gọi API ghi navigation log khi phù hợp với luồng được team thống nhất.
- [ ] Kiểm tra FE chạy được với dữ liệu mẫu và API thật.

## Điều kiện hoàn thành

- [ ] Khách chưa đăng nhập hoàn tất được hành trình từ landing page đến Google Maps.
- [ ] Có thể nhập/gửi nhu cầu và xem kết quả gợi ý có thứ tự.
- [ ] Xem được chi tiết địa điểm và chọn địa điểm.
- [ ] Có trạng thái loading, lỗi và không có kết quả.
- [ ] FE tích hợp với API backend theo contract đã thống nhất.
- [ ] Hướng dẫn chạy FE được cập nhật khi framework và lệnh chạy đã xác nhận.

## Phụ thuộc và ghi chú

### AI demo trên trang `/discover`

Tìm kiếm hiện chạy cục bộ qua `src/services/discoveryAiDemo.js`: hiển thị hiệu ứng phân tích khoảng 1,8 giây, xếp hạng dữ liệu quán mẫu theo nhu cầu tiếng Việt/Anh và giữ các bộ lọc đã chọn. Thử `cafe for first date` hoặc `cà phê yên tĩnh có ổ cắm`. Có thể hủy tìm kiếm; kết quả cũ không ghi đè yêu cầu mới.

Điểm số là điểm minh họa theo mức khớp tiêu chí. Nội dung review trong `src/data/demoVenueReviews.js` là bản tổng hợp biên tập từ dữ liệu mẫu, không phải review khách hàng trực tiếp hoặc nội dung do mô hình AI sinh. Giao diện đánh dấu **AI demo** ở trạng thái tìm kiếm, kết quả và phần tổng hợp. Chưa gọi API AI, chưa dùng API key. Khi có contract backend, thay hàm tìm kiếm demo bằng adapter API có hỗ trợ hủy request.

- Endpoint và cấu trúc dữ liệu trong README task chung mới là đề xuất cho tới khi BE xác nhận.
- Không hard-code số lượng kết quả là ba; hiển thị số địa điểm backend trả về.
- Nếu chưa có API, dùng dữ liệu mẫu tạm thời và thay bằng API sau khi contract được chốt.
- Khi hoàn tất một mục, đổi `[ ]` thành `[x]`. Ghi chú mục bị chặn ngay bên dưới để team phối hợp.
