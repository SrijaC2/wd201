/* eslint-disable no-unused-vars */
const { request, response } = require("express");
const express = require("express");
const csrf = require("tiny-csrf");
const app = express();
const { Sport, User, Sessions, playerSessions } = require("./models");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.json());

app.set("view engine", "ejs");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");

const flash = require("connect-flash");
app.set("views", path.join(__dirname, "views"));
app.use(flash());

const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(
  session({
    secret: "my-super-secret-key-21728172615261563",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async function (user) {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        // eslint-disable-next-line n/handle-callback-err
        .catch((error) => {
          return done(null, false, {
            message: "Your account doesn't exist, try signing up",
          });
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.get("/", async (request, response) => {
  if (request.user) {
    return response.redirect("/sport");
  }
  return response.render("index", {
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/sport",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log(request.user);
    const loggedInUserRole = request.user.role;
    console.log(loggedInUserRole);

    const allSports = await Sport.getSports();
    if (request.accepts("html")) {
      response.render("sports", {
        allSports,
        role: loggedInUserRole,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        allSports,
      });
    }
  }
);

app.post(
  "/sport",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("Creating a sport", request.body);
    try {
      const sport = await Sport.addSport({
        title: request.body.title,
        userId: request.user.id,
      });
      return response.redirect("/sport");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Signup",
    csrfToken: request.csrfToken(),
  });
});

app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);
  if (request.body.password.length < 8) {
    request.flash("error", "Password length can't less than 8");
    return response.redirect("/signup");
  }
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      role: request.body.role,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/sport");
    });
  } catch (error) {
    console.log(error);
    request.flash("error", error.errors[0].message);
    return response.redirect("/signup");
  }
});

app.post(
  "/createSession/:sportId",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    if (request.body.playersNeeded < 0) {
      request.flash("error", "Number of players needed can't less than 0");
      return response.redirect(`/sport/sessions/${request.params.sportId}`);
    }
    console.log(request.body);
    try {
      console.log("Sessions name", request.body.sessionName);
      const session = await Sessions.addSession({
        sessionName: request.body.sessionName,
        date: request.body.date,
        time: request.body.time,
        venue: request.body.venue,
        playersNeeded: request.body.playersNeeded,
        userId: request.user.id,
        sportId: request.params.sportId,
      });
      console.log(session);
      const names = request.body.names;
      const nameArr = names.split(",");
      console.log(session.id);
      for (let i = 0; i < nameArr.length; i++) {
        await playerSessions.create({
          player_name: nameArr[i],
          session_id: session.id,
        });
      }
      return response.redirect(`/sport/${request.params.sportId}`);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.get("/login", (request, response) => {
  if (request.user) {
    return response.redirect("/sport");
  }
  return response.render("login", {
    title: "Login",
    csrfToken: request.csrfToken(),
  });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (request, response) {
    console.log(request.user);
    response.redirect("/sport");
  }
);

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});

app.get(
  "/createSport",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    console.log(request.user.id);
    const allSportsPart = await Sport.UsergetSports(request.user.id);
    console.log(allSportsPart);
    try {
      response.render("createSpt", {
        csrfToken: request.csrfToken(),
        allSportsPart,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

app.get(
  "/sport/:sportId",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    console.log("We have to consider sport with ID:", request.params.sportId);
    const sport = await Sport.findByPk(request.params.sportId);
    const allSessionPart = await Sessions.UsergetSession(request.user.id);
    console.log(allSessionPart);
    if (request.accepts("html")) {
      try {
        response.render("ParticularSpt", {
          title: sport.title,
          sport,
          allSessionPart,
          csrfToken: request.csrfToken(),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      response.json({
        allSessionPart,
      });
    }
  }
);

app.get(
  "/sport/sessions/:sportId",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    const sport = await Sport.findByPk(request.params.sportId);
    try {
      response.render("createSession", {
        title: sport.title,
        sport,
        csrfToken: request.csrfToken(),
      });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = app;
