const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');

const { parseDriversCSV, parseRoutesCSV } = require('./csvParser');

const ordersData = [
  {
    orderId: "ORD001",
    valueRs: 1200,
    customerName: "Priya Sharma",
    customerAddress: "Sector 14, Gurgaon",
    customerPhone: "+91 9876543220",
    status: "pending"
  },
  {
    orderId: "ORD002",
    valueRs: 850,
    customerName: "Rahul Mehta",
    customerAddress: "Viman Nagar, Pune",
    customerPhone: "+91 9876543221",
    status: "pending"
  },
  {
    orderId: "ORD003",
    valueRs: 2500,
    customerName: "Anita Desai",
    customerAddress: "JP Nagar, Bangalore",
    customerPhone: "+91 9876543222",
    status: "pending"
  },
  {
    orderId: "ORD004",
    valueRs: 780,
    customerName: "Vikash Kumar",
    customerAddress: "Anna Nagar, Chennai",
    customerPhone: "+91 9876543223",
    status: "pending"
  },
  {
    orderId: "ORD005",
    valueRs: 1500,
    customerName: "Meera Patel",
    customerAddress: "Banjara Hills, Hyderabad",
    customerPhone: "+91 9876543224",
    status: "pending"
  },
  {
    orderId: "ORD006",
    valueRs: 950,
    customerName: "Amit Ghosh",
    customerAddress: "Park Street, Kolkata",
    customerPhone: "+91 9876543225",
    status: "pending"
  },
  {
    orderId: "ORD007",
    valueRs: 1800,
    customerName: "Sneha Singh",
    customerAddress: "Prahlad Nagar, Ahmedabad",
    customerPhone: "+91 9876543226",
    status: "pending"
  },
  {
    orderId: "ORD008",
    valueRs: 650,
    customerName: "Rohit Agarwal",
    customerAddress: "C-Scheme, Jaipur",
    customerPhone: "+91 9876543227",
    status: "pending"
  },
  {
    orderId: "ORD009",
    valueRs: 1100,
    customerName: "Kavita Reddy",
    customerAddress: "Sector 62, Noida",
    customerPhone: "+91 9876543228",
    status: "pending"
  },
  {
    orderId: "ORD010",
    valueRs: 2200,
    customerName: "Sanjay Gupta",
    customerAddress: "Gomti Nagar, Lucknow",
    customerPhone: "+91 9876543229",
    status: "pending"
  },
  {
    orderId: "ORD011",
    valueRs: 750,
    customerName: "Neha Joshi",
    customerAddress: "Sector 21, Gurgaon",
    customerPhone: "+91 9876543230",
    status: "pending"
  },
  {
    orderId: "ORD012",
    valueRs: 1350,
    customerName: "Manish Tiwari",
    customerAddress: "Kothrud, Pune",
    customerPhone: "+91 9876543231",
    status: "pending"
  },
  {
    orderId: "ORD013",
    valueRs: 980,
    customerName: "Pooja Nair",
    customerAddress: "Indiranagar, Bangalore",
    customerPhone: "+91 9876543232",
    status: "pending"
  },
  {
    orderId: "ORD014",
    valueRs: 1650,
    customerName: "Arjun Iyer",
    customerAddress: "Besant Nagar, Chennai",
    customerPhone: "+91 9876543233",
    status: "pending"
  },
  {
    orderId: "ORD015",
    valueRs: 890,
    customerName: "Ritu Bansal",
    customerAddress: "Jubilee Hills, Hyderabad",
    customerPhone: "+91 9876543234",
    status: "pending"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greencart_logistics');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});

    console.log('Existing data cleared');

    const adminUser = new User({
      username: 'admin',
      email: 'admin@greencart.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    const managerUser = new User({
      username: 'manager',
      email: 'manager@greencart.com',
      password: 'manager123',
      role: 'manager'
    });
    await managerUser.save();

    console.log('Default users created');

    const driversData = parseDriversCSV();
    const drivers = await Driver.insertMany(driversData);
    console.log(`${drivers.length} drivers inserted from CSV`);

    const routesData = parseRoutesCSV();
    const routes = await Route.insertMany(routesData);
    console.log(`${routes.length} routes inserted from CSV`);

    const ordersWithRoutes = ordersData.map((order, index) => ({
      ...order,
      assignedRoute: routes[index % routes.length]._id
    }));

    const orders = await Order.insertMany(ordersWithRoutes);
    console.log(`${orders.length} orders inserted`);

    console.log('Database seeded successfully!');
    console.log('Login credentials:');
    console.log('Admin - Email: admin@greencart.com, Password: admin123');
    console.log('Manager - Email: manager@greencart.com, Password: manager123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();