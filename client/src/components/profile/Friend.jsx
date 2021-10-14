import {
  Flex,
  VStack,
  HStack,
  Text,
  Avatar,
  Spacer,
  Button,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { HiUserRemove } from "react-icons/hi";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";

function Friend({ friend, setFriends, isUserProfile, userData }) {
  const PF = "http://localhost:3000/";
  const { user, dispatch } = useContext(AuthContext);
  const ifIsAdmin = !isUserProfile && user.isAdmin === true;

  const handleClickAddRecommended = async () => {
    try {
      await axiosInstance.put(`/friends/${friend.friendId}/remove`, {
        userId: ifIsAdmin ? userData._id : user.userId,
      });
      await axiosInstance.post(`/friends/${friend.friendId}/add`, {
        userId: ifIsAdmin ? userData._id : user.userId,
      });
      const resFriends = await axiosInstance.get(
        `/friends/${ifIsAdmin ? userData._id : user.userId}`
      );
      const resUser = await axiosInstance.get(`/users/${friend.friendId}`);
      const friendsList = resFriends.data;
      const newFriendArray = friendsList.filter(
        (f) => f.friendId === friend.friendId
      );
      const newFriend = newFriendArray[0];
      newFriend["username"] = resUser.data.username;
      newFriend["profilePicture"] = resUser.data.profilePicture;

      dispatch({ type: "ADD_FRIEND", payload: newFriend });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickRemove = async () => {
    try {
      await axiosInstance.put(`/friends/${friend.friendId}/remove`, {
        userId: ifIsAdmin ? userData._id : user.userId,
      });
      dispatch({
        type: "REMOVE_FRIEND",
        payload: ifIsAdmin ? userData._id : friend.friendId,
      });
      setFriends((prev) =>
        [...prev].filter((f) => f.friendId !== friend.friendId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickAccept = async () => {
    try {
      const ID = ifIsAdmin ? userData._id : user.userId;
      // console.log("ID sender", ID);
      const res = await axiosInstance.put(
        `/friends/${friend.friendId}/accept`,
        {
          userId: ID,
        }
      );
      const newFriend = {
        ...res.data.acceptedFriend,
        status: "confirmé",
        username: res.data.acceptedFriendData.username,
        profilePicture: res.data.acceptedFriendData.profilePicture,
      };
      // console.log("newAcceptedFriend", newFriend);
      dispatch({
        type: "ACCEPT_FRIEND",
        payload: ifIsAdmin ? userData._id : friend.friendId,
      });
      setFriends((prev) => [...prev, newFriend]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex
      h="80px"
      alignItems="center"
      border="1px solid lightgray"
      borderRadius="5%"
      pr="10px"
      pl="10px"
    >
      <HStack>
        <Link
          to={`/profile/${friend.friendId}`}
          style={{ textDecoration: "none" }}
        >
          <Avatar
            size="md"
            name={friend.username || "unknown user"}
            src={PF + friend.profilePicture || PF + "person/noAvatar.jpg"}
            cursor="pointer"
          />
        </Link>
        <Text h="14px" fontWeight="500" position="relative" top="-5px">
          {friend.username || "unknown user"}
        </Text>
      </HStack>
      <Spacer />
      {(() => {
        if (isUserProfile || user.isAdmin === true) {
          switch (friend.status) {
            case "en attente de confirmation":
              return (
                <VStack>
                  <Button
                    fontSize="12px"
                    fontWeight="600"
                    color="white"
                    bg="blue.400"
                    w="45px"
                    h="25px"
                    p={3}
                    borderRadius="50%"
                    _active={{
                      transform: "translateY(1px)",
                    }}
                    onClick={handleClickAccept}
                  >
                    <Text>Accept</Text>
                  </Button>
                  <Button
                    fontSize="12px"
                    fontWeight="600"
                    color="white"
                    bg="red.400"
                    w="45px"
                    h="25px"
                    p={3}
                    borderRadius="50%"
                    _active={{
                      transform: "translateY(1px)",
                    }}
                    onClick={handleClickRemove}
                  >
                    <Text>Ignore</Text>
                  </Button>
                </VStack>
              );
            case "recommandé":
              return (
                <VStack>
                  <Button
                    fontSize="12px"
                    fontWeight="600"
                    color="white"
                    bg="blue.400"
                    w="45px"
                    h="25px"
                    p={3}
                    borderRadius="50%"
                    _active={{
                      transform: "translateY(1px)",
                    }}
                    onClick={handleClickAddRecommended}
                  >
                    <Text>Invite</Text>
                  </Button>
                  <Button
                    fontSize="12px"
                    fontWeight="600"
                    color="white"
                    bg="red.400"
                    w="45px"
                    h="25px"
                    p={3}
                    borderRadius="50%"
                    _active={{
                      transform: "translateY(1px)",
                    }}
                    onClick={handleClickRemove}
                  >
                    <Text>Ignore</Text>
                  </Button>
                </VStack>
              );
            default:
              return (
                <Flex
                  bg="gray.100"
                  cursor="pointer"
                  w="25px"
                  h="25px"
                  borderRadius="50%"
                  alignItems="center"
                  justifyContent="center"
                  _hover={{
                    backgroundColor: "lightgray",
                  }}
                  _active={{
                    transform: "translateY(1px)",
                  }}
                  onClick={handleClickRemove}
                >
                  <HiUserRemove />
                </Flex>
              );
          }
        }
      })()}
    </Flex>
  );
}

export default Friend;
