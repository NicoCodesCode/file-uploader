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
  .put(foldersController.editFolder);

router
  .route("/:folderId/delete")
  .get(foldersController.renderDeleteFolderPage)
  .delete(foldersController.deleteFolder);

router.get("/:folderId", foldersController.openFolder);

module.exports = router;
