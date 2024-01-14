const express = require("express");
const { users } = require("./data/users.json");
const app = express();
app.use(express.json());

const userDataRouter = require("./routes/user.js");
const bookDataRouter = require("./routes/book.js");

const port = 8081;

app.get("/", (req, res) => {
  res.status(200).send({ message: "Hello" });
});

app.use("/users", userDataRouter);
app.use("/books", bookDataRouter);
// to get all the users.

app.get("*", (req, res) => {
  // Universal router.
  res.status(404).send({ message: " NO ROUTE FOUND" });
});

app.listen(port, () => {
  console.log("success");
});
