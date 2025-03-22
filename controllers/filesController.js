const upload = require("../multer/upload");
const { insertFile } = require("../prisma/queries");

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

module.exports = { renderUploadFilePage, uploadFile };
