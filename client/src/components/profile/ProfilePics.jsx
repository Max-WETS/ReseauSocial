import {
  Center,
  Image,
  Text,
  Container,
  Circle,
  Avatar,
  VStack,
  HStack,
  Box,
  useMediaQuery,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import React, { useContext, useState, useEffect } from "react";
import { AiFillCamera, AiOutlineCheck } from "react-icons/ai";
import { IoPersonAddSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
//const requestUtils = require("../../request.utils");

function ProfilePics({ userData, profileUserStatus }) {
  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");
  const { user, dispatch } = useContext(AuthContext);
  const PF = "http://localhost:3000/";

  const handleClickAdd = async () => {
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

  const handleClickRemove = async () => {
    try {
      await axios.put(`/friends/${userData._id}/remove`, {
        userId: user.userId,
      });
      dispatch({ type: "REMOVE_FRIEND", payload: userData._id });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box maxH="450px">
        <Center
          boxSizing="border-box"
          boxShadow="rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;"
        >
          <Image
            h="350px"
            w="900px"
            objectFit="cover"
            src={PF + "cover/nocover.svg"}
            alt="cover picture"
            borderBottomRadius="5px"
          />
        </Center>
        <Container
          maxW="800px"
          maxH="230px"
          borderBottom="solid 1px lightgray"
          position="relative"
          top="-140px"
        >
          <Center>
            <VStack>
              <Circle>
                <Avatar
                  position="relative"
                  zIndex={0}
                  w="150px"
                  h="150px"
                  name={userData.username}
                  src={PF + userData.profilePicture || "person/noAvatar.png"}
                  cursor="pointer"
                  border="white 2px solid"
                />
              </Circle>
              <Circle
                cursor="pointer"
                maxW="30px"
                bg="gray.100"
                border="solid 3px lightgray"
                zIndex={2}
                position="relative"
                top="-50px"
                left="55px"
              >
                <AiFillCamera size="xs" />
              </Circle>
              {isLargerThan900 ? (
                <HStack
                  borderRadius="md"
                  pl="6px"
                  pr="6px"
                  position="relative"
                  bg="gray.100"
                  h="28px"
                  right="-300px"
                  bottom="110px"
                  cursor="pointer"
                >
                  <AiFillCamera />
                  <Text fontSize="14px" fontWeight="600">
                    Changer la photo de couverture
                  </Text>
                </HStack>
              ) : (
                <Box
                  borderRadius="md"
                  border="2px solid lightgray"
                  bg="gray.100"
                  h="28px"
                  position="relative"
                  right="-250px"
                  bottom="110px"
                  cursor="pointer"
                >
                  <AiFillCamera size="md" />
                </Box>
              )}
            </VStack>
          </Center>
          <SimpleGrid columns={3} spacing={0}>
            <Box></Box>
            <Center position="relative" top="-55px">
              <Text fontSize="28px" fontWeight="bold">
                {userData.username}
              </Text>
            </Center>
            <Box>
              <Center>
                {(() => {
                  switch (profileUserStatus) {
                    case "friend":
                      return (
                        <Button
                          bg="blue.300"
                          w="65px"
                          h="25px"
                          position="relative"
                          top="-45px"
                          alignItems="center"
                          justifyContent="center"
                          textAlign="center"
                        >
                          <HStack spacing={0}>
                            <Text>Friend</Text>
                            <AiOutlineCheck />
                          </HStack>
                        </Button>
                      );
                    case "pending":
                      return (
                        <Button
                          bg="blue.300"
                          w="80px"
                          h="25px"
                          position="relative"
                          top="-45px"
                          alignItems="center"
                          justifyContent="center"
                          textAlign="center"
                        >
                          <HStack spacing={0}>
                            <Text>Pending...</Text>
                          </HStack>
                        </Button>
                      );
                    case "friend request sent":
                      return (
                        <Button
                          bg="red.200"
                          w="80px"
                          h="25px"
                          position="relative"
                          top="-45px"
                          alignItems="center"
                          justifyContent="center"
                          textAlign="center"
                          onClick={handleClickRemove}
                        >
                          <HStack spacing={0}>
                            <Text>Cancel</Text>
                          </HStack>
                        </Button>
                      );
                    case "notFriend":
                      return (
                        <Button
                          bg="gray.100"
                          w="70px"
                          h="25px"
                          position="relative"
                          top="-45px"
                          alignItems="center"
                          justifyContent="center"
                          textAlign="center"
                          onClick={handleClickAdd}
                        >
                          <HStack spacing={1}>
                            <Text>Add</Text>
                            <IoPersonAddSharp />
                          </HStack>
                        </Button>
                      );
                    default:
                      return null;
                  }
                })()}
              </Center>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}

export default ProfilePics;
