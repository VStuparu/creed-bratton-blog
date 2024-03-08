const express = require("express");

const adminController = require("../controllers/admin.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = express.Router();

router.get("/posts/new", adminController.getNewPost);

router.post("/posts", imageUploadMiddleware, adminController.addNewPost);

router.get("/posts/:id", adminController.getUpdatePost);

router.post("/posts/:id", imageUploadMiddleware, adminController.updatePost);

router.delete("/posts/:id", adminController.deletePost);

module.exports = router;
