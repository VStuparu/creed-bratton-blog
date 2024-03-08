function getContactPage(request, response) {
  response.render("contact");
}

function getAboutPage(request, response) {
  response.render("about");
}

module.exports = {
  getContactPage: getContactPage,
  getAboutPage: getAboutPage,
};
