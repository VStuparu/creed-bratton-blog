const Post = require("../models/post.model");

async function getAllPosts(request, response, next) {
  try {
    const posts = await Post.findAll();
    response.render("posts/all-posts", { posts: posts });
  } catch (error) {
    next(error);
  }
}

async function getPostDetails(request, response, next) {
  try {
    const post = await Post.findById(request.params.id);

    response.render("user/posts/post-details", { post: post });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllPosts: getAllPosts,
  getPostDetails: getPostDetails,
};
