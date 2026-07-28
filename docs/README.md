# Tài liệu trong thư mục `docs`

Thư mục này dùng để lưu:

- ERD
- Use Case Diagram
- Sequence Diagram
- API documentation
- Postman collection

## Tóm tắt yêu cầu QC website

### 1. Nội dung và định hướng

- Nội dung phải dễ hiểu, thực tế, đúng ngành công nghệ.
- Trọng tâm là thể hiện năng lực công ty, dịch vụ, lợi ích cho khách hàng và độ tin cậy.
- Đối tượng chính là khách hàng phổ thông và doanh nghiệp cần website, phần mềm hoặc dịch vụ công nghệ.
- Trang chủ nên có banner, giới thiệu ngắn, dịch vụ nổi bật, lý do chọn công ty và CTA rõ ràng.
- Trang giới thiệu cần có tên công ty, lĩnh vực hoạt động, định hướng, thế mạnh và thông tin nhận diện NNC.
- Dịch vụ hoặc sản phẩm phải mô tả rõ lợi ích, đối tượng khách hàng và thông số liên quan.
- Thông tin liên hệ phải thống nhất: số điện thoại, địa chỉ, email hoặc fanpage.

### 2. Giao diện và trải nghiệm

- Giao diện cần hiện đại, chuyên nghiệp, đáng tin và phù hợp công ty công nghệ.
- Tone màu chủ đạo: đỏ - đen, phối trắng/xám để cân bằng.
- Website phải responsive tốt trên desktop, tablet và mobile.
- Không để vỡ layout, chữ chồng, ảnh mờ, nút bấm khó nhận biết hoặc sai vị trí.
- Font chữ phải dễ đọc, phân cấp tiêu đề và nội dung rõ ràng.
- Header/footer cần đủ menu, logo, liên hệ và các liên kết quan trọng.

### 3. Chức năng website

- Menu và link nội bộ phải hoạt động đúng.
- CTA như gọi điện, inbox, liên hệ, báo giá phải dẫn đúng nơi.
- Form liên hệ cần kiểm tra họ tên, số điện thoại/email và nội dung trước khi gửi.
- Nếu có tìm kiếm/lọc thì phải trả kết quả đúng và xử lý tốt trường hợp không có dữ liệu.
- Cần có thông báo lỗi rõ ràng khi nhập sai hoặc thao tác thất bại.
- Tránh người dùng bấm nhiều lần gây gửi trùng dữ liệu.

### 4. Code và cấu trúc dự án

- Thư mục nên tách rõ assets, css, js, images, components/pages nếu dùng framework.
- Tên file nên viết thường, không dấu, dễ hiểu.
- HTML/CSS/JS phải gọn, không lỗi console, không code thừa.
- Nếu có backend thì nên tách controller/service/model rõ ràng.
- Không hard-code tài khoản, mật khẩu, API key hoặc token trong source code.
- README phải có hướng dẫn chạy website, cấu trúc thư mục, công nghệ sử dụng và cách cấu hình.

### 5. Database và SQL

- Database phải được thiết kế rõ ràng, đúng mục đích website.
- Bảng, cột, khóa chính, khóa ngoại và ràng buộc dữ liệu phải thống nhất, dễ hiểu.
- Cần có dữ liệu mẫu đủ để test giao diện và chức năng chính.
- Phải có file script SQL hoặc backup để tạo lại database.
- Website phải kết nối database ổn định, có xử lý lỗi và chống SQL Injection ở mức cơ bản.
- Cần có `CreatedAt`, `UpdatedAt`, `Status` hoặc `IsActive` nếu phù hợp cho dữ liệu nội dung.

### 6. Admin và bàn giao

- Website bắt buộc có tài khoản admin riêng để quản trị dữ liệu trên giao diện.
- Admin phải có quyền xem, thêm, sửa, xóa dữ liệu từ database thông qua website.
- Trang admin phải yêu cầu đăng nhập, không cho truy cập trực tiếp khi chưa xác thực.
- Khi xóa dữ liệu phải có xác nhận trước.
- Bàn giao cần có tài khoản test admin, hướng dẫn kết nối database, mô tả bảng chính và file SQL hoặc backup.

### 7. Thông tin công ty cần giữ đúng

- Tên công ty: Công Ty TNHH Công Nghệ Nam Nguyễn
- Thương hiệu: NNC
- Số điện thoại: 0383158080
- Địa chỉ: Số nhà 36, Ngõ 321 Dương Tự Minh, Tổ 26, Phường Quan Triều, Tỉnh Thái Nguyên
- Mã số thuế: 4601659316

### 8. Các checklist QC quan trọng

- Trang chủ có banner, giới thiệu ngắn, dịch vụ nổi bật và CTA.
- Trang giới thiệu và trang dịch vụ phản ánh đúng nội dung công ty.
- Giao diện đồng bộ tone đỏ - đen, sạch, chuyên nghiệp.
- Responsive tốt trên máy tính và điện thoại.
- Code sạch, cấu trúc rõ, không lỗi console.
- Database đầy đủ, script chạy lại được, có dữ liệu mẫu và thông tin bàn giao.
- Admin hoạt động đúng quyền, có đăng nhập và xác nhận xóa.
