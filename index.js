// Require Node Packages
const https = require("https");
const express = require("express");

const { create } = require("express-handlebars");
// const basicAuth = require("express-basic-auth");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const flash = require("express-flash");
const bcrypt = require("bcrypt");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
require("dotenv").config();
// const router = require("./router")(express);
const port = 3000;
const path = require("path");


// require("dotenv").config();

// Set up express and environment
const app = express();
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

// Set up handlebars as our view engine - handlebars will responsible for rendering our HTML
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Setup middleware and serve public folder
app.use(fileUpload());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(
//   basicAuth({
//     authorizeAsync: true,
//     authorizer: AuthChallenger(knex),
//     challenge: true,
//   })
// );

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
app.get("/", (req, res) => {
  res.render("index", {
  });
});

app.listen(port, () =>
  console.log(`Note Taking application listening to ${port}!`)
);



