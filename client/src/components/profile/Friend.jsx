import { Box, Flex, HStack, Text, Avatar, Spacer } from "@chakra-ui/react";
import React from "react";
import { HiUserRemove } from "react-icons/hi";

function Friend() {
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
        <Avatar
          size="md"
          name="Maxime Wets"
          src="person/Max.jpg"
          cursor="pointer"
        />
        <Text h="14px" fontWeight="500" position="relative" top="-5px">
          Maxime Wets
        </Text>
      </HStack>
      <Spacer />
      <Flex
        bg="gray.100"
        cursor="pointer"
        w="25px"
        h="25px"
        borderRadius="50%"
        alignItems="center"
        justifyContent="center"
      >
        <HiUserRemove />
      </Flex>
    </Flex>
  );
}

export default Friend;
