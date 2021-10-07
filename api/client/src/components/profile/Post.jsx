import React, { useState, useEffect } from "react";
import { Flex, HStack, VStack, Text, Avatar, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../config";

function Post({ post }) {
  const [user, setUser] = useState({});
  const PF = "http://localhost:3000/";

  useEffect(() => {
    const fectchUserData = async () => {
      try {
        const res = await axiosInstance.get(`/users/${post.userId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fectchUserData();
  }, [post]);

  return (
    <>
      <Box bg="gray.100" w="100%" h="5px" />
      <Flex
        w="500px"
        paddingTop="10px"
        paddingLeft="10px"
        marginTop="10px"
        marginBottom="5px"
        borderRadius="10%"
        margin="auto"
        justifyContent="center"
      >
        <VStack paddingBottom="20px" alignItems="flex-start" minW="100%">
          <HStack position="relative" minW="100%">
            <Link
              to={`/profile/${user._id}`}
              style={{ textDecoration: "none" }}
            >
              <Avatar
                size="md"
                name={user.username}
                src={PF + user.profilePicture}
                cursor="pointer"
              />
            </Link>
            <VStack alignItems="flex-start">
              <Text h="14px" fontWeight="500">
                {user.username}
              </Text>
              <Text w="100%" marginTop={0} fontSize="12px" align="left">
                {post.createdAt}
              </Text>
            </VStack>
          </HStack>
          <Flex minW="90%" borderBottom="1px solid lightgray">
            <Text
              minW="100%"
              fontSize="16px"
              lineHeight={1.3}
              paddingBottom="10px"
            >
              {post.desc}
            </Text>
          </Flex>
        </VStack>
      </Flex>
    </>
  );
}

export default Post;
