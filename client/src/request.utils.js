import axios from "axios";

export const handleClickAdd = async (user, userData, dispatch) => {
  try {
    await axios.post(`/friends/${userData._id}/add`, { userId: user.userId });
    const res = await axios.get(`/friends/${user.userId}`);
    const friendsList = res.data;
    const newFriendArray = friendsList.filter(
      (friend) => friend.friendId === userData._id
    );
    const newFriend = newFriendArray[0];
    newFriend["username"] = userData.username;
    newFriend["profilePicture"] = userData.profilePicture;

    dispatch({ type: "ADD_FRIEND", payload: newFriend });
  } catch (err) {
    console.log(err);
  }
};

export const handleClickRemove = async (user, userData, dispatch) => {
  try {
    await axios.put(`/friends/${userData._id}/remove`, {
      userId: user.userId,
    });
    dispatch({ type: "REMOVE_FRIEND", payload: userData._id });
  } catch (err) {
    console.log(err);
  }
};
