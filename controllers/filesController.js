const upload = require("../multer/upload");

const renderUploadFilePage = (req, res) => {
  if (req.errors)
    return res.render("uploadFileForm", {
      title: "Upload a File",
      errors: req.errors,
    });

  res.render("uploadFileForm", { title: "Upload a File" });
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
