import {
  VStack,
  Box,
  HStack,
  Avatar,
  Input,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiFillPicture } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import { axiosInstance } from "../../config";

function Share({ user, userData, setPosts, posts }) {
  const PF = "http://localhost:3000/";
  const [newPost, setNewPost] = useState("");

  const handleClickNewPost = async () => {
    try {
      const res = await axiosInstance.post(`/posts/profile/${userData._id}`, {
        userId: user.userId,
        desc: newPost,
      });
      setPosts((prev) => [res.data, ...prev]);
      setNewPost("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex
      w="500px"
      paddingTop="10px"
      borderRadius="10%"
      margin="auto"
      justifyContent="center"
      alignItems="center"
    >
      <VStack>
        <HStack
          paddingBottom="10px"
          spacing="15px"
          borderBottom="1px solid lightgray"
        >
          <Avatar
            size="md"
            name={user?.username || "unknown user"}
            src={PF + user?.profilePicture || PF + "person/noAvatar.jpg"}
            cursor="pointer"
          />
          <Input
            h="35px"
            w="360px"
            borderRadius="10px"
            bg="gray.100"
            type="mood"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
        </HStack>
        <HStack paddingBottom="5px">
          <Button w="220px" bg="white">
            <Box w="30px" mr="4px">
              <AiFillPicture sizes="sm" color="red" />
            </Box>
            <Text>Picture</Text>
          </Button>
          <Button w="220px" bg="white" onClick={handleClickNewPost}>
            <Box w="30px" mr="4px">
              <RiSendPlaneFill sizes="sm" color="green" />
            </Box>
            <Text>Share</Text>
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
}

export default Share;
