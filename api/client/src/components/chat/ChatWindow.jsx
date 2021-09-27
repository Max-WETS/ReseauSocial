import {
  HStack,
  VStack,
  Box,
  Flex,
  Avatar,
  Text,
  Input,
  Button,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { axiosInstance } from "../../config";
import Message from "./Message";

function ChatWindow({ currentChat, user }) {
  const PF = "http://localhost:3000/";
  const [friend, setFriend] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (currentChat) {
      const friendId = currentChat.members.find((m) => m !== user.userId);

      const fetchFriendData = async () => {
        try {
          const res = await axiosInstance.get(`/users/${friendId}`);
          setFriend(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchFriendData();
    }
  }, [currentChat, user.userId, currentChat.messages]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axiosInstance.get(
          "/conversations/chat-id/" + currentChat?._id
        );
        setMessages(res.data.messages);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  return currentChat ? (
    <VStack w="75%" minH="80vh" alignItems="stretch">
      <Flex
        align="center"
        mt={0}
        pl="10px"
        w="100%"
        h="60px"
        bg="white"
        borderRadius="5px"
        borderBottom="solid 1px lightgray"
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
      <Flex w="100%" minH="72vh">
        <Flex flexDirection="column" justifyContent="space-between" w="100%">
          <Box h="100%" overflowY="scroll" pr="10px">
            {messages.map((m) => (
              <Message
                key={m._id}
                message={m}
                own={m.senderId === user.userId}
                user={user}
                friend={friend}
              />
            ))}
          </Box>
        </Flex>
      </Flex>
      <HStack h="40px" w="100%" pl="10px">
        <Input h="35px" w="80%" bg="gray.100" type="message" placeholder="Aa" />
        <Button w="90px" h="35px" bg="blue.500">
          <Box w="30px" mr="4px">
            <RiSendPlaneFill size="sm" color="white" />
          </Box>
          <Text color="white">Send</Text>
        </Button>
      </HStack>
    </VStack>
  ) : (
    <Flex
      w="75%"
      minH="80vh"
      alignItems="center"
      justifyContent="center"
      color="gray.300"
    >
      <Text textAlign="center">Select a conversation to start chatting...</Text>
    </Flex>
  );
}

export default ChatWindow;
