const Post = require("../models/Post");
const User = require("../models/User");
const ObjectID = require("mongoose").Types.ObjectId;

// create post
module.exports.createPost = async (req, res) => {
  const newPost = new Post({
    userId: req.body.userId,
    desc: req.body.desc,
    img: req.body.img,
    receiverId: req.params.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

// update post
module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    const post = Post.findById(req.params.id);
    if (post.userId === req.body.userId)
      res.status(500).json("you can't update another user's post");

    const updatedRecord = {
      desc: req.body.desc,
    };

    await post.updateOne({ $set: updatedRecord });
    res.status(200).json("the post has been updated");
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete post
module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  Post.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else res.status(500).json(err);
  });
};

// get a user's timeline
module.exports.getPosts = async (req, res) => {
  try {
    const userPosts = await Post.find({ receiverId: req.params.id }).select(
      "-receiverId"
    );
    res.status(200).json(userPosts);
  } catch (err) {
    res.status.json(err);
  }
};
