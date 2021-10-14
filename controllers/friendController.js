const FriendList = require("../models/FriendList");
const User = require("../models/User");
const ObjectID = require("mongoose").Types.ObjectId;

// get friends lists
module.exports.getFriendsLists = async (req, res) => {
  const friendsLists = await FriendList.find();
  console.log("friends lists: ", friendsLists);
  res.status(200).json(friendsLists);
};

// get friends
module.exports.getFriends = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    let friendList = await FriendList.findOne({ userId: req.params.id });
    if (!friendList) {
      friendList = new FriendList({ userId: req.params.id });
      // res
      //   .status(200)
      //   .json("This user doesn't exist or she/he has no friends yet");
    }

    friendsList = friendList.friendsList;
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

      let recommendedFriendFriendsList = await FriendList.findOne({
        userId: req.body.recommendedFriendId,
      });
      if (!recommendedFriendFriendsList) {
        const newRecommendedFriendFriendsList = new FriendList({
          userId: req.params.id,
        });
        recommendedFriendFriendsList =
          await newRecommendedFriendFriendsList.save();
      }

      if (
        !friendList.friendsList.some(
          (friend) => friend.friendId === req.body.recommendedFriendId
        ) &&
        !recommendedFriendFriendsList.friendsList.some(
          (friend) => friend.friendId === req.params.id
        )
      ) {
        await friendList.updateOne({
          $push: {
            friendsList: {
              friendId: req.body.recommendedFriendId,
              status: "recommandé",
            },
          },
        });
        await recommendedFriendFriendsList.updateOne({
          $push: {
            friendsList: {
              friendId: req.params.id,
              status: "a reçu une recommandation",
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

        // console.log("updated status");
        const acceptedFriend = senderFriendList.friendsList.find(
          (f) => f.friendId === req.params.id
        );
        // console.log("accepted friend", acceptedFriend);
        const acceptedFriendData = await User.findOne({ _id: req.params.id });
        // console.log("accepted friend data", acceptedFriendData);

        res.status(200).json({
          acceptedFriend: acceptedFriend,
          acceptedFriendData: acceptedFriendData,
        });
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

module.exports.getRecommendations = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  if (req.body.senderId !== req.params.id) {
    try {
      // request the sender's friend list
      let senderFriendList = await FriendList.findOne({
        userId: req.body.senderId,
      });
      senderFriendList = senderFriendList.friendsList
        .filter((f) => f.status === "confirmé")
        .map((friend) => {
          return friend.friendId.toString();
        });
      // console.log("sender's friends: " + senderFriendList);

      !senderFriendList &&
        res.status(400).json("you have no confirmed friends");

      // request the receiver's friend list
      let receiverFriendList = await FriendList.findOne({
        userId: req.params.id,
      });
      receiverFriendList = receiverFriendList.friendsList.map((friend) => {
        return friend.friendId.toString();
      });
      // console.log("receiver's friends: " + receiverFriendList);

      // remove receiver's friends from sender's list
      let recommendableFriends = senderFriendList.filter(
        (friendId) =>
          receiverFriendList.indexOf(friendId) < 0 && friendId !== req.params.id
      );
      !recommendableFriends &&
        res.status(400).json("this user is already your friends' friend");

      // get users
      const users = await User.find().select("-password");

      const recommendedUsers = [];
      recommendableFriends = recommendableFriends.map((friend) => {
        for (let user of users) {
          if (user._id.toString() === friend) {
            recommendedUsers.push(user);
          }
        }
      });
      res.status(200).json(recommendedUsers);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can't recommend friends to yourself");
  }
};
