import React from "react";
import { Flex, HStack, VStack, Text, Avatar, Box } from "@chakra-ui/react";

function Post() {
  return (
    <>
      <Box bg="gray.100" w="100%" h="5px" />
      <Flex
        w="500px"
        paddingTop="10px"
        paddingLeft="10px"
        paddingTop="10px"
        marginTop="10px"
        marginBottom="5px"
        borderRadius="10%"
        margin="auto"
        justifyContent="center"
        alignItems="center"
      >
        <VStack paddingBottom="20px">
          <HStack position="relative" left="-168px">
            <Avatar
              size="md"
              name="Maxime Wets"
              src="person/Max.jpg"
              cursor="pointer"
            />
            <VStack justifyContent="left">
              <Text h="14px" fontWeight="500">
                Maxime Wets
              </Text>
              <Text w="100%" marginTop={0} fontSize="12px" align="left">
                30 août 2021
              </Text>
            </VStack>
          </HStack>
          <Text
            fontSize="16px"
            lineHeight={1.3}
            paddingBottom="10px"
            borderBottom="1px solid lightgray"
          >
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique
            dolores natus, beatae quam obcaecati mollitia magni saepe magnam
            dolorum praesentium, corporis voluptas, eius quia minima corrupti
            veniam esse quae accusantium!
          </Text>
        </VStack>
      </Flex>
    </>
  );
}

export default Post;
