var express = require("express");
var ejs = require('ejs');
const bodyParser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

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

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  var newId = generateRandomString();
  let longURL = req.body.longURL
  console.log(req.body.longURL); // debug statement to see POST parameters
  urlDatabase[newId] = req.body.longURL
  res.redirect('urls');
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) =>{
  delete urlDatabase[req.params.id];
  res.redirect("/urls")
});

app.get(`/u/:shortURL`, (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});