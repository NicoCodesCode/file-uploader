const { Router } = require("express");
const filesController = require("../controllers/filesController");

const router = Router();

router
  .route("/upload")
  .get(filesController.renderUploadFilePage)
  .post(filesController.uploadFile);

router.get("/:fileId/download", filesController.downloadFile);

router
  .route("/:fileId/delete")
  .get(filesController.renderDeleteFilePage)
  .delete(filesController.deleteFile);

router.get("/:fileId", filesController.viewDetails);

module.exports = router;
