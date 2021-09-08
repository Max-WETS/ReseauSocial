const router = require("express").Router();
const postController = require("../controllers/postController");
const Post = require("../models/Post");
const User = require("../models/User");

// create a post
router.post("/profile/:id", postController.createPost);
// update a post
router.put("/:id", postController.updatePost);
// delete a post
router.delete("/:id", postController.deletePost);
// get a user's timeline
router.get("/timeline/:id", postController.getPosts);

module.exports = router;
