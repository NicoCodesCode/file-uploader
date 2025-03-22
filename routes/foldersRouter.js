const { Router } = require("express");
const foldersController = require("../controllers/foldersController");

const router = Router();

router
  .route("/create")
  .get(foldersController.renderCreateFolderPage)
  .post(foldersController.createFolder);

router
  .route("/:folderId/edit")
  .get(foldersController.renderEditFolderPage)
  .post(foldersController.editFolder);

router.get("/:folderId", foldersController.openFolder);

module.exports = router;
