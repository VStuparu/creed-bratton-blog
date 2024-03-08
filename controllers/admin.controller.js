const Post = require("../models/post.model");

function getNewPost(request, response) {
  response.render("admin/add-post");
}

async function addNewPost(request, response, next) {
  const post = new Post({ ...request.body, image: request.file.filename });

  try {
    await post.save();
  } catch (error) {
    next(error);
  }

  response.redirect("/");
}

async function getUpdatePost(request, response, next) {
  try {
    const post = await Post.findById(request.params.id);
    response.render("admin/update-post", { post: post });
  } catch (error) {
    next(error);
  }
}

async function updatePost(request, response, next) {
  const post = new Post({ ...request.body, _id: request.params.id });

  if (request.file) {
    post.replaceImage(request.file.filename);
  }

  try {
    await post.save();
  } catch (error) {
    next(error);
  }
  response.redirect("/posts");
}

async function deletePost(request, response, next) {
  let post;
  try {
    post = await Post.findById(request.params.id);
    await post.remove();
  } catch (error) {
    next(error);
    return;
  }

  response.json({ message: "deleted product!" });
}

module.exports = {
  getNewPost: getNewPost,
  addNewPost: addNewPost,
  getUpdatePost: getUpdatePost,
  updatePost: updatePost,
  deletePost: deletePost,
};
