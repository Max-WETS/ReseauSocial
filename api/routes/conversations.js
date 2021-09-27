const router = require("express").Router();
const Conversation = require("../models/Conversation");
const conversationController = require("../controllers/conversationController");

//new conv
router.post("/", conversationController.newChat);
//get conv of a user
router.get("/:userId", conversationController.getChat);
//get conv by id
router.get("/chat-id/:conversationId", conversationController.getConv);
//add message to a conversation
router.post("/:conversationId/add", conversationController.newMessage);

module.exports = router;
