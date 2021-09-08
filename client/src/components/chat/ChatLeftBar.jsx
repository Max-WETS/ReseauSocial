import React from "react";
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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { RiChatNewLine } from "react-icons/ri";
import ChatFriend from "./ChatFriend";

function ChatLeftBar() {
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
          <Circle bg="gray.100" size="35px" cursor="pointer">
            <RiChatNewLine size="22px" />
          </Circle>
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
        <ChatFriend />
        <ChatFriend />
      </VStack>
    </VStack>
  );
}

export default ChatLeftBar;
