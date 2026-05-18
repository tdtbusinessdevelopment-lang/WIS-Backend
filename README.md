# 📦 WIS Backend — Warehouse Inventory System

> **For the next OJT/Developer:** This README will walk you through everything you need to know to understand, run, and connect this backend to a frontend. Read it fully before touching any code.

---

## 🗂️ What Is This Project?

**WIS (Warehouse Inventory System)** is a REST API backend built for **TDT Powersteel**. It manages warehouse operations including:

- Stock ledger tracking
- SKU/product master list
- Purchase orders & PO receipts
- Locations management
- Ending inventory
- Backload inventory & deliveries
- Return inventory
- Advance customer POs

Built with **Node.js + Express**, connected to a **Supabase** PostgreSQL database.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server & REST API |
| Supabase (`@supabase/supabase-js`) | Database (PostgreSQL) + Auth |
| dotenv | Environment variable management |
| helmet | Security HTTP headers |
| morgan | HTTP request logging |
| cors | Cross-Origin Resource Sharing |
| express-validator | Request input validation |
| nodemon | Auto-restart in development |

---

## 📁 Project Structure

```
wis-backend/
├── server.js                  # Entry point — starts the server
├── .env                       # Your actual secrets (never share this)
├── .env.example               # Template for .env — copy this first
├── package.json
└── src/
    ├── app.js                 # Express setup (middleware, routes, CORS)
    ├── config/
    │   └── supabase.js        # Supabase client initialization
    ├── middleware/
    │   ├── auth.js            # JWT authentication middleware
    │   └── errorHandler.js    # Global error handler
    ├── routes/
    │   ├── index.js           # Aggregates all routes under /api
    │   ├── stockLedger.js
    │   ├── locations.js
    │   ├── skuMaster.js
    │   ├── purchaseOrders.js
    │   ├── endingInventory.js
    │   ├── advanceCustomerPo.js
    │   ├── backloadInventory.js
    │   ├── backloadDeliveries.js
    │   └── returnInventory.js
    ├── controllers/           # Business logic for each route
    │   ├── stockLedgerController.js
    │   ├── locationsController.js
    │   ├── skuMasterController.js
    │   ├── purchaseOrdersController.js
    │   ├── poReceiptsController.js
    │   ├── endingInventoryController.js
    │   ├── advanceCustomerPoController.js
    │   ├── backloadInventoryController.js
    │   ├── backloadDeliveriesController.js
    │   └── returnInventoryController.js
    └── services/
        └── averageCosting.js  # Average cost calculation logic
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/tdtbusinessdevelopment-lang/WIS-Backend.git
cd WIS-Backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
# Copy the example file
copy .env.example .env
```

Then open `.env` and fill in your actual Supabase credentials (see the section below).

### 4. Run the development server
```bash
npm run dev
```

You should see:
```
🚀 WIS Backend running on http://localhost:3000
   Health check: http://localhost:3000/health
   API base:     http://localhost:3000/api
```

---

## 🔐 Environment Variables (`.env`)

```env
# Your Supabase project URL
# Found in: Supabase Dashboard → Project Settings → API → Project URL
SUPABASE_URL=https://your-project-id.supabase.co

# Supabase public/anon key (safe for client use with RLS enabled)
# Found in: Supabase Dashboard → Project Settings → API → anon public
SUPABASE_ANON_KEY=your-anon-key-here

# Supabase service role key (BYPASSES Row Level Security — server-side only!)
# Found in: Supabase Dashboard → Project Settings → API → service_role secret
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT secret for verifying tokens
# Found in: Supabase Dashboard → Project Settings → API → JWT Secret
SUPABASE_JWT_SECRET=your-jwt-secret-here

# Server port (default: 3000)
PORT=3000

# Allowed frontend origins (comma-separated, no spaces)
# Add your frontend's URL here so CORS doesn't block it
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001
```

> ⚠️ **Never commit your real `.env` to GitHub.** Only `.env.example` (with blank values) should be shared.

---

## 🌐 API Endpoints

All routes are prefixed with `/api`. All routes require authentication (see Auth section below).

### Health Check (No auth needed)
```
GET /health
```

### Stock Ledger — `/api/stock-ledger`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stock-ledger` | Get all stock ledger entries |
| GET | `/api/stock-ledger/:id` | Get a single entry by ID |
| POST | `/api/stock-ledger` | Create a new entry |

