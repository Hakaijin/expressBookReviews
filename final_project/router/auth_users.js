const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return username && !users.find(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const { isbn } = req.params;
    const { review, rating } = req.body;
    const username = req.user.username;

    if (!review || rating == null) {
        return res.status(400).json({ message: "Review and rating are required" });
    }

    const book = books.find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user already reviewed the book
    const existingReview = book.reviews.find(r => r.user === username);
    
    if (existingReview) {
        // Update existing review
        existingReview.comment = review;
        existingReview.rating = rating;
    } else {
        // Add new review
        book.reviews.push({ user: username, comment: review, rating });
    }

    return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
