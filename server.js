const PORT = process.env.PORT || 8080; // default port 8080
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const app = express();

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

app.get("/urls", (req, res) => {
  console.log(req.cookies.username)
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  console.log(req.cookies.username);
  let templateVars = {
    username: req.cookies.username
  };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  var newId = generateRandomString();
  let longURL = req.body.longURL
  urlDatabase[newId] = req.body.longURL
  res.redirect('urls');
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    username: req.cookies.username
  };
  res.render("urls_show", templateVars);
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect(301, "/urls")
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect(301, "/urls")
})

app.post("/urls/:id/edit", (req, res) =>{
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) =>{
  delete urlDatabase[req.params.id];
  res.redirect("urls")
});

app.get(`/u/:shortURL`, (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});