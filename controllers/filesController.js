const upload = require("../multer/upload");
const { insertFile, getFileById } = require("../prisma/queries");

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
      await insertFile(req.file.filename, res.locals.currentUser.id);
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
    res.render("fileDetails", { title: "File Details", file });
  } catch (error) {
    next(error);
  }
};

module.exports = { renderUploadFilePage, uploadFile, viewDetails };
