const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = 'your_secret_key'; // Use the same secret key used to sign the token

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.user = decoded;
    next();
  });
}

let users = [];

const isValid = (username) => {
  // Check if the username already exists in the users array
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  // Check if the username and password match any user in the users array
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "secret_key", { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }
// Assuming books is an array of book objects with an isbn property
const book = books.find(book => book.isbn === isbn);
if (!book) {
  return res.status(404).json({ message: "Book not found" });
}
book.reviews = book.reviews || [];
book.reviews.push({ username: req.user.username, review });
return res.status(200).json({ message: "Review added successfully" });
});

// Apply the middleware to the route
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  const book = books[isbn];
  if (book) {
    if (!book.reviews) {
      book.reviews = [];
    }
    book.reviews.push(review);
    return res.status(200).json({ message: "Review added successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  return res.status(200).json({ message: "Login successful", token });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
