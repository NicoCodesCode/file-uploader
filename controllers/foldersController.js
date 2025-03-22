const validateFolder = require("../validations/folderValidator");
const { validationResult } = require("express-validator");
const {
  insertFolder,
  getFolderById,
  updateFolder,
} = require("../prisma/queries");

const renderCreateFolderPage = (req, res) => {
  res.render("folderConfigForm", {
    title: "Create Folder",
    action: "Create",
    folderId: req.params.folderId,
    errors: req.errors ? req.errors : [],
    invalidInput: req.errors ? req.body : {},
  });
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

const openFolder = async (req, res) => {
  const folder = await getFolderById(Number(req.params.folderId));
  res.render("folder", { title: folder.name });
};

const renderEditFolderPage = (req, res) => {
  res.render("folderConfigForm", {
    title: "Edit Folder",
    action: "Edit",
    folderId: req.params.folderId,
    errors: req.errors ? req.errors : [],
    invalidInput: req.errors ? req.body : {},
  });
};

const editFolder = [
  validateFolder,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.errors = errors.array();
      return next();
    }

    const folderId = Number(req.params.folderId);
    const folderName = req.body.folderName;

    try {
      await updateFolder(folderId, folderName);
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
  renderEditFolderPage,
];

module.exports = {
  renderCreateFolderPage,
  createFolder,
  openFolder,
  renderEditFolderPage,
  editFolder,
};
