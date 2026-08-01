# API quản trị

Mọi endpoint `/api/admin/*` và `/api/uploads/image` đều yêu cầu header `Authorization: Bearer <JWT>` của tài khoản có quyền quản trị.

## Đăng nhập và Phiên làm việc

- `POST /api/auth/admin/login` — body `{ "email", "password" }`; chỉ chấp nhận tài khoản có quyền quản trị.
- `GET /api/auth/me` — kiểm tra phiên làm việc. Khi nhận mã lỗi `401`, frontend phải xóa token và chuyển hướng về trang đăng nhập (`/dang-nhap`).

## Ảnh

`POST /api/uploads/image` nhận `{ "image": "data:image/png;base64,..." }`, dung lượng tối đa 5MB, và trả về `data.url`. URL này sẽ được dùng cho trường `image` của sản phẩm hoặc banner.

## Tài nguyên quản trị

| Tài nguyên | Endpoint |
| --- | --- |
| Bảng điều khiển | `GET /api/admin/dashboard` |
| Sản phẩm | `GET, POST /api/admin/products`; `PATCH, DELETE /api/admin/products/:productId` |
| Danh mục sản phẩm | `GET, POST /api/admin/categories`; `PATCH, DELETE /api/admin/categories/:categoryId` |
| Banner | `GET, POST /api/admin/banners`; `PATCH, DELETE /api/admin/banners/:bannerId` |
| Đơn hàng | `GET /api/admin/orders`; `GET /api/admin/orders/:orderId`; `PATCH /api/admin/orders/:orderId` |

`GET /api/admin/products` hỗ trợ tìm kiếm và lọc: `search`, `category`, `status=active|hidden`, `sort=newest|oldest`.
`GET /api/admin/orders` hỗ trợ tìm kiếm (`search`) và lọc theo trạng thái.

**Yêu cầu dữ liệu:**
- **Sản phẩm:** Bắt buộc có `name` (tên), `price > 0` (giá), `category` (danh mục) và `image` (hình ảnh).
- **Danh mục:** Tên danh mục không phân biệt chữ hoa/thường và không được trùng lặp.
- **Banner:** Bắt buộc có `title` (tiêu đề), `image` (hình ảnh), và `order` (thứ tự, số không âm).
