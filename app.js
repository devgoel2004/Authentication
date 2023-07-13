//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { default: mongoose, mongo } = require("mongoose");
require("dotenv").config();

const app = express();
const bcrypt = require("bcrypt");
const { ConnectionCheckOutFailedEvent } = require("mongodb");
const saltRounds = 10;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//connecting database
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
//console.log(process.env.SECRET);
const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home.ejs");
});

app.get("/login", function (req, res) {
  res.render("login.ejs");
});

app.get("/register", function (req, res) {
  res.render("register.ejs");
});
app.post("/register", async function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    const newUser = new User({
      email: req.body.userName,
      password: req.body.password,
    });
    const saveUser = newUser.save();
    if (saveUser.err) {
      console.log(err);
    } else {
      res.render("secrets.ejs");
    }
  });
});

//way to check password to register

app.post("/login", async function (req, res) {
  const userName = req.body.userName;
  const password = req.body.password;

  User.findOne({ email: userName })
    .then(function (res1) {
      bcrypt.compare(password, res1.password, function (err, result) {
        console.log(res1.password, result);
        if (result === true) {
          res.sender("secrets.ejs");
        } else {
          res.send("Invalid credentials");
        }
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});
app.listen(3000, function (req, res) {
  console.log("Server is listening on port 3000");
});
