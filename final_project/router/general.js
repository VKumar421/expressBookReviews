const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let authenticated = require("./auth_users.js").authenticated;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res
    .status(404)
    .json({ message: "Username or Password not provided." });
});

// // Get the book list available in the shop (without promise)
// public_users.get("/", function (req, res) {
//   return res.send(JSON.stringify(books, null, 4));
// });

// Get the book list available in the shop (with promise)
public_users.get("/", function (req, res) {
  const custPromise = new Promise((resolve, reject) => {
    try {
      const bookList = JSON.stringify(books, null, 4);
      resolve(bookList);
    } catch {
      reject(err.message);
    }
  });
  custPromise
    .then((bookList) => res.json(bookList))
    .catch((err) => res.json({ data: err.message }));
});

// // Get book details based on ISBN (without promise)
// public_users.get("/isbn/:isbn", function (req, res) {
//   const isbn = req.params.isbn;
//   res.send(books[isbn]);
// });

// Get book details based on ISBN (with promise)
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const custPromise = new Promise((resolve, reject) => {
    try {
      const book = books[isbn];
      resolve(book);
    } catch {
      reject(err);
    }
  });
  custPromise
    .then((book) => res.json(book))
    .catch((err) => res.json({ data: err.message }));
});

// // Get book details based on author (without promise)
// public_users.get("/author/:author", function (req, res) {
//   let bookList;
//   const author = req.params.author;
//   for (const key in books) {
//     if (books[key].author === author)
//       bookList = bookList + JSON.stringify(books[key], null, 4);
//   }
//   res.send(bookList);
// });

// Get book details based on author (with promise)
public_users.get("/author/:author", function (req, res) {
  let bookList;
  const author = req.params.author;
  const custPromise = new Promise((resolve, reject) => {
    try {
      for (const key in books) {
        if (books[key].author === author)
          bookList = bookList + JSON.stringify(books[key], null, 4);
      }
      resolve(bookList);
    } catch {
      reject(err);
    }
  });
  custPromise
    .then((bookList) => res.json(bookList))
    .catch((err) => res.json(err.message));
});

// // Get all books based on title (without promise)
// public_users.get("/title/:title", function (req, res) {
//   let bookList;
//   const title = req.params.title;
//   for (const key in books) {
//     if (books[key].title === title)
//       bookList = bookList + JSON.stringify(books[key], null, 4);
//   }
//   res.send(bookList);
// });

// Get all books based on title (with promise)
public_users.get("/title/:title", function (req, res) {
  let bookList = "";
  const title = req.params.title;
  const custPromise = new Promise((resolve, reject) => {
    try {
      for (const key in books) {
        if (books[key].title === title)
          bookList = bookList + JSON.stringify(books[key], null, 4);
        console.log(bookList);
      }
      resolve(bookList);
    } catch {
      reject(err);
    }
  });
  custPromise
    .then((bookList) => res.json(bookList))
    .catch((err) => res.json(err.message));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
