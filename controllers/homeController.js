const { getAllFolders, getFilesOutsideFolders } = require("../prisma/queries");

const renderHomePage = async (req, res, next) => {
  try {
    const folders = await getAllFolders();
    const files = await getFilesOutsideFolders();
    res.render("home", { title: "File Uploader", folders, files });
  } catch (error) {
    next(error);
  }
};

module.exports = { renderHomePage };
