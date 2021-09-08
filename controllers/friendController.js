const FriendList = require("../models/FriendList");
const ObjectID = require("mongoose").Types.ObjectId;

// get friends
module.exports.getFriends = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    const friendList = await FriendList.findOne({ userId: req.params.id });
    !friendList &&
      res
        .status(404)
        .json("This user doesn't exist or she/he has no friends yet");

    const friendsList = friendList.friendsList;
    res.status(200).json(friendsList);
  } catch (err) {
    res.status(500).json(err);
  }
};

// add friend
module.exports.addFriend = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  if (req.body.userId !== req.params.id) {
    try {
      // add friend to the sender's list or create a new one
      let senderFriendList = await FriendList.findOne({
        userId: req.body.userId,
      });
      if (!senderFriendList) {
        const newSenderFriendList = new FriendList({ userId: req.body.userId });
        senderFriendList = await newSenderFriendList.save();
      }

      // add yourself to the receiver's friends list or create a new one
      let receiverFriendList = await FriendList.findOne({
        userId: req.params.id,
      });
      if (!receiverFriendList) {
        const newReceiverFriendList = new FriendList({ userId: req.params.id });
        receiverFriendList = await newReceiverFriendList.save();
      }

      // check if either user is already friend with the other
      if (
        !senderFriendList.friendsList.some(
          (friend) => friend.friendId === req.params.id
        ) &&
        !receiverFriendList.friendsList.some(
          (friend) => friend.friendId === req.body.userId
        )
      ) {
        await senderFriendList.updateOne({
          $push: {
            friendsList: {
              friendId: req.params.id,
              status: "invitation en cours",
            },
          },
        });
        await receiverFriendList.updateOne({
          $push: {
            friendsList: {
              friendId: req.body.userId,
              status: "en attente de confirmation",
            },
          },
        });

        res.status(200).json("friend invitation sent");
      } else {
        res.status(403).json("you're already friend with this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can't add yourself as a friend");
  }
};

// remove a friend
module.exports.removeFriend = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  if (req.body.userId !== req.params.id) {
    try {
      let friendRequestRejection = false;
      // remove friend from the sender's list
      const senderFriendList = await FriendList.findOne({
        userId: req.body.userId,
      });
      !senderFriendList && res.status(400).json("You have no friends");

      // remove the sender from the receiver's list
      const receiverFriendList = await FriendList.findOne({
        userId: req.params.id,
      });
      !receiverFriendList && res.status(400).json("This user has no friends");

      // check if it's a friend request rejection
      const senderObject = receiverFriendList.friendsList.find(
        (friend) => friend.friendId === req.body.userId
      );
      if (senderObject.status === "invitation en cours")
        friendRequestRejection = true;

      // check if both users are already friends with one another
      if (
        senderFriendList.friendsList.find(
          (friend) => friend.friendId === req.params.id
        ) &&
        receiverFriendList.friendsList.find(
          (friend) => friend.friendId === req.body.userId
        )
      ) {
        await senderFriendList.updateOne({
          $pull: {
            friendsList: {
              friendId: req.params.id,
            },
          },
        });

        await receiverFriendList.updateOne({
          $pull: {
            friendsList: {
              friendId: req.body.userId,
            },
          },
        });

        if (friendRequestRejection) {
          res.status(200).json("friend request rejected");
        } else {
          res.status(200).json("friend removed from your list");
        }
      } else {
        res.status(403).json("this user is not your friend");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can't remove yourself as a friend");
  }
};

// recommend a friend to another friend
module.exports.recommendFriend = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res
      .status(400)
      .send("ID of the receiving friend unknown : " + req.params.id);

  if (!ObjectID.isValid(req.body.recommendedFriendId))
    return res
      .status(400)
      .send(
        "ID of the recommended friend unknown : " + req.body.recommendedFriendId
      );

  if (req.body.userId !== req.params.id) {
    try {
      let friendList = await FriendList.findOne({ userId: req.params.id });
      if (!friendList) {
        const newFriendList = new FriendList({ userId: req.params.id });
        friendList = await newFriendList.save();
      }

      if (
        !friendList.friendsList.some(
          (friend) => friend.friendId === req.body.recommendedFriendId
        )
      ) {
        await friendList.updateOne({
          $push: {
            friendsList: {
              friendId: req.body.userId,
              status: "recommandé",
            },
          },
        });
        res.status(200).json("friend recommendation received");
      } else {
        res.status(403).json("this friend is already your friend's friend");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can't recommend yourself as a friend");
  }
};

// accept friend request
module.exports.acceptFriend = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  if (req.body.userId !== req.params.id) {
    try {
      // request the sender's friend list
      const senderFriendList = await FriendList.findOne({
        userId: req.body.userId,
      });
      !senderFriendList && res.status(400).json("you have no friends");

      // request the receiver's friend list
      const receiverFriendList = await FriendList.findOne({
        userId: req.params.id,
      });
      !receiverFriendList && res.status(400).json("this user has no friends");

      // check if both users are already friends
      if (
        senderFriendList.friendsList.some(
          (friend) => friend.friendId === req.params.id
        ) &&
        receiverFriendList.friendsList.some(
          (friend) => friend.friendId === req.body.userId
        )
      ) {
        await senderFriendList.updateOne(
          {
            $set: {
              "friendsList.$[friend].status": "confirmé",
            },
          },
          { multi: true, arrayFilters: [{ "friend.friendId": req.params.id }] }
        );
        await receiverFriendList.updateOne(
          {
            $set: {
              "friendsList.$[friend].status": "confirmé",
            },
          },
          {
            multi: true,
            arrayFilters: [{ "friend.friendId": req.body.userId }],
          }
        );

        res.status(200).json("friend invitation accepted");
      } else {
        res.status(403).json("you're not friend with this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can't accept yourself as a friend");
  }
};