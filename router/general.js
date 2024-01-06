const express = require('express');
const books = require('./booksdb.js');

const public_users = express.Router();

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 2: Get books based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});

// Task 3: Get all books by Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(book => book.author === author);
  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({
      message: "Author not found"
    });
  }
});

// Task 4: Get all books based on Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const titleBooks = Object.values(books).filter(book => book.title === title);
  if (titleBooks.length > 0) {
    return res.status(200).json(titleBooks);
  } else {
    return res.status(404).json({
      message: "Title not found"
    });
  }
});

// Task 5: Get book Review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({
      message: "Book or reviews not found"
    });
  }
});

public_users.post('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const { review } = req.body;

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  if (books[isbn]) {
    if (!books[isbn].reviews) {
      books[isbn].reviews = [];
    }

    // Add the review to the book's reviews array
    books[isbn].reviews.push(review);

    return res.status(200).json({ message: "Review added successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


public_users.put('/review/:isbn/:reviewIndex', function (req, res) {
  const isbn = req.params.isbn;
  const reviewIndex = req.params.reviewIndex;
  const { updatedReview } = req.body;

  if (!updatedReview) {
    return res.status(400).json({ message: "Updated review content is required" });
  }

  if (books[isbn] && books[isbn].reviews && books[isbn].reviews.length > reviewIndex) {
    // Update the review at the specified index
    books[isbn].reviews[reviewIndex] = updatedReview;

    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    return res.status(404).json({ message: "Book or review not found" });
  }
});


public_users.delete('/review/:isbn/:reviewIndex', function (req, res) {
  const isbn = req.params.isbn;
  const reviewIndex = req.params.reviewIndex;

  if (books[isbn] && books[isbn].reviews && books[isbn].reviews.length > reviewIndex) {
    // Remove the review at the specified index
    books[isbn].reviews.splice(reviewIndex, 1);

    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Book or review not found" });
  }
});


module.exports = public_users;
