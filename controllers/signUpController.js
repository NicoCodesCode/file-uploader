const validateUser = require("../validations/userValidator");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { insertUser } = require("../prisma/queries/userQueries");

const renderSignUpPage = (req, res) => {
  res.render("signUpForm", {
    title: "Sign Up",
    errors: req.errors ? req.errors : [],
    invalidInput: req.errors ? req.body : {},
  });
};

const signUpUser = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.errors = errors.array();
      return next();
    }

    const user = req.body;

    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await insertUser({ ...user, password: hashedPassword });
      res.redirect("/log-in");
    } catch (error) {
      next(error);
    }
  },
  renderSignUpPage,
];

module.exports = { renderSignUpPage, signUpUser };
