const { getAllFolders, getFilesOutsideFolders } = require("../prisma/queries");

const renderHomePage = async (req, res, next) => {
  try {
    if (res.locals.currentUser) {
      const userId = res.locals.currentUser.id;
      const folders = await getAllFolders(userId);
      const files = await getFilesOutsideFolders(userId);
      return res.render("home", { title: "File Uploader", folders, files });
    }
    res.render("home", { title: "File Uploader" });
  } catch (error) {
    next(error);
  }
};

module.exports = { renderHomePage };
