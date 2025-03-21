const { body } = require("express-validator");
const { getUserByUsername } = require("../prisma/queries");

const emptyErr = "Please enter your";
const lengthErr = "must be between 1 and 20 characters";
const alphaErr = "can't contain special symbols or numbers";

const validateUser = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage(`${emptyErr} first name`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`First name ${lengthErr}`)
    .isAlpha(undefined, { ignore: " " })
    .withMessage(`First name ${alphaErr}`),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage(`${emptyErr} last name`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`Last name ${lengthErr}`)
    .isAlpha(undefined, { ignore: " " })
    .withMessage(`Last name ${alphaErr}`),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`${emptyErr} username`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`Username ${lengthErr}`)
    .custom(async (username) => await getUserByUsername(username))
    .withMessage("There is already a user with that username"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`${emptyErr} password`)
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((password, { req }) =>
      password === req.body.password ? true : false
    )
    .withMessage("Passwords don't match"),
];

module.exports = validateUser;
