const validateFolder = require("../validations/folderValidator");
const { validationResult } = require("express-validator");
const { insertFolder } = require("../prisma/queries");

const renderCreateFolderPage = (req, res) => {
  if (req.errors)
    return res.render("createFolderForm", {
      title: "Create Folder",
      errors: req.errors,
      invalidInput: req.body,
    });

  res.render("createFolderForm", { title: "Create Folder", invalidInput: {} });
};

const createFolder = [
  validateFolder,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.errors = errors.array();
      return next();
    }

    const folderName = req.body.folderName;

    try {
      await insertFolder(folderName);
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
  renderCreateFolderPage,
];

module.exports = { renderCreateFolderPage, createFolder };
