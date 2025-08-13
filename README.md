# GreenCart Logistics Management System

A comprehensive full-stack logistics management system built with Node.js, Express, MongoDB, and React. This system helps manage drivers, routes, orders, and provides powerful simulation capabilities to optimize delivery operations.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Company Rules & Business Logic](#company-rules--business-logic)
- [Contributing](#contributing)

## 🚀 Project Overview

GreenCart Logistics is a modern web application designed to streamline logistics operations for delivery companies. It provides real-time insights into driver performance, route optimization, and comprehensive simulation capabilities to improve operational efficiency.

### Purpose
- Optimize delivery routes and driver allocation
- Track key performance indicators (KPIs)
- Simulate different scenarios to improve decision-making
- Manage drivers, routes, and orders efficiently
- Provide actionable insights through interactive dashboards

## ✨ Features

### Core Features
- **🔐 Authentication System**: JWT-based authentication with role-based access control
- **📊 Interactive Dashboard**: Real-time KPIs with charts and metrics
- **🎮 Advanced Simulation Engine**: Custom simulation with proprietary business rules
- **👥 Driver Management**: Complete CRUD operations for driver data
- **🗺️ Route Management**: Manage delivery routes with traffic level considerations
- **📦 Order Management**: Track orders from creation to delivery
- **📈 Analytics & Reporting**: Comprehensive reporting with Chart.js visualizations

### Advanced Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Dynamic data updates after simulations
- **Data Validation**: Comprehensive input validation and error handling
- **Performance Optimization**: Efficient algorithms for route and driver allocation
- **Scalable Architecture**: Modular design for easy maintenance and scaling

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: express-validator
- **Testing**: Jest + Supertest
- **Logging**: Morgan

### Frontend
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **State Management**: Context API
- **UI Components**: Tailwind CSS + Headless UI
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Heroicons
- **HTTP Client**: Axios

### Development Tools
- **Process Manager**: Nodemon
- **Testing**: Jest
- **Linting**: ESLint (React)
- **Package Manager**: npm

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **MongoDB**: v4.4 or higher (local installation or MongoDB Atlas)
- **Git**: For version control

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Greencart_Logistics
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/greencart_logistics
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 5. Database Seeding
```bash
cd backend
npm run seed
```

This will create sample data including:
- Default admin and manager users
- Sample drivers, routes, and orders
- Test data for simulations

### 6. Start the Application

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/greencart_logistics` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### MongoDB Setup

#### Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Create database: `greencart_logistics`

#### MongoDB Atlas (Cloud)
1. Create MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## 🎯 Usage

### Default Login Credentials

After running the seed script, use these credentials:

**Admin Account:**
- Email: `admin@greencart.com`
- Password: `admin123`

**Manager Account:**
- Email: `manager@greencart.com`
- Password: `manager123`

### Core Workflows

#### 1. Dashboard Overview
- View real-time KPIs (Total Profit, Efficiency Score, Deliveries)
- Interactive charts for delivery performance and fuel costs
- Driver utilization metrics

#### 2. Running Simulations
1. Navigate to Simulation page
2. Set parameters:
   - Available Drivers (1-20)
   - Route Start Time (HH:MM format)
   - Max Hours per Driver (1-12 hours)
3. Click "Run Simulation"
4. View results and updated dashboard metrics

#### 3. Managing Resources
- **Drivers**: Add, edit, view driver information and performance
- **Routes**: Manage delivery routes with distance and traffic data
- **Orders**: Track customer orders and delivery status

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "manager|admin"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Driver Endpoints

#### Get All Drivers
```http
GET /api/drivers?page=1&limit=10&search=keyword
Authorization: Bearer <token>
```

#### Create Driver
```http
POST /api/drivers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "employeeId": "string",
  "licenseNumber": "string",
  "phone": "string",
  "currentShiftHours": "number",
  "past7DayWorkHours": "number"
}
```

#### Update Driver
```http
PUT /api/drivers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "isAvailable": "boolean"
}
```

#### Delete Driver
```http
DELETE /api/drivers/:id
Authorization: Bearer <token>
```

### Route Endpoints

#### Get All Routes
```http
GET /api/routes?page=1&limit=10&trafficLevel=High
Authorization: Bearer <token>
```

#### Create Route
```http
POST /api/routes
Authorization: Bearer <token>
Content-Type: application/json

