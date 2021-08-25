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
router.put("/:id/recommend", friendController.recommendFriend);

module.exports = router;
