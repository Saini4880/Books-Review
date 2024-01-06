const express = require("express");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const books = require("./booksdb.js");
const secret_key = "NOTEAPI";
const regd_users = express.Router();

// Initialize an empty array to store registered users
let users = [];

// Check if the username is valid
const isValid = (username) => {
  return true;
};

// Check if the provided username and password match a registered user
const authenticatedUser = (username, password) => {
  const user = users.find((u) => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  return null;
};

// Register a new user
const registerUser = (username, password) => {
  // Check if username is valid
  if (!isValid(username)) {
    return false;
  }
  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Add the user to the list of registered users
  users.push({
    username,
    password: hashedPassword,
  });
  return true;
};

regd_users.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const registrationResult = registerUser(username, password);

  if (registrationResult) {
    return res.status(200).json({
      message: "User registered successfully",
    });
  } else {
    return res.status(400).json({
      message: "Invalid username",
    });
  }
});

// Login as a registered user
regd_users.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password match the records
  const user = authenticatedUser(username, password);

  console.log("User input:", username, password);
  console.log("Registered users:", users);

  if (!user) {
    return res.status(401).json({
      message: "Authentication failed",
    });
  }

  // Generate and set JWT token in session
  const token = jwt.sign(
    {
      username: user.username,
    },
    secret_key,
    {
      expiresIn: "1h",
    }
  );
  req.session.token = token;

  return res.status(200).json({
    message: "Login successful",
    token,
  });
});


module.exports = {
  authenticatedUser: regd_users,
  isValid,
  users,
};
