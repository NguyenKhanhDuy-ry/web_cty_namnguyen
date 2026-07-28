const sampleProducts = [
  {
    slug: "asus-rog-strix-g16-2024",
    brand: "ASUS",
    category: "Gaming",
    name: "ASUS ROG Strix G16 2024",
    shortDescription: "Laptop gaming cao cấp với RTX 4080 và màn hình 240Hz.",
    description: "Mẫu laptop gaming hiệu năng cao dành cho streamer, game thủ và designer cần GPU mạnh.",
    price: 52990000,
    oldPrice: 62990000,
    stock: 12,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    badge: "HOT",
    rating: 4.9,
    reviewCount: 248,
    featured: true,
    specs: {
      cpu: "i9-14900HX",
      ram: "32GB DDR5",
      ssd: "1TB NVMe",
      gpu: "RTX 4080 12GB",
      display: '16" QHD+ 240Hz'
    },
    isActive: true
  },
  {
    slug: "msi-raider-ge78-hx",
    brand: "MSI",
    category: "Gaming",
    name: "MSI Raider GE78 HX",
    shortDescription: "Gaming flagship với RTX 4090, RAM 64GB.",
    description: "Phù hợp nhu cầu render, stream và chơi game AAA ở mức setting cao.",
    price: 79990000,
    oldPrice: 88990000,
    stock: 8,
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    badge: "NEW",
    rating: 4.8,
    reviewCount: 167,
    featured: true,
    specs: {
      cpu: "i9-14900HX",
      ram: "64GB DDR5",
      ssd: "2TB NVMe",
      gpu: "RTX 4090 16GB",
      display: '17.3" QHD 240Hz'
    },
    isActive: true
  },
  {
    slug: "apple-macbook-pro-16-m4-max",
    brand: "APPLE",
    category: "MacBook",
    name: 'Apple MacBook Pro 16" M4 Max',
    shortDescription: "MacBook Pro cao cấp cho editor và dev.",
    description: "Chip M4 Max mạnh mẽ, màn hình Liquid Retina XDR và thời lượng pin ấn tượng.",
    price: 89990000,
    oldPrice: 95990000,
    stock: 10,
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80",
    badge: "PREMIUM",
    rating: 4.9,
    reviewCount: 412,
    featured: true,
    specs: {
      cpu: "M4 Max 16-core",
      ram: "48GB Unified",
      ssd: "1TB SSD",
      gpu: "40-core GPU",
      display: '16" Liquid Retina XDR'
    },
    isActive: true
  },
  {
    slug: "dell-xps-15-9530",
    brand: "DELL",
    category: "Văn phòng",
    name: "Dell XPS 15 9530",
    shortDescription: "Ultrabook mạnh mẽ cho công việc và sáng tạo.",
    description: "Thiết kế đẹp, màn OLED sắc nét, phù hợp văn phòng và xử lý đồ họa nhẹ.",
    price: 42990000,
    oldPrice: 51990000,
    stock: 15,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&q=80",
    badge: "SALE",
    rating: 4.7,
    reviewCount: 189,
    featured: true,
    specs: {
      cpu: "i7-13700H",
      ram: "32GB LPDDR5",
      ssd: "512GB NVMe",
      gpu: "RTX 4060 8GB",
      display: '15.6" OLED 3.5K'
    },
    isActive: true
  },
  {
    slug: "lenovo-yoga-slim-7i",
    brand: "LENOVO",
    category: "Văn phòng",
    name: "Lenovo Yoga Slim 7i",
    shortDescription: "Mỏng nhẹ, pin tốt, phù hợp sinh viên và nhân viên văn phòng.",
    description: "Máy đẹp, gọn, pin dài và đủ hiệu năng cho công việc hằng ngày.",
    price: 23990000,
    oldPrice: 26990000,
    stock: 22,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
    badge: "OFFICE",
    rating: 4.6,
    reviewCount: 93,
    featured: false,
    specs: {
      cpu: "Core Ultra 7",
      ram: "16GB LPDDR5X",
      ssd: "512GB SSD",
      gpu: "Intel Arc",
      display: '14" 2.8K OLED'
    },
    isActive: true
  },
  {
    slug: "acer-predator-helios-neo-16",
    brand: "ACER",
    category: "Gaming",
    name: "Acer Predator Helios Neo 16",
    shortDescription: "Gaming cân bằng giá và hiệu năng.",
    description: "Lựa chọn hợp lý cho game thủ cần hiệu năng mạnh và giá dễ tiếp cận hơn.",
    price: 33990000,
    oldPrice: 37990000,
    stock: 14,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
    badge: "VALUE",
    rating: 4.7,
    reviewCount: 121,
    featured: false,
    specs: {
      cpu: "i7-14700HX",
      ram: "16GB DDR5",
      ssd: "1TB NVMe",
      gpu: "RTX 4070 8GB",
      display: '16" 240Hz'
    },
    isActive: true
  }
];

module.exports = sampleProducts;
