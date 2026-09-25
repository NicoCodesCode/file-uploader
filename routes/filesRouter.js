const { Router } = require("express");
const filesController = require("../controllers/filesController");
const ensureAuthenticated = require("../auth/ensureAuthenticated");

const router = Router();

router.use(ensureAuthenticated);

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
