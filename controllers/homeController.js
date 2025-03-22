const { getAllFolders, getAllFiles } = require("../prisma/queries");

const renderHomePage = async (req, res) => {
  res.render("home", {
    title: "File Uploader",
    folders: await getAllFolders(),
    files: await getAllFiles(),
  });
};

module.exports = { renderHomePage };
