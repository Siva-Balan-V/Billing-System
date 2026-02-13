# 🧾 Billing System

A full-stack MERN (MongoDB, Express, React, Node.js) billing and invoice management system with user authentication, customer management, product inventory, and invoice generation capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### User Management
- 🔐 User registration and authentication
- 🔑 JWT-based secure authentication
- 👤 Password hashing with bcryptjs

### Customer Management
- ➕ Add, edit, and delete customers
- 📝 Store customer details (name, email, phone, address)
- 📊 View customer list with search functionality

### Product Management
- 📦 Add, edit, and delete products
- 💰 Track product prices and descriptions
- 🔍 Search and filter products

### Invoice Management
- 📄 Create professional invoices
- 🧾 Add multiple items to invoices
- 💵 Automatic total calculation
- 📅 Track invoice dates and status
- 🔎 View and manage all invoices
- 📊 Dashboard with invoice statistics

### Dashboard
- 📈 Real-time statistics
- 📊 Overview of customers, products, and invoices
- 🎯 Quick access to all features

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Siva-Balan-V/Billing-System.git
cd Billing-System
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ALLOWED_ORIGINS=http://localhost:3000
NODE_ENV=development
```

**MongoDB Setup:**
- For local MongoDB: `mongodb://localhost:27017/billing-system`
- For MongoDB Atlas: Get your connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm start
```

The React app will open automatically at `http://localhost:3000`

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Start Backend in Production

```bash
cd backend
npm start
```

## 📁 Project Structure

```
Billing-System/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── productController.js
│   │   └── invoiceController.js
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Customer.js
│   │   ├── Product.js
│   │   └── Invoice.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── productRoutes.js
│   │   └── invoiceRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js              # Express server entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Products.jsx
│   │   │   └── Invoices.jsx
│   │   ├── services/
│   │   │   └── api.js         # API service configuration
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
│
├── .env.example
├── DEPLOYMENT.md
├── README.md
└── vercel.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Customers
- `GET /api/customers` - Get all customers (protected)
- `POST /api/customers` - Create new customer (protected)
- `PUT /api/customers/:id` - Update customer (protected)
- `DELETE /api/customers/:id` - Delete customer (protected)

### Products
- `GET /api/products` - Get all products (protected)
- `POST /api/products` - Create new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Invoices
- `GET /api/invoices` - Get all invoices (protected)
- `GET /api/invoices/:id` - Get single invoice (protected)
- `POST /api/invoices` - Create new invoice (protected)
- `PUT /api/invoices/:id` - Update invoice (protected)
- `DELETE /api/invoices/:id` - Delete invoice (protected)

## 🌐 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deployment Guide

#### Frontend (Vercel)
```bash
npm install -g vercel
cd frontend
vercel
```

#### Backend (Render/Railway/Heroku)
- Deploy the `backend` folder
- Set environment variables
- Use `npm start` as the start command

#### MongoDB
- Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud database
- Whitelist your deployment server IPs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Siva Balan V

## 🙏 Acknowledgments

- Thanks to all contributors
- Built with the MERN stack
- Icons by Lucide React
- Styled with Tailwind CSS

---

⭐ If you find this project helpful, please give it a star!
