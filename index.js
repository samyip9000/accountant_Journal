// Require Node Packages
const express = require("express");
const { create } = require("express-handlebars");
// const basicAuth = require("express-basic-auth");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");


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

// Promise Version of functions -- seperated
function write(name, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(uploadDirectory + path.sep + name, data, (error) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(name);
    });
  }).then(read);
}

function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(uploadDirectory + path.sep + file, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

// handle a request to list out all of the files within the folder uploaded
app.get("/directoryInformation", (req, res) => {
  fs.readdir(__dirname + "/uploaded", (error, information) => {
    if (error) {
      console.log(error);
    } else {
      console.log(information);
      res.send(information);
    }
  });
});

// handle file being sent to the server
app.post("/", (req, res) => {
  console.log(req.files.file);
  if (req.files.file) {
    cache[req.files.file.name] = write(
      req.files.file.name,
      req.files.file.data
    );
    cache[req.files.file.name].then(() => {
      res.send(req.files.file.name);
      // res.redirect("/"); // use the inbuilt html form methods post and action
    });
  }
});

// handle downloading a file from server
app.get("/uploaded/:filename", (req, res) => {
  console.log(cache, "<<<<< cache");
  // handle download if the item is in cache
  if (cache[req.params.filename]) {
    console.log(" in cache?");
    cache[req.params.filename].then((data) => {
      res.send(data);
    });
    // handle the download by first storing value in cache then giving it back
  } else {
    console.log(" not in cache?");
    cache[req.params.filename] = read(req.params.filename);
    cache[req.params.filename].then((data) => {
      console.log(cache, "<<<< cache after population");
      res.send(data);
    });
  }
});

//index router

app.get("/", (req, res) => {
  res.render("index", {
    // user: req.auth.user,
  });
});

// app.use("/api/notes/", new NoteRouter(noteService).router());

app.listen(port, () =>
  console.log(`Note Taking application listening to ${port}!`)
);