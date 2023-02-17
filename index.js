// Require Node Packages
const https = require("https");
const express = require("express");

const { create } = require("express-handlebars");
const fileUpload = require("express-fileupload");
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


// require("dotenv").config();

// Set up express and environment
const app = express();

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// require("dotenv").config();

// Require User create modules
// const AuthChallenger = require("./AuthChallenger");

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
  res.render("index");
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
// instantiate variables
const cache = {};
const uploadDirectory = __dirname + path.sep + "uploaded";

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

  
// reference code from dropbox file
// app.post("/", (req, res) => {
//   console.log(req.files.file);
//   if (req.files.file) {
//     cache[req.files.file.name] = write(
//       req.files.file.name,
//       req.files.file.data
//     );
//     cache[req.files.file.name].then(() => {
//       res.send(req.files.file.name);
//       // res.redirect("/"); // use the inbuilt html form methods post and action
//     });
//   }
// });

// index router
// app.get("/", (req, res) => {
//   res.render("index", {
//   });
// });

app.listen(port, () =>
  console.log(`Note Taking application listening to ${port}!`)
);



