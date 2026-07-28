import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";

const ADMIN_TABS = [
  { id: "overview", label: "Dashboard", shortLabel: "DB" },
  { id: "products", label: "Products", shortLabel: "PR" },
  { id: "orders", label: "Orders", shortLabel: "OR" },
  { id: "users", label: "Customers", shortLabel: "CU" },
  { id: "leads", label: "Leads", shortLabel: "LE" }
];

const ORDER_STATUSES = ["pending", "confirmed", "shipping", "completed", "cancelled"];
const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"];
const USER_ROLES = ["admin", "user"];

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
  image: "",
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
    display: ""
  }
});

const createEmptyUserForm = () => ({
  fullName: "",
  email: "",
  password: "",
  role: "user"
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
  const [userDrafts, setUserDrafts] = useState({});
  const [orderDrafts, setOrderDrafts] = useState({});
  const [leadDrafts, setLeadDrafts] = useState({});
  const [productForm, setProductForm] = useState(createEmptyProductForm);
  const [editingProductId, setEditingProductId] = useState("");
  const [newUserForm, setNewUserForm] = useState(createEmptyUserForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, usersResponse, productsResponse, ordersResponse, leadsResponse] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/products"),
        api.get("/admin/orders"),
        api.get("/admin/leads")
      ]);

      const nextUsers = usersResponse.data?.data || [];
      const nextProducts = productsResponse.data?.data || [];
      const nextOrders = ordersResponse.data?.data || [];
      const nextLeads = leadsResponse.data?.data || [];

      setDashboard(dashboardResponse.data?.data || createDashboardFallback());
      setUsers(nextUsers);
      setProducts(nextProducts);
      setOrders(nextOrders);
      setLeads(nextLeads);
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
      setError(requestError.response?.data?.message || "Khong the tai du lieu quan tri.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleProductFieldChange = (event) => {
    const { name, value, type, checked } = event.target;

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
      image: product.image || "",
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
        display: product.specs?.display || ""
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
        setNotice("Da cap nhat san pham.");
      } else {
        await api.post("/admin/products", productForm);
        setNotice("Da tao san pham moi.");
      }

      resetProductForm();
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Khong the luu san pham.");
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

      setNotice(product.isActive ? "Da an san pham." : "Da kich hoat lai san pham.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Khong the cap nhat trang thai san pham.");
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
      setNotice("Da tao tai khoan moi.");
      setNewUserForm(createEmptyUserForm());
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Khong the tao tai khoan.");
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
      setNotice("Da cap nhat tai khoan.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Khong the cap nhat tai khoan.");
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

      setNotice("Da cap nhat trang thai don hang.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Khong the cap nhat don hang.");
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

      setNotice("Da cap nhat lead.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Khong the cap nhat lead.");
    } finally {
      setSubmitting(false);
    }
  };

  const trendBars = normalizeTrendBars(orders);
  const metricCards = [
    {
      title: "Total Products Live",
      value: dashboard.stats.totalProducts,
      subtext: `${dashboard.stats.activeProducts} san pham dang kinh doanh`,
      growth: getGrowthText(dashboard.stats.activeProducts, Math.max(dashboard.stats.totalProducts, 1))
    },
    {
      title: "Inventory Low Items",
      value: dashboard.lowStockProducts.length,
      subtext: "Can xu ly som trong kho",
      growth: `-${dashboard.lowStockProducts.length || 0}%`
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(dashboard.stats.totalRevenue),
      subtext: `${dashboard.stats.totalOrders} don hang toan he thong`,
      growth: getGrowthText(dashboard.stats.totalOrders, Math.max(dashboard.stats.totalUsers, 1))
    },
    {
      title: "Orders Awaiting",
      value: dashboard.stats.pendingOrders,
      subtext: `${dashboard.stats.newLeads} lead moi chua xu ly`,
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
              <span>Admin Suite</span>
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
              Logout
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div>
              <p className="eyebrow">Product overview</p>
              <h1>{activeTab === "overview" ? "Admin Dashboard" : ADMIN_TABS.find((tab) => tab.id === activeTab)?.label}</h1>
            </div>

            <div className="admin-topbar-actions">
              <span className="admin-refresh-pill">Last updated just now</span>
              <button className="btn btn-secondary" type="button" onClick={loadAdminData}>
                Refresh Data
              </button>
            </div>
          </header>

          {loading ? <div className="admin-empty">Dang tai du lieu...</div> : null}
          {!loading && error ? <div className="admin-empty admin-empty-error">{error}</div> : null}
          {!loading && !error && notice ? <div className="admin-notice">{notice}</div> : null}

          {!loading && !error && (
            <div className="admin-content-stack">
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
                        <h2>Sales Trends</h2>
                        <div className="admin-chart-tools">
                          <span>Jun 2026</span>
                          <button className="btn btn-secondary" type="button">
                            Export
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
                        <h2>Promotion Performance</h2>
                        <span className="admin-summary-window">Last 7 Days</span>
                      </div>

                      <div className="admin-summary-metrics">
                        <div className="admin-mini-card">
                          <span>Coupon Usage</span>
                          <strong>{dashboard.stats.totalOrders ? "78.2%" : "0%"}</strong>
                          <em>Used in current flow</em>
                        </div>
                        <div className="admin-mini-card">
                          <span>Conversion Rate</span>
                          <strong>{dashboard.stats.totalLeads ? "12.8%" : "0%"}</strong>
                          <em>Lead to order estimate</em>
                        </div>
                        <div className="admin-mini-card">
                          <span>Revenue</span>
                          <strong>{formatCurrency(dashboard.stats.totalRevenue)}</strong>
                          <em>Captured from orders</em>
                        </div>
                        <div className="admin-mini-card">
                          <span>Avg Discount / Order</span>
                          <strong>{dashboard.stats.totalOrders ? "$5.45" : "$0.00"}</strong>
                          <em>Estimated campaign effect</em>
                        </div>
                      </div>

                      <button className="admin-outline-link" type="button" onClick={() => setActiveTab("orders")}>
                        View full order report
                      </button>
                    </article>
                  </section>

                  <section className="admin-overview-grid admin-overview-grid-bottom">
                    <article className="admin-card-panel">
                      <div className="admin-section-head">
                        <h2>Inventory Warnings</h2>
                      </div>

                      <div className="admin-warning-list">
                        {dashboard.lowStockProducts.map((product) => (
                          <div key={product._id} className="admin-warning-item">
                            <div>
                              <strong>{product.name}</strong>
                              <span>{product.brand} - con {product.stock} san pham</span>
                            </div>
                            <div className="admin-warning-bar">
                              <span style={{ width: `${Math.max(8, Math.min(100, product.stock * 12))}%` }} />
                            </div>
                          </div>
                        ))}
                        {!dashboard.lowStockProducts.length ? (
                          <div className="admin-empty-inline">Kho dang an toan, chua co san pham can canh bao.</div>
                        ) : null}
                      </div>
                    </article>

                    <article className="admin-card-panel">
                      <div className="admin-section-head">
                        <h2>Recent Orders</h2>
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
                          <div className="admin-empty-inline">Chua co don hang nao de hien thi.</div>
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
                        <p className="eyebrow">Product studio</p>
                        <h2>{editingProductId ? "Update Product" : "Add New Product"}</h2>
                      </div>

                      <div className="admin-product-builder-actions">
                        <button className="btn btn-secondary" type="button" onClick={resetProductForm}>
                          Save Draft
                        </button>
                        <button className="btn btn-primary" form="admin-product-form" type="submit" disabled={submitting}>
                          {submitting ? "Dang luu..." : editingProductId ? "Update Product" : "Add Product"}
                        </button>
                      </div>
                    </div>

                    <form className="admin-product-layout" id="admin-product-form" onSubmit={handleSubmitProduct}>
                      <div className="admin-product-main">
                        <section className="admin-product-panel">
                          <div className="admin-product-panel-head">
                            <h3>General Information</h3>
                          </div>

                          <div className="admin-product-form-grid">
                            <label className="admin-field">
                              <span>Name Product</span>
                              <input name="name" placeholder="Ten san pham" value={productForm.name} onChange={handleProductFieldChange} required />
                            </label>
                            <label className="admin-field">
                              <span>Slug Product</span>
                              <input name="slug" placeholder="Slug" value={productForm.slug} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field admin-field-span-2">
                              <span>Description Product</span>
                              <textarea name="description" placeholder="Mo ta chi tiet" rows="5" value={productForm.description} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field admin-field-span-2">
                              <span>Short Description</span>
                              <input name="shortDescription" placeholder="Mo ta ngan" value={productForm.shortDescription} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Brand</span>
                              <input name="brand" placeholder="Thuong hieu" value={productForm.brand} onChange={handleProductFieldChange} required />
                            </label>
                            <label className="admin-field">
                              <span>Badge</span>
                              <input name="badge" placeholder="Badge" value={productForm.badge} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>CPU</span>
                              <input name="specs.cpu" placeholder="CPU" value={productForm.specs.cpu} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>RAM</span>
                              <input name="specs.ram" placeholder="RAM" value={productForm.specs.ram} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>SSD</span>
                              <input name="specs.ssd" placeholder="SSD" value={productForm.specs.ssd} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>GPU</span>
                              <input name="specs.gpu" placeholder="GPU" value={productForm.specs.gpu} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field admin-field-span-2">
                              <span>Display</span>
                              <input name="specs.display" placeholder="Man hinh" value={productForm.specs.display} onChange={handleProductFieldChange} />
                            </label>
                          </div>
                        </section>

                        <section className="admin-product-panel">
                          <div className="admin-product-panel-head">
                            <h3>Pricing And Stock</h3>
                          </div>

                          <div className="admin-product-form-grid">
                            <label className="admin-field">
                              <span>Base Pricing</span>
                              <input name="price" placeholder="Gia ban" type="number" value={productForm.price} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Stock</span>
                              <input name="stock" placeholder="Ton kho" type="number" value={productForm.stock} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Old Price</span>
                              <input name="oldPrice" placeholder="Gia cu" type="number" value={productForm.oldPrice} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Rating</span>
                              <input name="rating" placeholder="Rating" type="number" step="0.1" value={productForm.rating} onChange={handleProductFieldChange} />
                            </label>
                            <label className="admin-field">
                              <span>Review Count</span>
                              <input name="reviewCount" placeholder="So danh gia" type="number" value={productForm.reviewCount} onChange={handleProductFieldChange} />
                            </label>
                            <div className="admin-field">
                              <span>Status</span>
                              <div className="admin-boolean-row">
                                <label className="admin-checkbox">
                                  <input name="featured" type="checkbox" checked={productForm.featured} onChange={handleProductFieldChange} />
                                  <span>Featured</span>
                                </label>
                                <label className="admin-checkbox">
                                  <input name="isActive" type="checkbox" checked={productForm.isActive} onChange={handleProductFieldChange} />
                                  <span>Active</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>

                      <div className="admin-product-side">
                        <section className="admin-product-panel">
                          <div className="admin-product-panel-head">
                            <h3>Upload Img</h3>
                          </div>

                          <div className="admin-product-image-stage">
                            {productForm.image ? (
                              <img src={productForm.image} alt={productForm.name || "Preview san pham"} />
                            ) : (
                              <div className="admin-product-image-empty">
                                <strong>No Image</strong>
                                <span>Nhap URL anh de xem truoc</span>
                              </div>
                            )}
                          </div>

                          <label className="admin-field">
                            <span>Image URL</span>
                            <input name="image" placeholder="URL anh" value={productForm.image} onChange={handleProductFieldChange} />
                          </label>

                          <div className="admin-product-thumbs">
                            {[1, 2, 3].map((index) => (
                              <div key={index} className="admin-product-thumb">
                                {productForm.image ? <img src={productForm.image} alt={`Preview ${index}`} /> : <span>+</span>}
                              </div>
                            ))}
                            <div className="admin-product-thumb admin-product-thumb-add">
                              <span>+</span>
                            </div>
                          </div>
                        </section>

                        <section className="admin-product-panel">
                          <div className="admin-product-panel-head">
                            <h3>Category</h3>
                          </div>

                          <div className="admin-product-form-grid admin-product-form-grid-single">
                            <label className="admin-field">
                              <span>Product Category</span>
                              <input name="category" placeholder="Danh muc" value={productForm.category} onChange={handleProductFieldChange} required />
                            </label>
                            <button className="btn btn-secondary admin-category-helper" type="button">
                              Add Category
                            </button>
                          </div>
                        </section>
                      </div>
                    </form>
                  </section>

                  <section className="admin-card-panel">
                    <div className="admin-section-head">
                      <h2>Danh sach san pham</h2>
                    </div>
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>San pham</th>
                            <th>Gia</th>
                            <th>Ton kho</th>
                            <th>Trang thai</th>
                            <th>Thao tac</th>
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
                                <span>{product.oldPrice ? formatCurrency(product.oldPrice) : "Khong co gia cu"}</span>
                              </td>
                              <td>{product.stock}</td>
                              <td>{product.isActive ? "Dang ban" : "Da an"}</td>
                              <td>
                                <div className="admin-row-actions">
                                  <button className="btn btn-secondary" type="button" onClick={() => handleEditProduct(product)}>
                                    Sua
                                  </button>
                                  <button className="btn btn-secondary" type="button" onClick={() => handleToggleProductStatus(product)}>
                                    {product.isActive ? "An san pham" : "Hien lai"}
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
                    <h2>Quan ly don hang</h2>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Khach hang</th>
                          <th>Lien he</th>
                          <th>Thanh toan</th>
                          <th>Trang thai</th>
                          <th>Ngay tao</th>
                          <th>Thao tac</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td>
                              <strong>{order.customer?.fullName}</strong>
                              <span>{order.items?.length || 0} san pham</span>
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
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>
                              <button className="btn btn-secondary" type="button" onClick={() => handleOrderStatusSave(order._id)}>
                                Luu
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
                      <h2>Tao tai khoan moi</h2>
                    </div>
                    <form className="admin-form-grid" onSubmit={handleCreateUser}>
                      <input name="fullName" placeholder="Ho ten" value={newUserForm.fullName} onChange={handleNewUserFieldChange} required />
                      <input name="email" placeholder="Email" type="email" value={newUserForm.email} onChange={handleNewUserFieldChange} required />
                      <input name="password" placeholder="Mat khau" type="password" value={newUserForm.password} onChange={handleNewUserFieldChange} required />
                      <select name="role" value={newUserForm.role} onChange={handleNewUserFieldChange}>
                        {USER_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <button className="btn btn-primary admin-form-span-2" type="submit" disabled={submitting}>
                        {submitting ? "Dang tao..." : "Tao tai khoan"}
                      </button>
                    </form>
                  </section>

                  <section className="admin-card-panel">
                    <div className="admin-section-head">
                      <h2>Danh sach tai khoan</h2>
                    </div>
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Ho ten</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Trang thai</th>
                            <th>Reset mat khau</th>
                            <th>Thao tac</th>
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
                                    <option key={role} value={role}>
                                      {role}
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
                                  <option value="true">Active</option>
                                  <option value="false">Locked</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  className="admin-inline-input"
                                  placeholder="Bo trong neu khong doi"
                                  type="password"
                                  value={userDrafts[item.id]?.password || ""}
                                  onChange={(event) => handleUserDraftChange(item.id, "password", event.target.value)}
                                />
                              </td>
                              <td>
                                <button className="btn btn-secondary" type="button" onClick={() => handleSaveUser(item.id)}>
                                  Luu
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
                    <h2>Danh sach lead</h2>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Khach hang</th>
                          <th>Thong tin</th>
                          <th>Dich vu</th>
                          <th>Noi dung</th>
                          <th>Trang thai</th>
                          <th>Thao tac</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead._id}>
                            <td>
                              <strong>{lead.fullName}</strong>
                              <span>{lead.companyName || "Chua co cong ty"}</span>
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
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <button className="btn btn-secondary" type="button" onClick={() => handleLeadStatusSave(lead._id)}>
                                Luu
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
