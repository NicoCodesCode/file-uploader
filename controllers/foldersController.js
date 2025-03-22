const validateFolder = require("../validations/folderValidator");
const { validationResult } = require("express-validator");
const {
  insertFolder,
  getFolderById,
  updateFolder,
  deleteFolderById,
  getFilesInsideFolder,
  deleteAllFilesInFolder,
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
      await insertFolder(folderName, res.locals.currentUser.id);
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
  renderCreateFolderPage,
];

const openFolder = async (req, res, next) => {
  try {
    const folder = await getFolderById(Number(req.params.folderId));
    const files = await getFilesInsideFolder(
      folder.id,
      res.locals.currentUser.id
    );
    res.render("folder", { title: folder.name, folderId: folder.id, files });
  } catch (error) {
    next(error);
  }
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

const renderDeleteFolderPage = (req, res) => {
  res.render("delete", {
    title: "Delete Folder",
    folderId: req.params.folderId,
    actionPath: `/folders/${req.params.folderId}`,
    alertMessage: "folder and its files",
  });
};

const deleteFolder = async (req, res, next) => {
  const folderId = Number(req.params.folderId);

  try {
    await deleteAllFilesInFolder(folderId);
    await deleteFolderById(folderId);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  renderCreateFolderPage,
  createFolder,
  openFolder,
  renderEditFolderPage,
  editFolder,
  renderDeleteFolderPage,
  deleteFolder,
};
