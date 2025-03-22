const upload = require("../multer/upload");

const renderUploadFilePage = (req, res) => {
  res.render("uploadFileForm", {
    title: "Upload a File",
    errors: req.errors ? req.errors : [],
  });
};

const uploadFile = [
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      req.errors = [{ msg: "Could not upload the file" }];
      return next();
    }

    res.redirect("/");
  },
  renderUploadFilePage,
];

module.exports = { renderUploadFilePage, uploadFile };
