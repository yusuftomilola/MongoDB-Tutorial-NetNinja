const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

// init app & middleware
const app = express();
app.use(express.json());

// db connection
let db;

connectToDb((error) => {
  if (!error) {
    app.listen(3000, () => {
      console.log("Listening at port 3000");
    });
    db = getDb();
  }
});

// ROUTES
// GET REQUESTS
app.get("/books", (req, res) => {
  // current page
  const page = req.query.page || 0;
  const booksPerPage = 3;

  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: `Could not fetch the documents: ${error}` });
    });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((error) => {
        res.status(500).json({
          error: "could not get the document",
        });
      });
  } else {
    res.status(500).json({
      error: "Not a valid document ID number",
    });
  }
});

// POST REQUESTS
app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        error: "Could not create a new book document",
      });
    });
});

// multiple posts
app.post("/books/post", (req, res) => {
  const books = req.body;

  db.collection("books")
    .insertMany(books)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        error: "Could not create the new books documents",
      });
    });
});

// DELETE POST
app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({
          error: "Could not delete the requested document",
        });
      });
  } else {
    res.status(500).json({
      error: "Not a valid document ID Number",
    });
  }
});

// UPDATE POST
app.patch("/books/:id", (req, res) => {
  const updatedBook = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedBook })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({
          error: "Could not edit/update the selected document",
        });
      });
  } else {
    res.status(500).json({
      error: "Not a valid document ID Number",
    });
  }
});
