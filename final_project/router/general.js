const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify({ books }, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
     const { isbn } = req.params; // Retrieve ISBN from request parameters
    const book = books.find(b => b.isbn === isbn); // Find the book by ISBN

    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 2)); // Return the book details
    } else {
        return res.status(404).send(JSON.stringify({ message: "Book not found" }, null, 2)); // Book not found
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const { author } = req.params; // Retrieve author from request parameters
    const matchingBooks = books.filter(b => b.author.toLowerCase() === author.toLowerCase()); // Case-insensitive match

    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify({ books: matchingBooks }, null, 2));
    } else {
        return res.status(404).send(JSON.stringify({ message: "No books found for this author" }, null, 2));
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const { title } = req.params; // Retrieve title from request parameters
    const book = books.find(b => b.title.toLowerCase() === title.toLowerCase()); // Case-insensitive match

    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 2));
    } else {
        return res.status(404).send(JSON.stringify({ message: "No book found with this title" }, null, 2));
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const { isbn } = req.params;
    const book = books.find(b => b.isbn === isbn);

    if (book) {
        return res.status(200).send(JSON.stringify({ reviews: book.reviews }, null, 2));
    } else {
        return res.status(404).send(JSON.stringify({ message: "Book not found or no reviews available" }, null, 2));
    }
});

module.exports.general = public_users;
