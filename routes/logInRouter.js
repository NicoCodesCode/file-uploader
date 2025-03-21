const { Router } = require("express");
const logInController = require("../controllers/logInController");
const passport = require("passport");

const router = Router();

router
  .route("/")
  .get(logInController.renderLogInPage)
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/log-in",
    })
  );

module.exports = router;
