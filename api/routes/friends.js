const FriendList = require("../models/FriendList");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const friendController = require("../controllers/friendController");

// get friends
router.get("/:id", friendController.getFriends);
// add a friend
router.post("/:id/add", friendController.addFriend);
// remove a friend
router.put("/:id/remove", friendController.removeFriend);
// recommend a friend
router.post("/:id/recommend", friendController.recommendFriend);
// accept friend request
router.put("/:id/accept", friendController.acceptFriend);
// get list of friends you can recommend a friend to:
router.post("/:id/recommendations", friendController.getRecommendations);

module.exports = router;
