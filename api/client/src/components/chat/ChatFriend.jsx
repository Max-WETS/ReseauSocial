import React from "react";
import { Flex, Avatar, Text } from "@chakra-ui/react";

function ChatFriend() {
  return (
    <Flex
      _hover={{ bg: "gray.200" }}
      align="center"
      mt={0}
      pl="5px"
      w="100%"
      h="60px"
      bg="white"
      borderRadius="5px"
      cursor="pointer"
    >
      <Avatar ml="1px" size="md" name="Maxime Wets" src="person/Max.jpg" />
      <Text ml="10px" mr="8px">
        Maxime Wets
      </Text>
    </Flex>
  );
}

export default ChatFriend;
