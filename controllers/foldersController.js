const validateFolder = require("../validations/folderValidator");
const { validationResult } = require("express-validator");
const {
  insertRootFolder,
  insertSubfolder,
  getFolderById,
  getAllSubfolders,
  updateFolder,
  deleteFolderById,
  deleteAllSubfolders,
} = require("../prisma/queries/folderQueries");
const {
  getFilesInsideFolder,
  deleteAllFilesInFolder,
} = require("../prisma/queries/fileQueries");

const renderCreateFolderPage = (req, res) => {
  res.render("folderConfigForm", {
    title: "Create Folder",
    action: "Create",
    actionPath: req.params.folderId
      ? `/folders/${req.params.folderId}/create`
      : "/folders/create",
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
    const userId = res.locals.currentUser.id;
    const parentFolderId = Number(req.params.folderId);

    try {
      if (parentFolderId) {
        await insertSubfolder(folderName, parentFolderId, userId);
        return res.redirect(`/folders/${parentFolderId}`);
      }

      await insertRootFolder(folderName, userId);
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
  renderCreateFolderPage,
];

const openFolder = async (req, res, next) => {
  try {
    const userId = res.locals.currentUser.id;
    const folderId = Number(req.params.folderId);
    const folder = await getFolderById(folderId);

    if (!req.session.folderHistory) {
      req.session.folderHistory = [];
    }

    const existingIndex = req.session.folderHistory.indexOf(folderId);

    if (existingIndex !== -1) {
      req.session.folderHistory = req.session.folderHistory.slice(
        0,
        existingIndex + 1
      );
    } else {
      req.session.folderHistory.push(folderId);
      if (req.session.folderHistory.length > 20) {
        req.session.folderHistory.shift();
      }
    }

    const subfolders = await getAllSubfolders(folder.id, userId);
    const files = await getFilesInsideFolder(folder.id, userId);

    res.render("folder", {
      title: folder.name,
      folderId: folder.id,
      subfolders,
      files,
      previousFolderId:
        req.session.folderHistory.length > 1
          ? req.session.folderHistory[req.session.folderHistory.length - 2]
          : null,
    });
  } catch (error) {
    next(error);
  }
};

const renderEditFolderPage = (req, res) => {
  res.render("folderConfigForm", {
    title: "Edit Folder",
    action: "Edit",
    actionPath: `/folders/${req.params.folderId}/edit?_method=PUT`,
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
    await deleteAllSubfolders(folderId);
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
