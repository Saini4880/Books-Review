const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const bcrypt = require('bcrypt');
const {
  promisify
} = require('util');
const {
  isValid,
  authenticatedUser,
  users,
} = require('./router/authUsers');
const generalRoutes = require('./router/general');


const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Session middleware for user authentication
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.session.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Token expired or invalid"
      });
    }

    // Check if the user exists
    const user = users.find(u => u.username === decoded.username);
    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    req.user = user;
    next();
  });
});

// Define API routes for general users
app.use("/", generalRoutes);
// Start the server
app.use("/api", authenticatedUser);
const PORT = 5000;
app.listen(PORT, () => console.log("Server is running"));
