// Require Node Packages
const https = require("https");
const express = require("express");

const { create } = require("express-handlebars");
const fs = require("fs");
// const flash = require("express-flash");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const passportJS = require("./passport");
require("dotenv").config();
// const router = require("./router")(express);
const port = 3000;
const path = require("path");
const { user } = require("pg/lib/defaults");

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

let cookieParser = require('cookie-parser')

// Set up express and environment
const app = express();

// require("dotenv").config();

app.use(fileUpload());

// uploadDirectory is the path to our directory named uploaded, where we will store our cached files, path.sep provides the platform specific path segment separator
const uploadDirectory = __dirname + path.sep + "uploaded";

// Server the uploaded folder to the server, allowing the users to download cached information.
app.use(express.static("uploaded"));
app.use(express.static("public/"));

// Declare a variable named caches, define it as an empty object
let caches = {};


app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    name: 'cookie_name',
    proxy: true,
    resave: true,
    saveUninitialized: true,
  })
);

// Require User create modules

// Set up connection to postgres database via knex
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

//The code below returns the current year
const hbs = create({
  helpers: {
    year() {
      return new Date().getFullYear();
    },
  },
});

//set up passport
passportJS(app,passport);

// Set up handlebars as our view engine - handlebars will responsible for rendering our HTML
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Setup middleware and serve public folder
app.use(fileUpload());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//add passport route
function isLoggedIn(req, res, next) {
  //If authenticated move to the next request, else redirect to login page
  if (req.isAuthenticated()) return next();
  res.redirect("/login");

}

function notLoggedIn(req, res, next) {
  //If not authenticated move to the next request, else redirect to home page
  if (!req.isAuthenticated()) return next();
  res.redirect("/");
}

//Render pages
app.get("/", isLoggedIn, (req, res) => {
  res.render("index", {loggedIn: req.session.loggedIn});
});

app.get("/signup", notLoggedIn, (req, res) => {
  res.render("signup", {
    title: "Sign Up page",
    // error: req.flash("error"),
  });
});

app.get("/login", notLoggedIn, (req, res) => {
  res.render("login", {
    title: "Login page",
    // error: req.flash("error"),
  });
});

//Signup Request
app.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/login",
    failureRedirect: "/signup",
    // failureFlash: true,
  })
);

//Login Request
app.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    // failureFlash: true,
  })
);

//Logout Request
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return err;
    }
  });
  res.redirect("/login");
});


//file upload
// writeFile is a function which takes the name of the file and the body (data) for storage - it will write the file to our uploadDirectory 'uploaded', this promise resolves with the name of the file
function writeFile(name, body) {
  return new Promise((resolve, reject) => {
    fs.writeFile(uploadDirectory + path.sep + name, body, (err) => {
      if (err) {
        return reject(err);
      } else {
        resolve(name);
      }
    });
  }).then(readFile);
}

// readFile is a function which takes the file as an input, it goes to the 'uploaded' directory that we serve via express. It will then look for the name of the file that we pass into the function, the promise will resolve with the body of the file (the data)

function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(uploadDirectory + path.sep + file, (err, body) => {
      if (err) {
        return reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

console.log(caches);

// instantiate variables

//Handle the user inputted data into JSON file in /api/journal_db/
app.post("/api/accountData", async (req, res) => {
  console.log(req.body)
  const { debitData, creditData } = req.body;
  await knex("journal_list").insert(debitData);
  await knex("journal_list").insert(creditData);
});

app.get("/api/accountData", async (req, res) => {
  const accountData = await knex
       .select(`*`)
       .from("journal_list");
  res.json({accountData});
});



app.post("/files", (req, res) => {
  // after the request path upload.single('upload'),
  console.log(req.files);
  console.log(req.files);

  let file = req.files.upload.name;
  let data = req.files.upload.data;

  caches[file] = writeFile(file, data);

  caches[file]
    .then(() =>
      res.send(
        "Wow you sent a file, can you remember how to download it? Goto your browser, url: localhost:3000/uploaded/:file-name"
      )
    )
    .catch((e) => res.status(500).send(e.message));
  //   }
});

app.get("/uploaded/:name", (req, res) => {
  if (caches[req.params.name] == null) {
    console.log("reading from folder");
    caches[req.params.name] = readFile(req.params.name);
  }
  console.log(caches);
  console.log(caches[req.params.name]);

  caches[req.params.name]
    .then((body) => {
      console.log(body);
      res.send(body);
    })
    .catch((e) => res.status(500).send(e.message));
});



app.listen(port, () =>
  console.log(`Note Taking application listening to ${port}!`)
);



