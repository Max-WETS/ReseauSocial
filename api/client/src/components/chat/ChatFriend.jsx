import React, { useEffect, useRef, useState } from "react";
import { Flex, Avatar, Text } from "@chakra-ui/react";
import { axiosInstance } from "../../config";

function ChatFriend({ conversation, user, currentChat }) {
  const PF = "http://localhost:3000/";
  const [friend, setFriend] = useState(null);
  const [isCurrentChat, setIsCurrentChat] = useState(false);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== user.userId);

    const fetchFriendData = async () => {
      try {
        const res = await axiosInstance.get(`/users/${friendId}`);
        setFriend(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFriendData();
  }, [conversation, user.userId]);

  useEffect(() => {
    if (currentChat) {
      conversation._id === currentChat._id
        ? setIsCurrentChat(true)
        : setIsCurrentChat(false);
    }
  }, [currentChat, conversation._id]);

  return (
    <Flex
      _hover={{ bg: "gray.200" }}
      bg={isCurrentChat ? "gray.200" : "white"}
      align="center"
      mt={0}
      pl="5px"
      w="100%"
      h="60px"
      borderRadius="5px"
      cursor="pointer"
    >
      <Avatar
        ml="1px"
        size="md"
        name={friend?.username || "unknown user"}
        src={PF + friend?.profilePicture || PF + "person/noAvatar.jpg"}
      />
      <Text ml="10px" mr="8px">
        {friend?.username || "unknown user"}
      </Text>
    </Flex>
  );
}

export default ChatFriend;
