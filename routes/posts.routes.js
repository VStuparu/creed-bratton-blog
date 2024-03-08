const express = require("express");

const postsController = require("../controllers/posts.controller");

const router = express.Router();

router.get("/posts", postsController.getAllPosts);

router.get("/posts/:id", postsController.getPostDetails);

module.exports = router;
