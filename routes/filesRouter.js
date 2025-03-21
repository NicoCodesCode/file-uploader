const { Router } = require("express");
const filesController = require("../controllers/filesController");

const router = Router();

router
  .route("/upload")
  .get(filesController.renderUploadFilePage)
  .post(filesController.uploadFile);

module.exports = router;
