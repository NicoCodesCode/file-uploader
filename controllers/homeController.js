const { getAllFolders } = require("../prisma/queries");

const renderHomePage = async (req, res) => {
  res.render("home", {
    title: "File Uploader",
    folders: await getAllFolders(),
  });
};

module.exports = { renderHomePage };
