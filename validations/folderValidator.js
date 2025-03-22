const { body } = require("express-validator");
const { getFolderByName } = require("../prisma/queries");

const emptyErr = "Please enter a";
const alphanumericErr = "can't contain special symbols";

const validateFolder = [
  body("folderName")
    .notEmpty()
    .withMessage(`${emptyErr} folder name`)
    .isAlphanumeric(undefined, { ignore: " " })
    .withMessage(`Folder name ${alphanumericErr}`)
    .custom(async (folderName) =>
      (await getFolderByName(folderName)) ? Promise.reject() : true
    )
    .withMessage("There is already a folder with that name"),
];

module.exports = validateFolder;
