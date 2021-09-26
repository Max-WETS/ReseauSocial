const router = require("express").Router();
const Conversation = require("../models/Conversation");
const conversationController = require("../controllers/conversationController");

//new conv
router.post("/", conversationController.newChat);
//get conv of a user
router.get("/:userId", conversationController.getChat);

module.exports = router;
