module.exports = (express) => {
  const router = express.Router();

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login"); // or redirect to '/signup'
  }


  router.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login");
  });

  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/",
      failureRedirect: "/error",
    })
  );

  router.get("/error", (req, res) => {
    res.send("You are not logged in!");
  });

  router.get("/", (req, res) => {
    res.sendFile(__dirname + "/index");
  });

  router.get("/logout", (req, res) => { 
  req.logout(function (err) {
    if (err) {
      return err;
    }
  });
    res.redirect("/login");
  });

  return router;
  
};