import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Avatar,
  Spacer,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { HiUserRemove } from "react-icons/hi";

function Friend({ friend, isUserProfile }) {
  const PF = "http://localhost:3000/";

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
          name={friend.username || "unknown user"}
          src={PF + friend.profilePicture || "person/noAvatar.jpg"}
          cursor="pointer"
        />
        <Text h="14px" fontWeight="500" position="relative" top="-5px">
          {friend.username || "unknown user"}
        </Text>
      </HStack>
      <Spacer />
      {(() => {
        if (isUserProfile) {
          switch (friend.status) {
            case "en attente de confirmation":
              return (
                <VStack>
                  <Button
                    fontSize="12px"
                    fontWeight="600"
                    color="white"
                    bg="blue.400"
                    w="45px"
                    h="25px"
                    p={3}
                    borderRadius="50%"
                  >
                    <Text>Accept</Text>
                  </Button>
                  <Button
                    fontSize="12px"
                    fontWeight="600"
                    color="white"
                    bg="red.400"
                    w="45px"
                    h="25px"
                    p={3}
                    borderRadius="50%"
                  >
                    <Text>Ignore</Text>
                  </Button>
                </VStack>
              );
            case "recommandé":
              return (
                <VStack>
                  <Button
                    fontSize="12px"
                    fontWeight="600"
                    color="white"
                    bg="blue.400"
                    w="45px"
                    h="25px"
                    p={3}
                    borderRadius="50%"
                  >
                    <Text>Invite</Text>
                  </Button>
                  <Button
                    fontSize="12px"
                    fontWeight="600"
                    color="white"
                    bg="red.400"
                    w="45px"
                    h="25px"
                    p={3}
                    borderRadius="50%"
                  >
                    <Text>Ignore</Text>
                  </Button>
                </VStack>
              );
            default:
              return (
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
              );
          }
        }
      })()}
    </Flex>
  );
}

export default Friend;
