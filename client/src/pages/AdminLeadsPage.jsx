import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import ImageUploader from "../components/ImageUploader";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate, formatDateTime } from "../utils/formatDate";

const ADMIN_TABS = [
  { id: "overview", label: "Bảng điều khiển", shortLabel: "BĐK" },
  { id: "products", label: "Sản phẩm", shortLabel: "SP" },
  { id: "orders", label: "Đơn hàng", shortLabel: "ĐH" },
  { id: "users", label: "Người dùng", shortLabel: "ND" },
  { id: "leads", label: "Khách hàng", shortLabel: "KH" },
  { id: "categories", label: "Danh mục", shortLabel: "DM" }
];

const ORDER_STATUSES = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" }
];

const LEAD_STATUSES = [
  { value: "new", label: "Mới" },
  { value: "contacted", label: "Đã liên hệ" },
  { value: "qualified", label: "Tiềm năng" },
  { value: "closed", label: "Đã chốt" }
];

const USER_ROLES = [
  { value: "admin", label: "Quản trị viên" },
  { value: "user", label: "Người dùng" }
];

const getStatusLabel = (statuses, value) => statuses.find((s) => s.value === value)?.label || value;

const createEmptyProductForm = () => ({
  name: "",
  slug: "",
  brand: "",
  category: "",
  shortDescription: "",
  description: "",
  price: 0,
  oldPrice: 0,
  stock: 0,
  images: [],
  badge: "",
  rating: 4.8,
  reviewCount: 0,
  featured: false,
  isActive: true,
  specs: {
    cpu: "",
    ram: "",
    ssd: "",
    gpu: "",
    display: "",
    ports: "",
    os: "",
    weight: "",
    dimensions: "",
    color: ""
  }
});

const createEmptyUserForm = () => ({
  fullName: "",
  email: "",
  password: "",
  role: "user"
});

const createEmptyCategoryForm = () => ({
  name: "",
  slug: "",
  description: ""
});

const createDashboardFallback = () => ({
  stats: {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalLeads: 0,
    pendingOrders: 0,
    newLeads: 0,
    activeProducts: 0,
    totalRevenue: 0
  },
  recentOrders: [],
  lowStockProducts: []
});

const normalizeTrendBars = (orders) => {
  const totals = orders
    .slice(0, 12)
    .map((order) => order.totalAmount || 0)
    .reverse();
  const fallbackTotals = totals.length ? totals : [12000000, 18000000, 14000000, 21000000, 17000000, 24000000];
  const maxValue = Math.max(...fallbackTotals, 1);

  return fallbackTotals.map((value, index) => ({
    id: `${index}-${value}`,
    height: `${Math.max(14, Math.round((value / maxValue) * 100))}%`,
    isAccent: index === fallbackTotals.length - 1
  }));
};

const getGrowthText = (value, divisor) => {
  if (!divisor) return "+0%";
  const raw = Math.round((value / divisor) * 100);
  return `+${raw}%`;
};

function AdminLeadsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboard, setDashboard] = useState(createDashboardFallback);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userDrafts, setUserDrafts] = useState({});
  const [orderDrafts, setOrderDrafts] = useState({});
  const [leadDrafts, setLeadDrafts] = useState({});
  const [productForm, setProductForm] = useState(createEmptyProductForm);
  const [editingProductId, setEditingProductId] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [categoryForm, setCategoryForm] = useState(createEmptyCategoryForm);
  const [newUserForm, setNewUserForm] = useState(createEmptyUserForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, usersResponse, productsResponse, ordersResponse, leadsResponse, categoriesResponse] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/products"),
        api.get("/admin/orders"),
        api.get("/admin/leads"),
        api.get("/admin/categories")
      ]);

      const nextUsers = usersResponse.data?.data || [];
      const nextProducts = productsResponse.data?.data || [];
      const nextOrders = ordersResponse.data?.data || [];
      const nextLeads = leadsResponse.data?.data || [];
      const nextCategories = categoriesResponse.data?.data || [];

      setDashboard(dashboardResponse.data?.data || createDashboardFallback());
      setUsers(nextUsers);
      setProducts(nextProducts);
      setOrders(nextOrders);
      setLeads(nextLeads);
      setCategories(nextCategories);
      setUserDrafts(
        Object.fromEntries(
          nextUsers.map((item) => [
            item.id,
            {
              fullName: item.fullName,
              email: item.email,
              role: item.role,
              isActive: item.isActive,
              password: ""
            }
          ])
        )
      );
      setOrderDrafts(Object.fromEntries(nextOrders.map((item) => [item._id, item.status])));
      setLeadDrafts(Object.fromEntries(nextLeads.map((item) => [item._id, item.status])));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể tải dữ liệu quản trị.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleProductFieldChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "images") {
      const thumbnail = Array.isArray(value) && value.length > 0 ? value[0] : "";
      setProductForm((current) => ({ ...current, images: value, thumbnail }));
      return;
    }

    setProductForm((currentForm) => {
      if (name.startsWith("specs.")) {
        const specField = name.split(".")[1];
        return {
          ...currentForm,
          specs: {
            ...currentForm.specs,
            [specField]: value
          }
        };
      }

      if (type === "checkbox") {
        return {
          ...currentForm,
          [name]: checked
        };
      }

      return {
        ...currentForm,
        [name]:
          name === "price" ||
          name === "oldPrice" ||
          name === "stock" ||
          name === "rating" ||
          name === "reviewCount"
            ? Number(value)
            : value
      };
    });
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name || "",
      slug: product.slug || "",
      brand: product.brand || "",
      category: product.category || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      price: product.price || 0,
      oldPrice: product.oldPrice || 0,
      stock: product.stock || 0,
      images: product.images || [],
      badge: product.badge || "",
      rating: product.rating || 4.8,
      reviewCount: product.reviewCount || 0,
      featured: Boolean(product.featured),
      isActive: Boolean(product.isActive),
      specs: {
        cpu: product.specs?.cpu || "",
        ram: product.specs?.ram || "",
        ssd: product.specs?.ssd || "",
        gpu: product.specs?.gpu || "",
        display: product.specs?.display || "",
        ports: product.specs?.ports || "",
        os: product.specs?.os || "",
        weight: product.specs?.weight || "",
        dimensions: product.specs?.dimensions || "",
        color: product.specs?.color || ""
      }
    });
    setActiveTab("products");
    setNotice("");
  };

  const resetProductForm = () => {
    setEditingProductId("");
    setProductForm(createEmptyProductForm());
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setNotice("");

      if (editingProductId) {
        await api.patch(`/admin/products/${editingProductId}`, productForm);
        setNotice("Đã cập nhật sản phẩm thành công.");
      } else {
        await api.post("/admin/products", productForm);
        setNotice("Đã tạo sản phẩm mới thành công.");
      }

      resetProductForm();
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể lưu sản phẩm.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleProductStatus = async (product) => {
    try {
      setSubmitting(true);
      setError("");
      setNotice("");

      await api.patch(`/admin/products/${product._id}`, {
        ...product,
        isActive: !product.isActive
      });

      setNotice(product.isActive ? "Đã ẩn sản phẩm." : "Đã kích hoạt lại sản phẩm.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể cập nhật trạng thái sản phẩm.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.")) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setNotice("");
      await api.delete(`/admin/products/${productId}`);
      setNotice("Đã xóa sản phẩm thành công.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể xóa sản phẩm.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryFieldChange = (event) => {
    const { name, value } = event.target;
    setCategoryForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setCategoryForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || ""
    });
  };

  const resetCategoryForm = () => {
    setEditingCategoryId("");
    setCategoryForm(createEmptyCategoryForm());
  };

  const handleSubmitCategory = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      setNotice("");
      if (editingCategoryId) {
        await api.patch(`/admin/categories/${editingCategoryId}`, categoryForm);
        setNotice("Đã cập nhật danh mục thành công.");
      } else {
        await api.post("/admin/categories", categoryForm);
        setNotice("Đã tạo danh mục mới thành công.");
      }
      resetCategoryForm();
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể lưu danh mục.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này không? Các sản phẩm thuộc danh mục này sẽ không bị xóa.")) return;
    try {
      setSubmitting(true);
      setError("");
      setNotice("");
      await api.delete(`/admin/categories/${categoryId}`);
      setNotice("Đã xóa danh mục thành công.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể xóa danh mục.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewUserFieldChange = (event) => {
    const { name, value } = event.target;
    setNewUserForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setNotice("");

      await api.post("/admin/users", newUserForm);
      setNotice("Đã tạo tài khoản mới thành công.");
      setNewUserForm(createEmptyUserForm());
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể tạo tài khoản.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUserDraftChange = (userId, field, value) => {
    setUserDrafts((currentDrafts) => ({
      ...currentDrafts,
      [userId]: {
        ...currentDrafts[userId],
        [field]: value
      }
    }));
  };

  const handleSaveUser = async (userId) => {
    try {
      setSubmitting(true);
      setError("");
      setNotice("");

      await api.patch(`/admin/users/${userId}`, userDrafts[userId]);
      setNotice("Đã cập nhật tài khoản thành công.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể cập nhật tài khoản.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOrderStatusSave = async (orderId) => {
    try {
      setSubmitting(true);
      setError("");
      setNotice("");

      await api.patch(`/admin/orders/${orderId}`, {
        status: orderDrafts[orderId]
      });

      setNotice("Đã cập nhật trạng thái đơn hàng.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể cập nhật đơn hàng.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeadStatusSave = async (leadId) => {
    try {
      setSubmitting(true);
      setError("");
      setNotice("");

      await api.patch(`/admin/leads/${leadId}`, {
        status: leadDrafts[leadId]
      });

      setNotice("Đã cập nhật khách hàng tiềm năng.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể cập nhật khách hàng tiềm năng.");
    } finally {
      setSubmitting(false);
    }
  };

  const productImagesValue = useMemo(() => {
    const images = productForm.images || [];
    return Array.isArray(images) ? images : [];
  }, [productForm.images]);

  const trendBars = normalizeTrendBars(orders);
  const metricCards = [
    {
      title: "Tổng sản phẩm",
      value: dashboard.stats.totalProducts,
      subtext: `${dashboard.stats.activeProducts} sản phẩm đang kinh doanh`,
      growth: getGrowthText(dashboard.stats.activeProducts, Math.max(dashboard.stats.totalProducts, 1))
    },
    {
      title: "Sắp hết hàng",
      value: dashboard.lowStockProducts.length,
      subtext: "Cần xử lý sớm trong kho",
      growth: `-${dashboard.lowStockProducts.length || 0}%`
    },
    {
      title: "Doanh thu tháng",
      value: formatCurrency(dashboard.stats.totalRevenue),
      subtext: `${dashboard.stats.totalOrders} đơn hàng toàn hệ thống`,
      growth: getGrowthText(dashboard.stats.totalOrders, Math.max(dashboard.stats.totalUsers, 1))
    },
    {
      title: "Đơn hàng chờ",
      value: dashboard.stats.pendingOrders,
      subtext: `${dashboard.stats.newLeads} khách hàng mới chưa xử lý`,
      growth: getGrowthText(dashboard.stats.pendingOrders, Math.max(dashboard.stats.totalOrders, 1))
    }
  ];

  return (
    <section className="admin-page admin-dashboard-page">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <span className="admin-sidebar-logo">NN</span>
            <div>
              <strong>Nam Nguyen</strong>
              <span>Trang quản trị</span>
            </div>
          </div>

          <nav className="admin-sidebar-nav">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`admin-sidebar-link ${activeTab === tab.id ? "is-active" : ""}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="admin-sidebar-icon">{tab.shortLabel}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-foot">
            <div className="admin-sidebar-profile">
              <strong>{user?.fullName}</strong>
              <span>{user?.email}</span>
            </div>
            <button className="btn btn-secondary admin-sidebar-logout" type="button" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div>
              <p className="eyebrow">Tổng quan hệ thống</p>
              <h1>{ADMIN_TABS.find((tab) => tab.id === activeTab)?.label || "Bảng điều khiển"}</h1>
            </div>

            <div className="admin-topbar-actions">
              <span className="admin-refresh-pill">Cập nhật tức thì</span>
              <button className="btn btn-secondary" type="button" onClick={loadAdminData}>
                Làm mới
              </button>
            </div>
          </header>

          {loading ? <div className="admin-empty">Đang tải dữ liệu...</div> : null}
          {!loading && error ? <div className="admin-empty admin-empty-error">{error}</div> : null}

          {!loading && !error && (
            <div className="admin-content-stack">
              {notice ? <div className="admin-notice">{notice}</div> : null}

              <section className="admin-kpi-grid">
                {metricCards.map((card) => (
                  <article key={card.title} className="admin-kpi-card">
                    <div className="admin-kpi-head">
                      <span>{card.title}</span>
                      <i />
                    </div>
                    <strong>{card.value}</strong>
                    <div className="admin-kpi-foot">
                      <span>{card.subtext}</span>
                      <em>{card.growth}</em>
                    </div>
                  </article>
                ))}
              </section>

              {activeTab === "overview" ? (
                <>
                  <section className="admin-overview-grid">
                    <article className="admin-card-panel admin-chart-panel">
                      <div className="admin-section-head">
                        <h2>Xu hướng doanh thu</h2>
                        <div className="admin-chart-tools">
                          <span>Tháng 7, 2026</span>
                          <button className="btn btn-secondary" type="button">
                            Xuất báo cáo
                          </button>
                        </div>
                      </div>

                      <div className="admin-chart-bars">
                        {trendBars.map((bar) => (
                          <span
                            key={bar.id}
                            className={`admin-chart-bar ${bar.isAccent ? "is-accent" : ""}`}
                            style={{ height: bar.height }}
                          />
                        ))}
                      </div>
                    </article>

                    <article className="admin-card-panel admin-summary-panel">
                      <div className="admin-section-head">
                        <h2>Hiệu suất khuyến mãi</h2>
                        <span className="admin-summary-window">7 ngày qua</span>
                      </div>

                      <div className="admin-summary-metrics">
                        <div className="admin-mini-card">
                          <span>Lượt dùng coupon</span>
                          <strong>{dashboard.stats.totalOrders ? "78.2%" : "0%"}</strong>
                          <em>Đã dùng trong luồng</em>
                        </div>
                        <div className="admin-mini-card">
                          <span>Tỷ lệ chuyển đổi</span>
                          <strong>{dashboard.stats.totalLeads ? "12.8%" : "0%"}</strong>
                          <em>Ước tính từ KH tiềm năng</em>
                        </div>
                        <div className="admin-mini-card">
                          <span>Revenue</span>
                          <strong>{formatCurrency(dashboard.stats.totalRevenue)}</strong>
                          <em>Ghi nhận từ đơn hàng</em>
                        </div>
                        <div className="admin-mini-card">
                          <span>Giảm giá trung bình</span>
                          <strong>{dashboard.stats.totalOrders ? "$5.45" : "$0.00"}</strong>
                          <em>Hiệu quả chiến dịch</em>
                        </div>
                      </div>

                      <button className="admin-outline-link" type="button" onClick={() => setActiveTab("orders")}>
                        Xem báo cáo đơn hàng đầy đủ
                      </button>
                    </article>
                  </section>

                  <section className="admin-overview-grid admin-overview-grid-bottom">
                    <article className="admin-card-panel">
                      <div className="admin-section-head">
                        <h2>Cảnh báo tồn kho</h2>
                      </div>

                      <div className="admin-warning-list">
                        {dashboard.lowStockProducts.map((product) => (
                          <div key={product._id} className="admin-warning-item">
                            <div>
                              <strong>{product.name}</strong>
                              <span>{product.brand} - còn {product.stock} sản phẩm</span>
                            </div>
                            <div className="admin-warning-bar">
                              <span style={{ width: `${Math.max(8, Math.min(100, product.stock * 12))}%` }} />
                            </div>
                          </div>
                        ))}
                        {!dashboard.lowStockProducts.length ? (
                          <div className="admin-empty-inline">Kho đang an toàn, chưa có sản phẩm cần cảnh báo.</div>
                        ) : null}
                      </div>
                    </article>

                    <article className="admin-card-panel">
                      <div className="admin-section-head">
                        <h2>Đơn hàng gần đây</h2>
                      </div>

                      <div className="admin-list">
                        {dashboard.recentOrders.map((order) => (
                          <article key={order._id} className="admin-list-item">
                            <div>
                              <strong>{order.customer?.fullName}</strong>
                              <span>{formatDate(order.createdAt)} - {order.status}</span>
                            </div>
                            <strong>{formatCurrency(order.totalAmount)}</strong>
                          </article>
                        ))}
                        {!dashboard.recentOrders.length ? (
                          <div className="admin-empty-inline">Chưa có đơn hàng nào để hiển thị.</div>
                        ) : null}
                      </div>
                    </article>
                  </section>
                </>
              ) : null}

              {activeTab === "products" ? (
                <div className="admin-tab-layout">
                  <section className="admin-card-panel admin-product-builder">
                    <div className="admin-product-builder-head">
                      <div>
                        <p className="eyebrow">Quản lý sản phẩm</p>
                        <h2>{editingProductId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h2>
                      </div>

                      <div className="admin-product-builder-actions">
                        <button className="btn btn-secondary" type="button" onClick={resetProductForm}>
                          Lưu nháp
                        </button>
                        <button className="btn btn-primary" form="admin-product-form" type="submit" disabled={submitting}>
                          {submitting ? "Đang lưu..." : editingProductId ? "Cập nhật" : "Thêm mới"}
                        </button>
                      </div>
                    </div>

                    <form className="admin-product-layout" id="admin-product-form" onSubmit={handleSubmitProduct}>
                      <div className="admin-product-main">
                        <section className="admin-product-panel">
                          <div className="admin-product-panel-head">
                            <h3>Thông tin chung</h3>
                          </div>

                          <div className="admin-product-form-grid">
                            <label className="admin-field">
                              <span>Tên sản phẩm</span>
                              <input name="name" placeholder="Nhập tên sản phẩm" value={productForm.name} onChange={handleProductFieldChange} required />
                            </label>
                            <label className="admin-field">
                              <span>Đường dẫn (slug)</span>
                              <input name="slug" placeholder="Để trống để tạo tự động" value={productForm.slug} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field admin-field-span-2">
                              <span>Mô tả chi tiết</span>
                              <textarea name="description" placeholder="Nhập mô tả chi tiết" rows="5" value={productForm.description} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field admin-field-span-2">
                              <span>Mô tả ngắn</span>
                              <input name="shortDescription" placeholder="Nhập mô tả ngắn" value={productForm.shortDescription} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Thương hiệu</span>
                              <input name="brand" placeholder="VD: ASUS, DELL" value={productForm.brand} onChange={handleProductFieldChange} required />
                            </label>
                            <label className="admin-field">
                              <span>Badge</span>
                              <input name="badge" placeholder="VD: HOT, NEW, SALE" value={productForm.badge} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>CPU</span>
                              <input name="specs.cpu" placeholder="VD: Core i9-14900HX" value={productForm.specs.cpu} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>RAM</span>
                              <input name="specs.ram" placeholder="VD: 32GB DDR5" value={productForm.specs.ram} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>SSD</span>
                              <input name="specs.ssd" placeholder="VD: 1TB NVMe" value={productForm.specs.ssd} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>GPU</span>
                              <input name="specs.gpu" placeholder="VD: RTX 4080 12GB" value={productForm.specs.gpu} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field admin-field-span-2">
                              <span>Màn hình</span>
                              <input name="specs.display" placeholder="VD: 16 inch QHD+ 240Hz" value={productForm.specs.display} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field admin-field-span-2">
                              <span>Cổng giao tiếp</span>
                              <input name="specs.ports" placeholder="VD: 2x USB-C, 2x USB-A, HDMI" value={productForm.specs.ports} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Hệ điều hành</span>
                              <input name="specs.os" placeholder="VD: Windows 11 Home" value={productForm.specs.os} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Màu sắc</span>
                              <input name="specs.color" placeholder="VD: Eclipse Gray" value={productForm.specs.color} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Kích thước</span>
                              <input name="specs.dimensions" placeholder="VD: 35.4 x 25.1 x 2.24 cm" value={productForm.specs.dimensions} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Trọng lượng</span>
                              <input name="specs.weight" placeholder="VD: 2.5 kg" value={productForm.specs.weight} onChange={handleProductFieldChange} />
                            </label>
                          </div>
                        </section>

                        <section className="admin-product-panel">
                          <div className="admin-product-panel-head">
                            <h3>Giá và kho hàng</h3>
                          </div>

                          <div className="admin-product-form-grid">
                            <label className="admin-field">
                              <span>Giá bán</span>
                              <input name="price" placeholder="Nhập giá bán" type="number" value={productForm.price} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Tồn kho</span>
                              <input name="stock" placeholder="Số lượng trong kho" type="number" value={productForm.stock} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Giá cũ</span>
                              <input name="oldPrice" placeholder="Giá gốc (nếu có)" type="number" value={productForm.oldPrice} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Đánh giá</span>
                              <input name="rating" placeholder="Từ 1 đến 5" type="number" step="0.1" value={productForm.rating} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Lượt đánh giá</span>
                              <input name="reviewCount" placeholder="Số lượt đánh giá" type="number" value={productForm.reviewCount} onChange={handleProductFieldChange} />
                            </label>
                            <div className="admin-field">
                              <span>Trạng thái</span>
                              <div className="admin-boolean-row">
                                <label className="admin-checkbox">
                                  <input name="featured" type="checkbox" checked={productForm.featured} onChange={handleProductFieldChange} />
                                  <span>Nổi bật</span>
                                </label>
                                <label className="admin-checkbox">
                                  <input name="isActive" type="checkbox" checked={productForm.isActive} onChange={handleProductFieldChange} />
                                  <span>Đang bán</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>

                      <div className="admin-product-side">
                        <section className="admin-product-panel">
                          <div className="admin-product-panel-head">
                            <h3>Hình ảnh</h3>
                          </div>

                          <ImageUploader
                            value={productImagesValue}
                            onChange={(newValue) => handleProductFieldChange({ target: { name: "images", value: newValue } })}
                          />
                        </section>

                        <section className="admin-product-panel">
                          <div className="admin-product-panel-head">
                            <h3>Danh mục</h3>
                          </div>
                          <div className="admin-product-form-grid admin-product-form-grid-single">
                            <label className="admin-field">
                              <span>Chọn danh mục</span>
                              <select name="category" value={productForm.category} onChange={handleProductFieldChange} required>
                                <option value="" disabled>-- Chọn một danh mục --</option>
                                {categories.map((cat) => (
                                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                              </select>
                            </label>
                            <button className="btn btn-secondary admin-category-helper" type="button" onClick={() => setActiveTab("categories")}>
                              Thêm danh mục
                            </button>
                          </div>
                        </section>
                      </div>
                    </form>
                  </section>

                  <section className="admin-card-panel">
                    <div className="admin-section-head">
                      <h2>Danh sách sản phẩm</h2>
                    </div>
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product._id}>
                              <td>
                                <strong>{product.name}</strong>
                                <span>{product.brand} - {product.category}</span>
                              </td>
                              <td>
                                <strong>{formatCurrency(product.price)}</strong>
                                <span>{product.oldPrice ? formatCurrency(product.oldPrice) : "Không có giá cũ"}</span>
                              </td>
                              <td>{product.stock}</td>
                              <td>{product.isActive ? "Đang bán" : "Đã ẩn"}</td>
                              <td>
                                <div className="admin-row-actions">
                                  <button className="btn btn-secondary" type="button" onClick={() => handleEditProduct(product)}>
                                    Sửa
                                  </button>
                                  <button className="btn btn-secondary" type="button" onClick={() => handleToggleProductStatus(product)}>
                                    {product.isActive ? "Ẩn" : "Hiện"}
                                  </button>
                                  <button className="btn btn-danger" type="button" onClick={() => handleDeleteProduct(product._id)}>
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              ) : null}

              {activeTab === "categories" ? (
                <div className="admin-tab-layout">
                  <section className="admin-card-panel">
                    <div className="admin-section-head">
                      <h2>{editingCategoryId ? "Sửa danh mục" : "Thêm danh mục mới"}</h2>
                      {editingCategoryId ? (
                        <button className="btn btn-secondary" type="button" onClick={resetCategoryForm}>
                          Hủy
                        </button>
                      ) : null}
                    </div>
                    <form className="admin-form-grid" onSubmit={handleSubmitCategory}>
                      <input name="name" placeholder="Tên danh mục" value={categoryForm.name} onChange={handleCategoryFieldChange} required />
                      <input name="slug" placeholder="Đường dẫn (để trống tự tạo)" value={categoryForm.slug} onChange={handleCategoryFieldChange} />
                      <textarea name="description" placeholder="Mô tả ngắn" value={categoryForm.description} onChange={handleCategoryFieldChange} className="admin-form-span-2" rows="3" />
                      <button className="btn btn-primary admin-form-span-2" type="submit" disabled={submitting}>
                        {submitting ? "Đang lưu..." : editingCategoryId ? "Cập nhật" : "Thêm mới"}
                      </button>
                    </form>
                  </section>

                  <section className="admin-card-panel">
                    <div className="admin-section-head">
                      <h2>Danh sách danh mục</h2>
                    </div>
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Tên danh mục</th>
                            <th>Mô tả</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((cat) => (
                            <tr key={cat._id}>
                              <td>
                                <strong>{cat.name}</strong>
                                <span>/{cat.slug}</span>
                              </td>
                              <td>{cat.description || "Chưa có mô tả"}</td>
                              <td>{formatDateTime(cat.createdAt)}</td>
                              <td>
                                <div className="admin-row-actions">
                                  <button className="btn btn-secondary" type="button" onClick={() => handleEditCategory(cat)}>
                                    Sửa
                                  </button>
                                  <button className="btn btn-danger" type="button" onClick={() => handleDeleteCategory(cat._id)}>
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              ) : null}

              {activeTab === "orders" ? (
                <section className="admin-card-panel">
                  <div className="admin-section-head">
                    <h2>Quản lý đơn hàng</h2>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Khách hàng</th>
                          <th>Liên hệ</th>
                          <th>Thanh toán</th>
                          <th>Trạng thái</th>
                          <th>Ngày tạo</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td>
                              <strong>{order.customer?.fullName}</strong>
                              <span>{order.items?.length || 0} sản phẩm</span>
                            </td>
                            <td>
                              <span>{order.customer?.email}</span>
                              <span>{order.customer?.phone}</span>
                            </td>
                            <td>
                              <strong>{formatCurrency(order.totalAmount)}</strong>
                              <span>{order.paymentMethod}</span>
                            </td>
                            <td>
                              <select
                                className="admin-select"
                                value={orderDrafts[order._id] || order.status}
                                onChange={(event) =>
                                  setOrderDrafts((currentDrafts) => ({
                                    ...currentDrafts,
                                    [order._id]: event.target.value
                                  }))
                                }
                              >
                                {ORDER_STATUSES.map((status) => (
                                  <option key={status.value} value={status.value}>
                                    {status.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>
                              <button className="btn btn-secondary" type="button" onClick={() => handleOrderStatusSave(order._id)}>
                                Lưu
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}

              {activeTab === "users" ? (
                <div className="admin-tab-layout">
                  <section className="admin-card-panel">
                    <div className="admin-section-head">
                      <h2>Tạo tài khoản mới</h2>
                    </div>
                    <form className="admin-form-grid" onSubmit={handleCreateUser}>
                      <input name="fullName" placeholder="Họ và tên" value={newUserForm.fullName} onChange={handleNewUserFieldChange} required />
                      <input name="email" placeholder="Email" type="email" value={newUserForm.email} onChange={handleNewUserFieldChange} required />
                      <input name="password" placeholder="Mật khẩu" type="password" value={newUserForm.password} onChange={handleNewUserFieldChange} required />
                      <select name="role" value={newUserForm.role} onChange={handleNewUserFieldChange}>
                        {USER_ROLES.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <button className="btn btn-primary admin-form-span-2" type="submit" disabled={submitting}>
                        {submitting ? "Đang tạo..." : "Tạo tài khoản"}
                      </button>
                    </form>
                  </section>

                  <section className="admin-card-panel">
                    <div className="admin-section-head">
                      <h2>Danh sách tài khoản</h2>
                    </div>
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Đặt lại mật khẩu</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <input
                                  className="admin-inline-input"
                                  value={userDrafts[item.id]?.fullName || ""}
                                  onChange={(event) => handleUserDraftChange(item.id, "fullName", event.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  className="admin-inline-input"
                                  value={userDrafts[item.id]?.email || ""}
                                  onChange={(event) => handleUserDraftChange(item.id, "email", event.target.value)}
                                />
                              </td>
                              <td>
                                <select
                                  className="admin-select"
                                  value={userDrafts[item.id]?.role || item.role}
                                  onChange={(event) => handleUserDraftChange(item.id, "role", event.target.value)}
                                >
                                  {USER_ROLES.map((role) => (
                                    <option key={role.value} value={role.value}>
                                      {role.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <select
                                  className="admin-select"
                                  value={String(userDrafts[item.id]?.isActive ?? item.isActive)}
                                  onChange={(event) => handleUserDraftChange(item.id, "isActive", event.target.value === "true")}
                                >
                                  <option value="true">Hoạt động</option>
                                  <option value="false">Bị khóa</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  className="admin-inline-input"
                                  placeholder="Bỏ trống nếu không đổi"
                                  type="password"
                                  value={userDrafts[item.id]?.password || ""}
                                  onChange={(event) => handleUserDraftChange(item.id, "password", event.target.value)}
                                />
                              </td>
                              <td>
                                <button className="btn btn-secondary" type="button" onClick={() => handleSaveUser(item.id)}>
                                  Lưu
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              ) : null}

              {activeTab === "leads" ? (
                <section className="admin-card-panel">
                  <div className="admin-section-head">
                    <h2>Danh sách khách hàng tiềm năng</h2>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Khách hàng</th>
                          <th>Thông tin</th>
                          <th>Dịch vụ quan tâm</th>
                          <th>Nội dung</th>
                          <th>Trạng thái</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead._id}>
                            <td>
                              <strong>{lead.fullName}</strong>
                              <span>{lead.companyName || "Chưa có công ty"}</span>
                            </td>
                            <td>
                              <span>{lead.email}</span>
                              <span>{lead.phoneNumber}</span>
                            </td>
                            <td>{lead.serviceInterest}</td>
                            <td>{lead.message}</td>
                            <td>
                              <select
                                className="admin-select"
                                value={leadDrafts[lead._id] || lead.status}
                                onChange={(event) =>
                                  setLeadDrafts((currentDrafts) => ({
                                    ...currentDrafts,
                                    [lead._id]: event.target.value
                                  }))
                                }
                              >
                                {LEAD_STATUSES.map((status) => (
                                  <option key={status.value} value={status.value}>
                                    {status.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <button className="btn btn-secondary" type="button" onClick={() => handleLeadStatusSave(lead._id)}>
                                Lưu
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminLeadsPage;
