import React, { useEffect, useState, useContext } from "react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Circle,
  Spacer,
  InputGroup,
  InputLeftElement,
  Input,
  Avatar,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import { RiChatNewLine } from "react-icons/ri";
import ChatFriend from "./ChatFriend";
import { axiosInstance } from "../../config";

function ChatLeftBar({
  conversations,
  setConversations,
  user,
  currentChat,
  setCurrentChat,
}) {
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const PF = "http://localhost:3000/";

  const handleClickNewChat = async (e, suggestion) => {
    try {
      axiosInstance.post("/conversations", {
        senderId: user.userId,
        receiverId: suggestion.friendId,
      });
      const res = await axiosInstance.get("/conversations/" + user.userId);
      setConversations(res.data);
      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const existingChatFriendsId = conversations
        .reduce(function (prev, curr) {
          return [...prev, ...curr.members];
        }, [])
        .filter((u) => u !== user.userId);
      const friends = user.userFriends;
      const otherFriends = friends.filter(
        (friend) => existingChatFriendsId.indexOf(friend.friendId) < 0
      );
      setUsers(otherFriends);
    };
    fetchUsers();
  }, [user.userId, conversations, user.userFriends]);

  const onChangeHandler = (text) => {
    let matches = [];
    if (text.length > 0) {
      matches = users.filter((u) => {
        const regex = new RegExp(`${text}`, "gi");
        return u.username.match(regex);
      });
    }
    //console.log("matches", matches);
    setSuggestions(matches);
    setText(text);
  };

  return (
    <VStack
      w="25%"
      minW="12rem"
      minH="90vh"
      pt="10px"
      borderRight="solid 1px lightgray"
    >
      <VStack
        w="100%"
        pr="10px"
        pl="10px"
        pb="16px"
        borderBottom="solid 1px lightgray"
      >
        <HStack w="100%" pr="14px" pl="14px" pb="4px" alignItems="center">
          <Text fontWeight="700" fontSize="20px">
            Discussions
          </Text>
          <Spacer />
          <Popover placement="right-end" isLazy>
            <PopoverTrigger>
              <Circle
                bg="gray.100"
                size="35px"
                cursor="pointer"
                _hover={{
                  backgroundColor: "lightgray",
                }}
                _active={{
                  transform: "translateY(1px)",
                }}
              >
                <RiChatNewLine size="22px" />
              </Circle>
            </PopoverTrigger>
            <PopoverContent zIndex={8}>
              <PopoverHeader fontWeight="semibold">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<SearchIcon color="gray.500" />}
                  />
                  <Input
                    h="35px"
                    bg="white"
                    type="text"
                    placeholder="Search someone..."
                    onChange={(e) => onChangeHandler(e.target.value)}
                    value={text}
                  />
                </InputGroup>
              </PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                {text !== "" ? (
                  suggestions.length < 1 ? (
                    <Box
                      color="gray.300"
                      alignItems="center"
                      justifyContent="center"
                      textAlign="center"
                    >
                      <Text>No match found...</Text>
                    </Box>
                  ) : (
                    suggestions.map((suggestion, i) => (
                      <HStack
                        bg="white"
                        p="4px"
                        _hover={{ backgroundColor: "blue.200" }}
                        cursor="pointer"
                        value={suggestion.username}
                        onClick={(e) => handleClickNewChat(e, suggestion)}
                        key={i}
                      >
                        <Avatar
                          size="md"
                          name={suggestion.username}
                          src={PF + suggestion.profilePicture}
                          cursor="pointer"
                        />
                        <Text
                          h="14px"
                          fontWeight="500"
                          position="relative"
                          top="-5px"
                          style={{ textDecoration: "none" }}
                        >
                          {suggestion.username}
                        </Text>
                      </HStack>
                    ))
                  )
                ) : (
                  <Box
                    color="gray.300"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                  >
                    <Text>Start a conversation with a friend!</Text>
                  </Box>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
        <Box w="85%">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.500" />}
            />
            <Input
              h="35px"
              bg="gray.100"
              type="search"
              placeholder="Search someone..."
            />
          </InputGroup>
        </Box>
      </VStack>
      <VStack w="90%" spacing={0}>
        {conversations?.map((conversation) => (
          <Box
            m={0}
            p={0}
            w="100%"
            key={conversation._id}
            onClick={() => setCurrentChat(conversation)}
          >
            <ChatFriend
              conversation={conversation}
              user={user}
              currentChat={currentChat}
            />
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}

export default ChatLeftBar;
