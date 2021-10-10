import Header from "../components/Header";
import ProfilePics from "../components/profile/ProfilePics";
import ProfileMenu from "../components/profile/ProfileMenu";
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../config";
import { arraysEqual } from "../request.utils";

function Profile({ connectedUsers }) {
  const { user, dispatch } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [friends, setFriends] = useState(user.userFriends);
  const userId = useParams().userId;
  const isUserProfile = user.userId === userId;
  const [profileUserStatus, setProfileUserStatus] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await axiosInstance.get(`/users/${userId}`);
      setUserData(res.data);
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const checkProfileUser = () => {
      if (!isUserProfile) {
        const friendsList = user.userFriends;
        const userFriendList = friendsList.filter(
          (friend) => friend.friendId === userData._id
        );
        const userFriend = userFriendList[0];
        if (userFriend !== undefined) {
          const status = userFriend.status;
          console.log(status);
          if (status === "confirmé") {
            setProfileUserStatus("friend");
          } else if (status === "invitation en cours") {
            setProfileUserStatus("friend request sent");
          } else {
            setProfileUserStatus("pending");
          }
        } else {
          setProfileUserStatus("notFriend");
        }
      } else {
        setProfileUserStatus(null);
      }
    };
    checkProfileUser();
  }, [userId, isUserProfile, user.userFriends, userData._id]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsDataList = [];
        const users = await axiosInstance.get("/users");
        const friendsList = await axiosInstance.get(`/friends/${userId}`);
        const friendsListData = friendsList.data;

        for (let friend of friendsListData) {
          if (
            user.userFriends.filter(
              (u) =>
                u.friendId === friend.friendId && u.status === friend.status
            ) !== []
          ) {
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
        }
        setFriends(friendsDataList);
        if (isUserProfile && !arraysEqual(user.userFriends, friends))
          dispatch({ type: "FRIENDS_UPDATE", payload: friendsDataList });
      } catch (err) {
        console.log(err);
      }
    };
    fetchFriends();
  }, [userId, dispatch, isUserProfile, user.userFriends]);

  if (userData === null || userData._id !== userId) {
    return <div>Chargement du profil...</div>;
  }

  return (
    <>
      <Header userData={userData} connectedUsers={connectedUsers} />
      <ProfilePics
        userData={userData}
        profileUserStatus={profileUserStatus}
        isUserProfile={isUserProfile}
      />
      <ProfileMenu
        userData={userData}
        friends={friends}
        isUserProfile={isUserProfile}
      />
    </>
  );
}

export default Profile;
