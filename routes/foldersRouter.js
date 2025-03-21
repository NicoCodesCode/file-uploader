const { Router } = require("express");
const foldersController = require("../controllers/foldersController");

const router = Router();

router
  .route("/create")
  .get(foldersController.renderCreateFolderPage)
  .post(foldersController.createFolder);

router.get("/:folderId", foldersController.openFolder);

module.exports = router;
