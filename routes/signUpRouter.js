const { Router } = require("express");
const signUpController = require("../controllers/signUpController");

const router = Router();

router
  .route("/")
  .get(signUpController.renderSignUpPage)
  .post(signUpController.signUpUser);

module.exports = router;
