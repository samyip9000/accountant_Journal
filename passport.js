const passport = require("passport");

module.exports = (express) => {
  const router = express.Router();

  // check to see if the user is logged in or not
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect("/login"); // or redirect to '/signup'
  }

  // protected page
  router.get("/secret", isLoggedIn, (req, res) => {
    console.log(req.session.passport.user.id);
    res.sendFile(__dirname + "/html/secret.html");
  });

  // logout route
  router.get("/logout", (req, res) => { 
    req.logout(function (err) {
      if (err) {
        return err;
      }
    });
    res.redirect("/login");
  });

  router.get("/loggedIn", isLoggedIn, (req, res) => {
    console.log(req.session.passport.user.id);
    console.log("hello");
    res.send(`logged in `);
  });

  //error page
  router.get("/error", (req, res) => {
    res.send("You are not logged in!");
  });

  //login route
  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/secret",
      failureRedirect: "/error",
    })
  );

  // signup route
  router.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/login",
      failureRedirect: "/error",
    })
  );

  // serving html pages
  router.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/index.html");
  });

  router.get("/login", (req, res) => {
    res.sendFile(__dirname + "/html/login.html");
  });

  router.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/html/signup.html");
  });

  return router;
};
