import Header from "../components/Header";
import ProfilePics from "../components/profile/ProfilePics";
import ProfileMenu from "../components/profile/ProfileMenu";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function Profile() {
  const { user, dispatch } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [friends, setFriends] = useState(user.userFriends);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await axios.get(`/users/${user.userId}`);
      setUserData(res.data);
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsDataList = [];
        const users = await axios.get("/users");
        const friendsList = await axios.get(`/friends/${user.userId}`);
        const friendsListData = friendsList.data;

        for (let friend of friendsListData) {
          const usersData = users.data;
          const userDataArray = usersData.filter(
            (user) => user._id === friend.friendId
          );
          const userData = userDataArray[0];
          const friendFinal = friend;
          friendFinal["username"] = userData.username;
          friendFinal["profilePicture"] = userData.profilePicture;
          friendsDataList.push(friendFinal);
        }
        setFriends(friendsDataList);
        dispatch({ type: "FRIENDS_UPDATE", payload: friendsDataList });
      } catch (err) {
        console.log(err);
      }
    };
    fetchFriends();
  }, [user, dispatch]);

  return (
    <>
      <Header userData={userData} />
      <ProfilePics userData={userData} />
      <ProfileMenu userData={userData} friends={friends} />
    </>
  );
}

export default Profile;
