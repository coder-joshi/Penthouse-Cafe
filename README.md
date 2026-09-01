<h1 align="center">Penthouse Cafe ☕</h1>
<p align="center">
  <strong>A modern MERN stack QR-ordering web app for restaurants.</strong><br>
  <em>Guests scan, order, and track live. Admins manage menus and incoming orders in real-time.</em>
</p>

---

## 📖 Overview
Penthouse Cafe is an end-to-end restaurant ordering solution built to streamline the dine-in experience. 
- **Guest Flow**: A guest scans a QR code at their table (`/r/:restaurantSlug/t/:tableNumber`), fills out a brief info form (name, email, phone, couple status), and unlocks the digital menu. They can add items to their cart, place their order, and watch live status updates directly from their phone.
- **Admin Flow**: Restaurant staff log into a secure dashboard to view live incoming orders, manage the menu (add, update, delete, or toggle availability), and view guest data. 

---

## ✨ Key Features
- **QR Table Entry**: Dynamic URLs mapping directly to specific tables.
- **Guest Capture Form**: Captures customer details for loyalty and CRM before allowing menu access.
- **Real-Time Order Tracking**: Bi-directional Websocket connections keep both the kitchen and the guest updated instantly.
- **Cart & Checkout system**: Complete client-side cart state management.
- **Admin Dashboard**: Live order management, guest history, and menu CRUD operations.
- **Dual Authentication**: 
  - *Guests* are tracked via sessions.
  - *Admins* use secure JWT-based authentication (Access & Refresh tokens).

---

## 🛠 Tech Stack

| Layer | Technologies Used |
| --- | --- |
| **Frontend** | React (v19), React Router DOM (v7), Vite, TailwindCSS (v4), Zustand (State Management), Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (via Mongoose v9) |
| **Real-time** | Socket.io (Client v4.8 & Server v4.8) |
| **Auth & Security** | JWT (jsonwebtoken), bcryptjs, cookie-parser, Joi (Validation) |

---

## 🏗 Architecture

The app separates the frontend presentation layer from the backend REST API, connected via HTTP for standard data fetching and WebSockets for real-time order updates.

```mermaid
graph TD
    Client[Guest / Admin Browser]
    Vite[Frontend - React + Vite]
    Express[Backend - Node.js + Express]
    Mongo[(MongoDB)]
    
    Client <-->|HTTPS (REST)| Vite
    Client <-->|WebSockets (Socket.io)| Express
    Vite <-->|API Calls (Axios)| Express
    Express <-->|Mongoose ODM| Mongo

    subgraph Auth Flows
        GAuth[Guest: Session/Token based]
        AAuth[Admin: JWT Access + Refresh]
    end
```

---

## 📂 Folder Structure

```text
├── backend/
│   ├── src/
│   │   ├── common/         # DB config, Socket.io setup
│   │   ├── modules/        # Domain-driven feature modules
│   │   │   ├── auth/       # Admin auth controllers & routes
│   │   │   ├── cart/       # Cart management
│   │   │   ├── guest/      # Guest registration & listing
│   │   │   ├── menu/       # Menu CRUD
│   │   │   └── order/      # Order processing
│   │   ├── utils/          # Helpers (Error handling, etc.)
│   │   └── app.js          # Express app setup & CORS
│   ├── checkOrders.js      # Utility script
│   ├── seedAdmin.js        # Admin seeder script
│   ├── server.js           # Entry point (HTTP + Socket server)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/         # Static images/icons
│   │   ├── components/     # Reusable UI components
│   │   ├── data/           # Mock data / constants
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Layout wrappers (RestaurantLayout, etc.)
│   │   ├── lib/            # Axios instance, utils
│   │   ├── pages/          # Route components (MenuPage, AdminDashboard, etc.)
│   │   ├── router.tsx      # React Router configuration
│   │   ├── store/          # Zustand state stores
│   │   ├── index.css       # Tailwind entry
│   │   └── main.tsx        # React entry
│   ├── vercel.json         # Vercel SPA routing config
│   ├── vite.config.ts      # Vite configuration
│   └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/penthouse-cafe
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Seed the initial admin user and start the server:
```bash
node seedAdmin.js
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:4000
```

Start the development server:
```bash
npm run dev
```

---

## 📡 API Reference & WebSockets

### REST Endpoints
| Method | Route | Auth Required | Purpose |
| ------ | ----- | ------------- | ------- |
| **POST** | `/api/v1/auth/login` | None | Admin login |
| **POST** | `/api/v1/guests/register` | None | Register a guest at a table |
| **GET** | `/api/v1/guests/` | Admin | List all registered guests |
| **GET** | `/api/v1/menu/` | None | Fetch all menu items |
| **POST** | `/api/v1/menu/` | Admin | Create a new menu item |
| **PATCH**| `/api/v1/menu/:id/toggle`| Admin | Toggle item availability |
| **POST** | `/api/v1/orders/` | Guest | Place a new order |
| **GET** | `/api/v1/orders/` | Admin | List all live/history orders |
| **PATCH**| `/api/v1/orders/:orderId/status`| Admin | Update order status |

### WebSocket Events (`Socket.io`)
- **Connection Rooms**: 
  - Admins join the `"admin"` room.
  - Guests join a table-specific room `"table-<tableNumber>"`.
- **Events Emitted by Server**:
  - `order:new` (to `admin` room): Payload contains the full new order object.
  - `order:status` (to `table-<tableNumber>` room): Payload `{ orderId, status }` to notify guests of progress (e.g., "Preparing", "Served").

---

## 📸 Screenshots
*(Drop your screenshots here)*

- **Guest Mobile View (Menu & Cart)**
  `![Guest View](./path-to-image)`
- **Admin Dashboard (Live Orders)**
  `![Admin Dashboard](./path-to-image)`

---

## ☁️ Deployment

- **Frontend (Vercel)**: The frontend is configured for seamless deployment on Vercel. A `vercel.json` file is included to rewrite all routes to `index.html` to prevent 404 errors on refresh. Remember to set the `VITE_API_URL` environment variable to your production backend URL.
- **Backend (Render / Heroku / VPS)**: Deploy as a standard Node.js web service. Ensure the `FRONTEND_URL` environment variable is set to allow CORS requests from your deployed frontend. A `/ping` route is available if using a free tier service that sleeps (e.g., Render) to keep the service alive via cron-jobs.

---

## 🛣 Roadmap
- [ ] Integration with a Payment Gateway (Stripe/Razorpay) for direct digital payments.
- [ ] Push notifications for guests when orders are ready.
- [ ] Admin sales analytics and exportable CSV reports.

---

## 📄 License
This project is licensed under the ISC License.

---
*Built with ❤️ for seamless dining experiences.*
