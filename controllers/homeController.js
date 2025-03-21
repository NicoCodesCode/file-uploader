function renderHomePage(req, res) {
  res.render("home", { title: "File Uploader" });
}

module.exports = { renderHomePage };
