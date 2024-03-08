const express = require("express");

const router = express.Router();

const baseController = require("../controllers/base.controller");

router.get("/", function (request, response) {
  response.redirect("/posts");
});

router.get("/about", baseController.getAboutPage);

router.get("/contact", baseController.getContactPage);

router.get("/403", function (request, response) {
  response.status(403).render("shared/403");
});

module.exports = router;
