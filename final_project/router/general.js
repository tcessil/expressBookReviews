const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/promise', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books available");
    }
  })
  .then((books) => {
    return res.status(200).json(books);
  })
  .catch((error) => {
    return res.status(404).json({ message: error });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => {
    return res.status(200).json(book);
  })
  .catch((error) => {
    return res.status(404).json({ message: error });
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("It portrays the life of Okonkwo, a traditional influential leader of the fictional Igbo clan, Umuofia. He is a feared warrior and a local wrestling champion who opposes colonialism and the early Christian missionaries");
    }
  })
  .then((filteredBooks) => {
    return res.status(200).json(filteredBooks);
  })
  .catch((error) => {
    return res.status(404).json({ message: error });
  });
});

// Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject (" Title, Book Title Things Fall Apart, It portrays the life of Okonkwo, a traditional influential leader of the fictional Igbo clan, Umuofia. He is a feared warrior and a local wrestling champion who opposes colonialism and the early Christian missionaries");
    }
  })
  .then((filteredBooks) => {
    return res.status(200).json(filteredBooks);
  })
  .catch((error) => {
    return res.status(404).json({ message: error });
  });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
