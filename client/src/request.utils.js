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

export const handleClickAccept = async (user, userData, dispatch) => {
  try {
    await axios.put(`/friends/${userData._id}/accept`, {
      userId: user.userId,
    });
    dispatch({ type: "ACCEPT_FRIEND", payload: userData._id });
  } catch (err) {
    console.log(err);
  }
};

export const handleClickRecommend = async (user, userData, dispatch) => {};

export const objectsEqual = (o1, o2) =>
  typeof o1 === "object" && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

export const arraysEqual = (a1, a2) =>
  a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