{
  "routeId": "string",
  "name": "string",
  "distanceKm": "number",
  "trafficLevel": "Low|Medium|High",
  "baseTimeMinutes": "number",
  "startLocation": "string",
  "endLocation": "string"
}
```

### Order Endpoints

#### Get All Orders
```http
GET /api/orders?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "string",
  "valueRs": "number",
  "assignedRoute": "ObjectId",
  "customerName": "string",
  "customerAddress": "string",
  "customerPhone": "string"
}
```

### Simulation Endpoints

#### Run Simulation
```http
POST /api/simulation/run
Authorization: Bearer <token>
Content-Type: application/json

{
  "availableDrivers": "number",
  "routeStartTime": "HH:MM",
  "maxHoursPerDriver": "number"
}
```

#### Get Dashboard Stats
```http
GET /api/simulation/dashboard-stats
Authorization: Bearer <token>
```

#### Get Simulation History
```http
GET /api/simulation/history?page=1&limit=10
Authorization: Bearer <token>
```

### Response Format

All API responses follow this format:
```json
{
  "success": true|false,
  "message": "string",
  "data": "object|array",
  "errors": "array"
}
```

## 🧪 Testing

### Backend Testing

Run all tests:
```bash
cd backend
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Test Structure
- **Authentication Tests**: Login, registration, JWT validation
- **Simulation Engine Tests**: Business logic, calculations, KPI generation
- **API Integration Tests**: Endpoint testing with supertest

### Sample Test Cases
1. **User Registration**: Valid/invalid email, duplicate users
2. **Authentication**: Login with valid/invalid credentials
3. **Simulation Logic**: Fuel cost calculation, driver allocation
4. **Business Rules**: Late delivery penalties, high-value bonuses

## 🚀 Deployment

### Production Environment Variables

Update these for production:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/greencart_logistics
JWT_SECRET=production-secret-key-256-bits
FRONTEND_URL=https://your-frontend-domain.com
```

### Backend Deployment (Render/Railway/Heroku)

1. **Build Command**: `npm install`
2. **Start Command**: `npm start`
3. **Environment Variables**: Set all required env vars
4. **Database**: Use MongoDB Atlas for production

### Frontend Deployment (Vercel/Netlify)

1. **Build Command**: `npm run build`
2. **Output Directory**: `build`
3. **Environment Variables**: 
   ```
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

### Database Deployment (MongoDB Atlas)

1. Create MongoDB Atlas cluster
2. Configure network access
3. Create database user
4. Get connection string
5. Update `MONGODB_URI`

## 🔧 Company Rules & Business Logic

The simulation engine implements these proprietary business rules:

### 1. Late Delivery Penalty
- **Rule**: If delivery time > (base route time + 10 minutes)
- **Penalty**: ₹50 per late delivery
- **Impact**: Reduces order profit

### 2. Driver Fatigue Rule
- **Condition**: Driver works >8 hours in a day
- **Effect**: 30% speed reduction next day
- **Implementation**: Affects delivery time calculations

### 3. High-Value Bonus
- **Condition**: Order value > ₹1000 AND delivered on-time
- **Bonus**: 10% of order value
- **Impact**: Increases order profit

### 4. Fuel Cost Calculation
- **Base Cost**: ₹5/km per route
- **High Traffic Surcharge**: +₹2/km for "High" traffic routes
- **Formula**: `(distance × 5) + (high_traffic ? distance × 2 : 0)`

### 5. Overall Profit Formula
```
Profit = Order Value + Bonuses - Penalties - Fuel Cost
```

### 6. Efficiency Score
```
Efficiency = (On-Time Deliveries / Total Deliveries) × 100
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit pull request

### Code Standards
- Use ESLint configurations
- Follow TypeScript best practices
- Write unit tests for new features
- Update documentation for API changes

### Project Structure
```
├── backend/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, validation middleware
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── tests/          # Unit tests
│   └── data/           # Sample data files
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── context/    # React context
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Utility functions
│   └── public/         # Static assets
└── README.md
```

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
- Ensure MongoDB is running locally
- Check connection string in `.env`
- Verify network connectivity for Atlas

#### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or use different port
PORT=5001 npm run dev
```

#### Frontend Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### JWT Token Expired
- Clear localStorage in browser
- Login again to get new token

### Performance Tips
1. **Database Indexing**: Create indexes on frequently queried fields
2. **Image Optimization**: Optimize chart rendering for large datasets
3. **Caching**: Implement Redis for simulation result caching
4. **Pagination**: Use proper pagination for large datasets

---

**Built with ❤️ for Purple Merit Technologies**

For support, contact: [Your Contact Information]