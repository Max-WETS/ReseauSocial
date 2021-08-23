const FriendList = require("../models/FriendList");
const ObjectID = require("mongoose").Types.ObjectId;

// get friends
module.exports.getFriends = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    const friendList = await FriendList.findById(req.params.id);
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
    // add friend to the sender's list
    try {
      let friendList = await FriendList.findOne({ userId: req.body.userId });
      if (!friendList)
        newFriendList = new FriendList({ userId: req.body.userId });
      friendList = await newFriendList.save();
      if (
        !friendList.friendsList.some(
          (friend) => friend.friendId === req.params.id
        )
      ) {
        await friendList.updateOne({
          $push: {
            friendsList: {
              friendId: req.params.id,
              status: "invitation en cours",
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

    // add the sender to the receiver's list
    try {
      let friendList = await FriendList.findOne({ userId: req.params.id });
      if (!friendList)
        newFriendList = new FriendList({ userId: req.params.id });
      friendList = await newFriendList.save();
      if (
        !friendList.friendsList.some(
          (friend) => friend.friendId === req.body.userId
        )
      ) {
        await friendList.updateOne({
          $push: {
            friendsList: {
              friendId: req.body.userId,
              status: "en attente de confirmation",
            },
          },
        });
        res.status(200).json("friend invitation received");
      } else {
        res.status(403).json("this person is already your friend");
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
    // remove friend from the sender's list
    try {
      let friendList = await FriendList.findOne({ userId: req.body.userId });
      !friendList && res.status(400).json("This user has no friends");

      if (
        !friendList.friendsList.find(
          (friend) => friend.friendId === req.params.id
        )
      ) {
        await friendList.updateOne({
          $pull: {
            friendsList: {
              friendId: req.params.id,
            },
          },
        });
        res.status(200).json("friend removed from your list");
      } else {
        res.status(403).json("this user is not your friend");
      }
    } catch (err) {
      res.status(500).json(err);
    }

    // remove the sender from the receiver's list
    try {
      let friendList = await FriendList.findOne({ userId: req.params.id });
      !friendList && res.status(400).json("This user has no friends");
      if (
        friendList.friendsList.find(
          (friend) => friend.friendId === req.body.userId
        )
      ) {
        await friendList.updateOne({
          $pull: {
            friendsList: {
              friendId: req.body.userId,
            },
          },
        });
        res.status(200).json("you were remove from this friend's list");
      } else {
        res.status(403).json("this person is not your friend");
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
      if (!friendList)
        newFriendList = new FriendList({ userId: req.params.id });
      friendList = await newFriendList.save();

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
