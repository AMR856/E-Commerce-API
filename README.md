# ALX Backend Portfolio – E-Commerce API

A **production-ready E-Commerce REST API** built with **Node.js**, **Express**, and **MongoDB**, designed with scalability, security, and clean architecture in mind.  
This project demonstrates real-world backend engineering practices including authentication, authorization, validation, documentation, and modular design.

---

## 🚀 Features

- 🔐 **JWT Authentication & Authorization**
  - Role-based access control (Admin / User)
  - Permission-based middleware
- 📦 **Product Management**
  - CRUD operations
  - Featured products
  - Ratings & reviews
  - Image & gallery uploads (Multer)
- 🗂 **Category Management**
- 🛒 **Orders & Order Items**
  - Ownership enforcement
  - Admin vs user access rules
  - Total sales & statistics
- 👤 **User Management**
  - Registration & login
  - Role handling
- 📄 **Swagger API Documentation**
  - Route-level documentation
  - Bearer authentication support
- ✅ **Request Validation**
  - Joi schemas for body, params, and queries
- 🧱 **Clean Modular Architecture**
- ⚙️ **Environment-based configuration**

---

## 🧠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (`express-jwt`)
- **Validation:** Joi
- **File Uploads:** Multer
- **Documentation:** Swagger (OpenAPI 3.0)
- **Dev Tools:** Nodemon

---

## 📁 Project Structure

```

E-Commerce-API/
├── config/
│   ├── multer.js
│   ├── roles.js
│   └── swagger.js
│
├── middlewares/
│   ├── authJwt.js
│   ├── authorize.js
│   └── validator.js
│
├── modules/
│   ├── users/
│   ├── products/
│   ├── categories/
│   ├── orders/
│   └── orderItems/
│
├── public/uploads/
├── utils/
├── index.js
├── package.json
└── README.md

```

Each module follows the same structure:
```

module/
├── *.controller.js
├── *.service.js
├── *.route.js
├── *.validation.js
└── *.model.js

```

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Roles & permissions system
- Ownership checks enforced at service layer

### Example Permissions
- `MANAGE_PRODUCTS`
- `READ_ALL_ORDERS`
- `MANAGE_OWN_ORDERS`
- `MANAGE_CATEGORIES`

---

## 📄 API Documentation (Swagger)

Swagger UI is fully configured and accessible at:

```

GET /api/v1/api-docs

````

Features:
- Bearer token authentication
- Organized tags per module
- Reusable components (schemas & security)

---

## 🧪 Validation

All requests are validated using **Joi**:
- Request body
- URL params
- Query parameters

Invalid requests return meaningful error messages.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
API_URL=/api/v1
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
````

---

## ▶️ Running the Project

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

### Run in production

```bash
npm start
```

---

## 🧩 Sample Endpoints

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| POST   | `/users/register`        | Register user       |
| POST   | `/users/login`           | Login               |
| GET    | `/products`              | Get products        |
| POST   | `/orders`                | Create order        |
| GET    | `/orders/get/totalsales` | Total sales (admin) |
