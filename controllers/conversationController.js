const Conversation = require("../models/Conversation");
const ObjectID = require("mongoose").Types.ObjectId;

//new conv
module.exports.newChat = async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get conv of a user
module.exports.getChat = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get conv by id
module.exports.getConv = async (req, res) => {
  if (!ObjectID.isValid(req.params.conversationId))
    return res
      .status(400)
      .send("Conversation ID unknown : " + req.params.conversationId);

  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
    });
    !conversation && res.status(404).json("This conversation doesn't exist");
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//add message to a conversation
module.exports.newMessage = async (req, res) => {
  if (!ObjectID.isValid(req.params.conversationId))
    return res
      .status(400)
      .send("Conversation ID unknown : " + req.params.conversationId);

  try {
    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: req.params.conversationId,
      },
      {
        $push: {
          messages: {
            senderId: req.body.senderId,
            message: req.body.message,
          },
        },
      },
      { new: true }
    );

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
