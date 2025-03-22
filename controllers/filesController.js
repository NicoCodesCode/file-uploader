const upload = require("../multer/upload");
const { insertFile, getFileById } = require("../prisma/queries");
const { format } = require("date-fns");

const renderUploadFilePage = (req, res) => {
  res.render("uploadFileForm", {
    title: "Upload a File",
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
      await insertFile(req.file.filename, req.file.size);
      res.redirect("/");
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

module.exports = {
  renderUploadFilePage,
  uploadFile,
  viewDetails,
  renderDeleteFilePage,
};
