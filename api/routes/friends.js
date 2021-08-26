const FriendList = require("../models/FriendList");
const router = require("express").Router();
const bcrypt = require("bcrypt");
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

module.exports = router;
