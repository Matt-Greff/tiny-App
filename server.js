const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
var moment = require('moment-timezone');
const PORT = process.env.PORT || 8080; // default port 8080
const app = express();
app.set('view engine', 'ejs');

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieSession({
  name: 'session',
  keys: ['asdf', 'asde', 'wqwwt'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use('/', (req, res, next) => {
  res.locals.user_id = req.session.id;
  next();
});

function generateRandomString() {
  return Math.random()
    .toString(36)
    .substring(2, 8);
}

function emailAuthenticator(form, cookie) {
  if (form.email === '' || form.password === '') {
    return false;
  }
  for (let id in users) {
    if (users[id].email === form.email) {
      var passAuth = bcrypt.compareSync(form.password, users[id].password);
      return (cookie && passAuth) ? users[id] : false;
    } // return value is switched for cookie authenticattion
  }
  return cookie ? false : true;
}

function toTimeZone(time, zone) {
  var format = 'YYYY/MM/DD HH:mm';
  return moment(time, format).tz(zone).format(format);
}

const now = toTimeZone(moment(), 'America/Vancouver');

const urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    origin: "user1",
    views: 0,
    viewsU: 0,
    visitors: {},
    created: '12/03/1997 01:00'
  },
  "9sm5xK": {
    url: "http://www.google.com",
    origin: "d3s2a1",
    views: 0,
    viewsU: 0,
    visitors: {},
    created: '12/10/1920 13:00'
  }
}

const users = {
  "user1": {
    id: "user1",
    email: "user@example.com",
    password: bcrypt.hashSync("asdf", 10)
  },
  "d3s2a1": {
    id: "d3s2a1",
    email: "user2@example.com",
    password: bcrypt.hashSync("ldsa", 10)
  }
};

app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  if (!req.session.id === undefined) {
    res.redirect("/urls");
  } else {
    res.redirect("/login")
  }
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (typeof req.session.id === 'object') {
    res.render("urls_new")
  } else {
    res.redirect("/login");
  }
});

app.post("/urls", (req, res) => {
  const newId = generateRandomString();
  const longURL = req.body.longURL
  urlDatabase[newId] = {
    url: longURL,
    origin: req.session.id.id,
    views: 0,
    viewsU: 0,
    created: now,
    visitors: {},
    listOfViews: []
  }
  res.redirect('urls');
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase
  };
  if (urlDatabase[req.params.id].origin === req.session.id.id) {
    res.render("urls_show", templateVars);
  } else {
    res.send("login to access your short URL's")
  }
});

app.get("/register", (req, res) => {
  if (typeof req.session.id === 'object') {
    res.redirect("/urls")
  } else {
    res.render("register");
  }
});

app.post("/register", (req, res, next) => {
  if (req.body.email === '' || req.body.password === '') {
    res.send('you left a field blank')
  }
  if (emailAuthenticator(req.body, false)) {
    const id = generateRandomString();
    users[id] = {
      id: id,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    }
  } else {
    res.send('your email has already been taken');
  }
  res.redirect(302, "/login");
});

app.get("/login", (req, res) => {

  if (req.session.id === undefined) {
    res.render("login");
  } else {
    res.redirect("/urls")
  }
});

app.post("/login", (req, res) => {
  if (req.body.email === req.session.id) {
    req.session.id = null;
  }
  if (req.body.email === '' || req.body.password === '') {
    res.render('login');
  }
  if (emailAuthenticator(req.body, true)) {
    req.session.id = emailAuthenticator(req.body, true);
    res.redirect("/urls");
  } else {
    res.render("login");
  }
});

app.delete("/logout", (req, res) => {
  req.session = null;
  res.redirect(302, "/login")
});

app.put("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id].url = req.body.longURL;
  res.redirect("/urls");
});

app.delete("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls")
});

app.get(`/u/:shortURL`, (req, res) => {
  const short = urlDatabase[req.params.shortURL];
  const thisVisit = req.session.visitor;
  if (short === undefined) {
    res.send('that isn\'t a valid short URL');
  }
  if (thisVisit === undefined) {
    req.session.visitor = generateRandomString();
  }
  if (short['visitors'][thisVisit] === undefined) {
    short['visitors'][thisVisit] = true;
    short['viewsU']++
  }
  short['views']++;
  short['listOfViews'].push(`${thisVisit} ${now}`);
  const longURL = urlDatabase[req.params.shortURL].url;
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Tiny App listening on port ${PORT}!`);
});