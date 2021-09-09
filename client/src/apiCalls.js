import axios from "axios";
import { axiosInstance } from "./config";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/auth/login", userCredential);
    const user = await axios.get(`/users/${res.data.user}`);
    const friends = await axios.get(`/friends/${res.data.user}`);
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        userId: res.data.user,
        username: user.data.username,
        profilePicture: user.data.profilePicture,
        userFriends: friends.data,
      },
    });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};
