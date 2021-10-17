import { axiosInstance } from "./config";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axiosInstance.post("/auth/login", userCredential);
    const user = await axiosInstance.get(`/users/${res.data.user}`);
    const friends = await axiosInstance.get(`/friends/${res.data.user}`);
    const users = await axiosInstance.get(`/users`);

    // const friendsArr = [...friends.data];
    // const usersArr = [...users.data];
    for (let friend of friends.data) {
      const userData = users.data.filter((u) => u._id === friend.friendId)[0];
      friend.username = userData.username;
      friend.profilePicture = userData.profilePicture;
    }

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        userId: res.data.user,
        username: user.data.username,
        isAdmin: user.data.isAdmin,
        profilePicture: user.data.profilePicture,
        userFriends: friends.data,
      },
    });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};
