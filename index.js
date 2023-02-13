// Require Node Packages
const express = require("express");
const { create } = require("express-handlebars");
// const basicAuth = require("express-basic-auth");

// Set up express and environment
const app = express();
// require("dotenv").config();
const port = 3000;

// Require User create modules
// const AuthChallenger = require("./AuthChallenger");
// const NoteService = require("./NoteService/NoteService");
// const NoteRouter = require("./NoteRouter/NoteRouter");

// Set up connection to postgres database via knex
// const knexConfig = require("./knexfile").development;
// const knex = require("knex")(knexConfig);

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

app.get("/", (req, res) => {
  res.render("index", {
    // user: req.auth.user,
  });
});

// app.use("/api/notes/", new NoteRouter(noteService).router());

app.listen(port, () =>
  console.log(`Note Taking application listening to ${port}!`)
);