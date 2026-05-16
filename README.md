<div align="center">
  <h1>🍔 QuickBite — Food Ordering & Delivery Platform</h1>
  <p><strong>Frontend Application</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Zustand-5-764ABC?style=for-the-badge&logo=react&logoColor=white" />
  </p>
  
  <p>
    Giao diện đặt món & giao hàng hiện đại, responsive cho cả web và mobile,<br>
    được xây dựng với React 19 và thiết kế premium UI/UX.
  </p>

  <p>
    <a href="https://github.com/quydat2710/quickbite-be">Backend Repository →</a>
  </p>
</div>

---

## ✨ Tính Năng

### 🏠 Customer Pages
| Trang | Mô tả |
|-------|-------|
| **Home** | Hero section, danh mục, nhà hàng nổi bật, khuyến mãi |
| **Search** | Tìm kiếm nhà hàng, bộ lọc theo danh mục |
| **Restaurant Detail** | Menu, đánh giá, thông tin quán, thêm vào giỏ |
| **Cart** | Giỏ hàng, chỉnh số lượng, xoá item |
| **Checkout** | Chọn địa chỉ, phương thức thanh toán, ghi chú |
| **Order Tracking** | Theo dõi trạng thái đơn hàng realtime |
| **Orders** | Lịch sử đơn hàng |
| **Profile** | Thông tin cá nhân, avatar |
| **Addresses** | Quản lý địa chỉ giao hàng |
| **Promotions** | Khuyến mãi & voucher |
| **Favorites** | Nhà hàng yêu thích |
| **Notifications** | Thông báo đơn hàng |

### 🔐 Auth Pages
| Trang | Mô tả |
|-------|-------|
| **Login** | Đăng nhập phone/password + Social login |
| **Register** | Đăng ký tài khoản mới |
| **Forgot Password** | Khôi phục mật khẩu |

### 🧩 UI Components
| Component | Mô tả |
|-----------|-------|
| Button | Variants: primary, secondary, outline, ghost |
| Input | Form input với validation |
| Modal | Dialog/popup component |
| Badge | Status badges |
| Chip | Filter chips |
| Skeleton | Loading placeholder |
| QuantityStepper | +/- counter |
| RestaurantCard | Card hiển thị nhà hàng |

---

## 🛠 Tech Stack

| Layer | Technology | Vai trò |
|-------|-----------|---------|
| **UI Framework** | React 19 | Component-based UI |
| **Build Tool** | Vite 8 | Fast HMR & bundling |
| **Styling** | TailwindCSS 4 | Utility-first CSS |
| **Language** | TypeScript 6 | Type safety |
| **State** | Zustand 5 | Global state management |
| **Data Fetching** | TanStack React Query | Server state & caching |
| **HTTP** | Axios | API client |
| **Routing** | React Router 7 | SPA navigation |
| **Real-time** | Socket.io Client | WebSocket connection |
| **Icons** | Lucide React | Icon library |
| **Utils** | clsx + tailwind-merge | Class merging |

---

## 📁 Cấu Trúc Thư Mục

```
quickbite-fe/
├── public/
│   ├── favicon.svg
│   ├── hero-banner.png
│   └── logo_quickbite.png
│
├── src/
│   ├── assets/
│   │   └── categories/           # Category icons (16 images)
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── QuantityStepper.tsx
│   │   └── restaurant/
│   │       └── RestaurantCard.tsx
│   │
│   ├── pages/
│   │   ├── auth/                 # Login, Register, ForgotPassword
│   │   └── customer/             # All customer-facing pages
│   │       ├── HomePage.tsx
│   │       ├── SearchPage.tsx
│   │       ├── RestaurantDetailPage.tsx
│   │       ├── CartPage.tsx
│   │       ├── CheckoutPage.tsx
│   │       ├── OrderTrackingPage.tsx
│   │       ├── OrdersPage.tsx
│   │       ├── ProfilePage.tsx
│   │       ├── AddressesPage.tsx
│   │       ├── FavoritesPage.tsx
│   │       ├── PromotionsPage.tsx
│   │       └── NotificationsPage.tsx
│   │
│   ├── layouts/
│   │   └── CustomerLayout.tsx    # Shared layout with nav
│   │
│   ├── stores/
│   │   └── index.ts              # Zustand stores
│   │
│   ├── data/
│   │   └── mock.ts               # Mock data for development
│   │
│   ├── lib/
│   │   ├── api.ts                # Axios instance
│   │   └── utils.ts              # Utility functions
│   │
│   ├── router.tsx                # Route definitions
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles + design tokens
│
├── vite.config.ts                # Vite + proxy config
├── tsconfig.json
└── package.json
```

---

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- **Node.js** 20+
- **Backend** đang chạy tại `localhost:3000` ([quickbite-be](https://github.com/quydat2710/quickbite-be))

### Cài Đặt

```bash
git clone https://github.com/quydat2710/quickbite-fe.git
cd quickbite-fe
npm install
npm run dev
```

👉 Mở **http://localhost:3100**

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3100, HMR) |
| `npm run build` | Production build |
| `npm run preview` | Preview production |
| `npm run lint` | ESLint check |

---

## 🔗 Kết Nối Backend

Frontend tự động proxy requests đến backend qua Vite config:

```typescript
// vite.config.ts
server: {
  port: 3100,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

---

## 🗺 Roadmap

- [x] Customer pages (Home, Search, Cart, Checkout, Orders)
- [x] Auth flows (Login, Register, Forgot Password)
- [x] Responsive design (Web + Mobile)
- [x] UI component library
- [ ] Restaurant Owner dashboard
- [ ] Delivery Driver interface
- [ ] Admin panel
- [ ] Real-time order tracking (WebSocket)
- [ ] Push notifications
- [ ] Dark mode

---

## 👨‍💻 Tác Giả

**Quy Dat** — [@quydat2710](https://github.com/quydat2710)

> Full-stack Developer | React | NestJS Microservices

---

## 📄 License

MIT License
