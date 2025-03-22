const upload = require("../multer/upload");
const {
  insertFile,
  getFileById,
  deleteFileById,
} = require("../prisma/queries");
const { format } = require("date-fns");

const renderUploadFilePage = (req, res) => {
  res.render("uploadFileForm", {
    title: "Upload a File",
    actionPath: req.params.folderId
      ? `/folders/${req.params.folderId}/upload`
      : `/files/upload`,
    errors: req.errors ? req.errors : [],
  });
};

const uploadFile = [
  upload.single("file"),
  async (req, res, next) => {
    if (!req.file) {
      req.errors = [{ msg: "Could not upload the file" }];
      return next();
    }

    try {
      await insertFile(
        req.file.filename,
        req.file.size,
        req.params.folderId ? Number(req.params.folderId) : null,
        res.locals.currentUser.id
      );
      res.redirect(
        req.params.folderId ? `/folders/${req.params.folderId}` : "/"
      );
    } catch (error) {
      next(error);
    }
  },
  renderUploadFilePage,
];

const viewDetails = async (req, res, next) => {
  try {
    const file = await getFileById(Number(req.params.fileId));
    res.render("fileDetails", { title: "File Details", file, format });
  } catch (error) {
    next(error);
  }
};

const renderDeleteFilePage = (req, res) => {
  res.render("delete", {
    title: "Delete File",
    fileId: req.params.fileId,
    actionPath: `/files/${req.params.fileId}`,
    alertMessage: "file",
  });
};

const deleteFile = async (req, res, next) => {
  try {
    await deleteFileById(Number(req.params.fileId));
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  renderUploadFilePage,
  uploadFile,
  viewDetails,
  renderDeleteFilePage,
  deleteFile,
};
