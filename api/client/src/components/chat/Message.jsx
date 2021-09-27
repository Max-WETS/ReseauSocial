import { Flex, Avatar, Text, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

function Message({ message, own, user, friend }) {
  const PF = "http://localhost:3000/";

  return (
    <HStack
      flexDirection="column"
      mt="20px"
      alignItems={own ? "flex-end" : "flex-start"}
    >
      <Flex justifyContent="center" alignItems="center">
        <Avatar
          w="32px"
          h="32px"
          mr="10px"
          name={own ? user.username : friend.username}
          src={own ? PF + user.profilePicture : PF + friend.profilePicture}
        />
        <Text
          p="10px"
          borderRadius="20px"
          bg={own ? "blue.400" : "gray.100"}
          color={own ? "white" : "black"}
          maxW="300px"
        >
          {message.message}
        </Text>
      </Flex>
    </HStack>
  );
}

export default Message;
