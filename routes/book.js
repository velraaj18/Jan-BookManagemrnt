const express = require("express");
const router = express.Router();

const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

router.use(express.json());

// we don't use /users here bcoz we already have them in index.js.
// to get all the books.
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: books,
  });
});

//to get the issued books

router.get("/issued", (req, res) => {
  const usersWithBook = users.filter((each) => {
    if (each.issuedBook) {
      return each;
    }
  });

  const issuedBooks = [];
  usersWithBook.forEach((each) => {
    const book = books.find((book) => book.id === each.issuedBook);
    book.takenBy = each.name;
    book.issuedDate = each.issuedDate;
    book.returnDate = each.returnDate;

    issuedBooks.push(book);
  });
  if (issuedBooks.length == 0) {
    return res.status(404).json({
      success: false,
      message: "Book is not issued",
    });
  }
  return res.status(200).json({
    success: true,
    data: issuedBooks,
  });
});

// to get a specific book using book ID.
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((each) => each.id === id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  } else {
    return res.status(200).json({
      success: true,
      message: " Book found",
      data: book,
    });
  }
});

// to add a new book
// router.post("/", (req, res) => {
//   const { id, name, author, genre, price, publisher } = req.body;
//   const book = books.find((each) => each.id === id);
//   if (book) {
//     return res.status(404).json({
//       success: false,
//       message: "Book already found",
//     });
//   }
//   books.push({
//     id,
//     name,
//     author,
//     genre,
//     price,
//     publisher,
//   });
//   return res.status(201).json({
//     success: true,
//     data: books,
//   });
// });

router.post("/", (req, res) => {
  const { data } = req.body;
  const book = books.find((each) => each.id === data.id);
  if (book) {
    return res.status(404).json({
      message: "Book already found",
    });
  }
  const newBook = { ...books, data };
  return res.status(200).json({
    success: true,
    data: newBook,
  });
});

//To update an existing book using its ID.

router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  const book = books.find((each) => each.id === id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }
  const updateBook = books.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });

  return res.status(200).json({
    success: true,
    data: updateBook,
  });
});

module.exports = router;
