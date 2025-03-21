// configure environment tables
require("dotenv").config();

// require local strategy for authentication
require("./auth/strategy");

// require express
const express = require("express");

// require all necessary libraries
const passport = require("passport");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("./prisma/queries");
const path = require("path");

// require all routers
const homeRouter = require("./routes/homeRouter");
const signUpRouter = require("./routes/signUpRouter");
const logInRouter = require("./routes/logInRouter");
const filesRouter = require("./routes/filesRouter");
const foldersRouter = require("./routes/foldersRouter");

// set up app
const app = express();
app.set("view engine", "ejs");

// set up middlewares
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// use routers
app.use("/", homeRouter);
app.use("/sign-up", signUpRouter);
app.use("/log-in", logInRouter);
app.get("/log-out", (req, res, next) => {
  req.logout((err) => (err ? next(err) : res.redirect("/")));
});
app.use("/files", filesRouter);
app.use("/folders", foldersRouter);

// middleware for next(error)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("errorPage", { title: "Error" });
});

// listen to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
