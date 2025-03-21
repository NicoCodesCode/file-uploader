const renderLogInPage = (req, res) => {
  res.render("logInForm", { title: "Log In" });
};

module.exports = { renderLogInPage };
