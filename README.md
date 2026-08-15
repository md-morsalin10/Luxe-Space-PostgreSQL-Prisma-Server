```markdown
# 🚀 LuxeSpace - Premium Property Booking & Rental Management API

LuxeSpace is a robust, modern, scalable RESTful API built to power the LuxeSpace luxury property booking and rental management platform. It handles user authentication, role-based access control (Admin, Buyer, Seller), property listings management, bookings, session management, and secure payment integrations.

---

## 🛠️ Tech Stack & Architecture

- **Runtime Environment:** [Node.js](https://nodejs.org/) (v18+ / v20+)
- **Framework:** [Express.js](https://expressjs.com/) (Fast, unopinionated web framework for Node.js)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strongly typed JavaScript for scalable server-side development)
- **Database & ORM:** 
  - **PostgreSQL** (Relational Database management)
  - **Prisma ORM** (Type-safe database client & schema migrations)
- **Hosting & Deployment:** [Render](https://render.com/)
- **Database Management & Inspection:** [pgAdmin 4](https://www.pgadmin.org/)

---

## 🔥 Key Features

- 🔐 **Authentication & Security:** Secure JWT-based authentication, password hashing with bcrypt, and CORS configuration for safe cross-origin requests.
- 👑 **Role-Based Access Control (RBAC):** Distinct privileges for `admin`, `seller`, and `buyer` roles.
- 🏠 **Property Management:** Complete CRUD operations for adding, updating, retrieving, and deleting luxury property listings.
- 📅 **Booking Management:** Real-time booking creation, reservation tracking, and status updates for properties.
- 💳 **Payment Integration:** Integrated payment processing flow (Stripe API support).
- ⚡ **Type-Safe Database Access:** Prisma ORM schema design ensuring type consistency across models (`User`, `Property`, `Booking`, `Session`, `Account`).

---

## 📦 Installed Packages & Dependencies

### Core Dependencies (`dependencies`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `express` | `^4.x` | Core HTTP web framework |
| `@prisma/client` | `^5.x` | Auto-generated type-safe database query builder |
| `dotenv` | `^16.x` | Loads environment variables from `.env` file |
| `cors` | `^2.x` | Enables Cross-Origin Resource Sharing with the frontend |
| `jsonwebtoken` | `^9.x` | Generates and verifies JWT tokens for user authentication |
| `bcrypt` / `bcryptjs` | `^2.x` / `^5.x` | Password hashing and verification |
| `cookie-parser` | `^1.x` | Parses HTTP request cookies for session/token management |
| `stripe` | `^14.x` | Handles online payments and checkout sessions |
| `zod` | `^3.x` | Schema validation for API request body/params |

### Development Dependencies (`devDependencies`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `typescript` | `^5.x` | TypeScript compiler |
| `prisma` | `^5.x` | Prisma CLI for database migrations, introspections & studio |
| `ts-node-dev` / `tsx` | `^2.x` | Live reload development server for TypeScript |
| `@types/express` | `^4.x` | Type definitions for Express |
| `@types/node` | `^20.x` | Type definitions for Node.js |
| `@types/cors` | `^2.x` | Type definitions for CORS |
| `@types/jsonwebtoken` | `^9.x` | Type definitions for JWT |
| `@types/bcrypt` / `@types/bcryptjs` | `^2.x` | Type definitions for Bcrypt |

---

## 🗄️ Database Schema Overview (Prisma Models)

The backend interacts with PostgreSQL using the following key models defined in `prisma/schema.prisma`:

- **`User`**: Manages user profiles, credentials, role assignments (`admin`, `seller`, `buyer`), and relations.
- **`Account`**: OAuth / third-party account linking provider metadata.
- **`Session`**: User session tracking and authentication tokens.
- **`Property`**: Luxury property metadata (Title, Location, Description, Price, Images, Category, Seller ID).
- **`Booking`**: Booking reservations linking Buyers, Properties, dates, and booking status.

---

## 🚀 Getting Started (Local Setup)

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- **Node.js** (v18.x or v20.x recommended)
- **npm** (v9+) / **yarn** / **pnpm**
- **PostgreSQL Database** (Installed locally OR hosted online via Render / Supabase / Neon)
- **Git**

---

### 2. Clone the Repository
Open your terminal and clone the backend repository to your local system:

```bash
git clone [https://github.com/md-morsalin10/luxespace-backend.git](https://github.com/md-morsalin10/Luxe-Space-PostgreSQL-Prisma-Server)
cd luxespace-backend

```

---

### 3. Install Dependencies

Install all required production and development packages:

```bash
npm install

```

---

### 4. Environment Variables Setup

Create a `.env` file in the root directory of your project:

```bash
touch .env

```

Add the following environment variables to your `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection (PostgreSQL)
# Replace with your local or hosted PostgreSQL connection string
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>?sslmode=require"

# Authentication / JWT
JWT_SECRET=your_super_secret_jwt_private_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Stripe Payment Gateway (Optional / Testing)
STRIPE_SECRET_KEY=sk_test_51Nx...
STRIPE_WEBHOOK_SECRET=whsec_...

```

---

### 5. Database Initialization & Prisma Setup

Run Prisma migration and sync your PostgreSQL database with the defined schema:

```bash
# Push schema directly to your database
npx prisma db push

# Generate Prisma Client for type safety
npx prisma generate

# (Optional) Launch Prisma Studio to visually manage database rows
npx prisma studio

```

---

### 6. Run the Development Server

Start the Node.js server with live reloading enabled:

```bash
# Development Mode (auto-reload on save)
npm run dev

```

Your backend server will start running at:
`http://localhost:5000`

---

### 7. Build for Production

To test or build the compiled TypeScript code for production:

```bash
# Compile TypeScript to JavaScript (dist folder)
npm run build

# Run production server
npm start

```

---

## 📡 Deployment (Render)

This backend is optimized for deployment on **Render**.

1. Connect your GitHub repository to **Render Web Services**.
2. Set the Environment as **Node**.
3. **Build Command:**
```bash
npm install && npx prisma generate && npm run build

```


4. **Start Command:**
```bash
npm start

```


5. Add all `.env` key-value pairs (`DATABASE_URL`, `JWT_SECRET`, etc.) under the **Environment Variables** tab in your Render Dashboard.

---

## 👨‍💻 Author

* **Md. Morsalin** - Full-Stack Developer
* Project: **LuxeSpace**

```

```