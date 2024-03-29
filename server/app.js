const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/UrlRoutes");
const userRoutes = require("./routes/UserRoutes");
const { errorConverter, errorHandler } = require("./utils/ErrorHandler");
require("dotenv").config();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded((extended = true)));
app.use(bodyParser.json());

app.use("/api/urls", urlRoutes);
app.use("/api/users", userRoutes);
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

console.log(process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(errorConverter);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server started!", process.env.PORT);
});
