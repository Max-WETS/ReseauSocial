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
import React from "react";
import { RiSendPlaneFill } from "react-icons/ri";

function ChatWindow() {
  return (
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
        <Avatar ml="1px" size="md" name="Maxime Wets" src="person/Max.jpg" />
        <Text ml="10px" mr="8px">
          Maxime Wets
        </Text>
      </Flex>
      <Flex w="100%" minH="72vh"></Flex>
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
  );
}

export default ChatWindow;
