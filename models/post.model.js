const mongodb = require("mongodb");
const db = require("../data/database");

class Post {
  constructor(postData) {
    this.title = postData.title;
    this.summary = postData.summary;
    this.content = postData.content;
    this.image = postData.image;
    this.updateImageData();
    if (postData._id) {
      this.id = postData._id.toString();
    }
  }

  static async findById(postId) {
    let pId;
    try {
      pId = new mongodb.ObjectId(postId);
    } catch (error) {
      throw error;
    }

    const post = await db.getDb().collection("posts").findOne({ _id: pId });

    if (!post) {
      const error = new Error("Could not find post with provided id");
      error.code = 404;
      throw error;
    }

    return new Post(post);
  }

  static async findAll() {
    const posts = await db.getDb().collection("posts").find().toArray();

    return posts.map(function (postDocument) {
      return new Post(postDocument);
    });
  }

  updateImageData() {
    this.imagePath = `post-data/images/${this.image}`;
    this.imageUrl = `/posts/assets/images/${this.image}`;
  }

  async save() {
    const postData = {
      title: this.title,
      summary: this.summary,
      content: this.content,
      image: this.image,
    };

    if (this.id) {
      const postId = new mongodb.ObjectId(this.id);

      if (!this.image) {
        delete postData.image;
      }
      await db.getDb().collection("posts").updateOne(
        { _id: postId },
        {
          $set: postData,
        }
      );
    } else {
      await db.getDb().collection("posts").insertOne(postData);
    }
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  async remove() {
    const postId = new mongodb.ObjectId(this.id);
    await db.getDb().collection("posts").deleteOne({ _id: postId });
  }
}

module.exports = Post;