### Locations — `/api/locations`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/locations` | Get all locations |
| GET | `/api/locations/:id` | Get a single location |
| POST | `/api/locations` | Create a location |
| PUT | `/api/locations/:id` | Update a location |
| DELETE | `/api/locations/:id` | Delete a location |

### SKU Master — `/api/sku-master`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/sku-master` | Get all SKUs |
| GET | `/api/sku-master/:id` | Get a single SKU |
| POST | `/api/sku-master` | Create a SKU |
| PUT | `/api/sku-master/:id` | Update a SKU |
| DELETE | `/api/sku-master/:id` | Delete a SKU |

### Purchase Orders — `/api/purchase-orders`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/purchase-orders` | Get all POs |
| GET | `/api/purchase-orders/:id` | Get a single PO |
| POST | `/api/purchase-orders` | Create a PO |
| PUT | `/api/purchase-orders/:id` | Update a PO |

### Other Routes (same GET/POST/PUT/DELETE pattern)
- `/api/ending-inventory`
- `/api/advance-customer-po`
- `/api/backload-inventory`
- `/api/backload-deliveries`
- `/api/return-inventory`

---

## 🔒 Authentication

This backend uses **Supabase JWT authentication**.

### How it works:
1. The frontend logs in the user via Supabase Auth (e.g., `supabase.auth.signInWithPassword(...)`)
2. Supabase returns an `access_token`
3. The frontend sends this token in **every API request** via the `Authorization` header

### Required header for all protected routes:
```
Authorization: Bearer <supabase_access_token>
```

### Development Mode (Auth Bypass)
When `NODE_ENV` is **not** set to `production`, authentication is **bypassed automatically** — all requests are treated as a test user. This lets you test with Postman without logging in.

When deploying to production, set:
```env
NODE_ENV=production
```
This enables real JWT verification.

---

## 🔗 Connecting a Frontend

### Step 1 — Install Supabase in your frontend
```bash
npm install @supabase/supabase-js
```

### Step 2 — Initialize Supabase in your frontend
```js
// lib/supabase.js (in your frontend project)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project-id.supabase.co',   // same SUPABASE_URL
  'your-anon-key-here'                     // same SUPABASE_ANON_KEY
)

export default supabase
```

### Step 3 — Log in and get a token
```js
import supabase from './lib/supabase'

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

const token = data.session.access_token  // save this
```

### Step 4 — Call the WIS Backend API
```js
// Example: fetch all locations
const response = await fetch('http://localhost:3000/api/locations', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

const data = await response.json()
console.log(data)
```

### Step 5 — Update ALLOWED_ORIGINS in `.env`
Add your frontend's URL so CORS allows it:
```env
# For a React/Vite app running on port 5173:
ALLOWED_ORIGINS=http://localhost:5173

# For production:
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

---

## 🧪 Testing with Postman

1. Open Postman
2. Set base URL to `http://localhost:3000`
3. In development (no `NODE_ENV=production`), **no auth header is needed**
4. Example request:
   - `GET http://localhost:3000/api/locations`
   - `GET http://localhost:3000/health`

---

## 📋 npm Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-restart on file changes) |
| `npm start` | Start without nodemon (production) |

---

## ➕ How to Add a New Feature/Route

Follow this pattern used throughout the project:

1. **Create a controller** in `src/controllers/yourFeatureController.js`
2. **Create a route file** in `src/routes/yourFeature.js`
3. **Register the route** in `src/routes/index.js`:
   ```js
   router.use('/your-feature', require('./yourFeature'));
   ```

That's it! The new route will automatically be available at `/api/your-feature`.

---

## 🗄️ Database (Supabase)

- The database is hosted on **Supabase** (managed PostgreSQL)
- Tables mirror the route names: `stock_ledger`, `locations`, `sku_master`, etc.
- Login to [supabase.com](https://supabase.com) with the company account to view/edit the schema
- Ask the previous developer or supervisor for the Supabase project credentials

---

## 👤 Original Developer

Developed by **Kaiz Bautista** — OJT Intern at TDT Powersteel  
Turnover Date: May 2026

---

*For questions about the codebase, check the inline comments in each file — every file is documented.*
