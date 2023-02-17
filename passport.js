const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const knex = require("knex")({
  client: "pg",
  connection: {
    database: "journal_list",
    user: "postgres",
    password: "postgres",
  },
});

module.exports = (app,passport) => {
  app.use(passport.initialize());
  app.use(passport.session());

//Login
  passport.use(
    "local-login",
    new LocalStrategy(
      async (username, password, done) => {
        //Check if the user exists in the database
        const user = await knex("users").where({ username }).first(); // {id: 1, email: a@a, password: 2@10.....}

        if (!user) {
          //if user does not exists then don't authenticate the user
          return done(null, false, {
            message: "User does not exist in the database",
          });
        }
        //hashing the entered password and comparing with the hash password from the database
        const result = await bcrypt.compare(password, user.password);
        return result
          ? done(null, user)
          : done(null, false, { message: "Incorrect Password" });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    let users = await knex("users").where({ id: id });
    if (users.length == 0) {
      return done(new Error(`Wrong user id ${id}`));
    }
    let user = users[0];
    return done(null, user);
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      //PassportJS expects username by default, if you're using email instead of username, add usernameField property and set it's value to "email"
      // passReqToCallback allows us to grab inputs other than username and password. For example name, phone and so on
      // { usernameField: "username", passReqToCallback: true },
      async (username, password, done) => {
        //Check if the user exists in the database
        let user = await knex("users").where({ username }).first(); // {id: 1, email..} | undefined
        if (user) {
          //if user exists then don't authenticate the user
          return done(null, false, {
            message: "Email already exists in the database",
          });
        }

        // let name = req.body.name;
        let salt = 10; //adding random string to make the hash less predictable
        const hash = await bcrypt.hash(password, salt); //hash password
        let newUser = {
          // name,
          username,
          password: hash,
        };
        //insert new user credentials to the database
        const id = await knex("users").insert(newUser).returning("id"); //[{id: 1}]
        newUser.id = id[0]["id"];
        //authenticate user
        return done(null, newUser);
      }
    )
  );
  
};