const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const PORT = process.env.PORT || 8080; // default port 8080
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

app.use('/', (req, res, next) => {
  res.locals.user_id = req.cookies.id;
  console.log('local:', res.locals.user_id)
  next();
});

function generateRandomString() {
  return Math.random()
    .toString(36)
    .substring(2, 8);
}
//////////////////////////////////////////////debugging this///////////////////////////////////////////////////
function emailAuthenticator(form, cookie) {
  if (form.email === '' || form.password === '') {
    return 'You left it blank yo!';
  }
  for (let id in users) {
    console.log(form.password);
    if (users[id].email === form.email) {
      return (cookie && users[id].password === form.password) ? users[id] : false;
    } // return value is switched for cookie authenticattion
  }
  return cookie ? false : true;
}
//////////////////////////////////////////////debugging this///////////////////////////////////////////////////
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "user1": {
    id: "user1",
    email: "user@example.com",
    password: "asdf"
  },
  "d3s2a1": {
    id: "d3s2a1",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const newId = generateRandomString();
  const longURL = req.body.longURL
  urlDatabase[newId] = req.body.longURL
  res.redirect('urls');
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    shortURL: req.params.id
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res, next) => {
  if (emailAuthenticator(req.body, false)) {
    const id = generateRandomString();
    users[id] = {
      id: id,
      email: req.body.email,
      password: req.body.password
    }
  } else {
    res.status(404);
  }
  console.log(users);
  res.redirect(301, "/urls");
});

app.get("/login", (req, res) => {
  res.render("login")
});
//////////////////////////////////////////////debugging this///////////////////////////////////////////////////
app.post("/login", (req, res) => {
  console.log('debugging of appPostLogin', emailAuthenticator(req.body, true));
  if (emailAuthenticator(req.body, true)) {
    res.cookie('id', emailAuthenticator(req.body, true));
    res.redirect("/urls");
  } else {
    res.render("login");
  }
});
//////////////////////////////////////////////debugging this///////////////////////////////////////////////////
app.post("/logout", (req, res) => {
  res.clearCookie("id");
  res.redirect(301, "/login")
});

app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls")
});

app.get(`/u/:shortURL`, (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Tiny App listening on port ${PORT}!`);
});
