const mongoose = require("mongoose");

const FriendListSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    friendsList: [
      {
        friendId: String,
        status: {
          type: String,
          enum: [
            "invitation en cours",
            "en attente de confirmation",
            "confirmé",
            "recommandé",
          ],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FriendList", FriendListSchema);
