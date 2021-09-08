import React from "react";
import {
  Container,
  Text,
  Box,
  VStack,
  HStack,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";

function About() {
  return (
    <Container w="600px" paddingTop="10px" paddingBottom="10px" pr={0} pl={0}>
      <Box>
        <Text paddingBottom="5px" borderBottom="1px solid lightgray">
          About
        </Text>
      </Box>
      <Box>
        <VStack paddingTop="10px">
          <HStack alignItems="center">
            <Text w="100%" textAlign="left">
              Bio: Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Maxime, veritatis.
            </Text>
            <AiFillEdit cursor="pointer" color="blue" />
          </HStack>
          <HStack alignItems="center" w="100%">
            <Text w="100%" textAlign="left">
              Age: 31
            </Text>
            <AiFillEdit cursor="pointer" color="blue" />
          </HStack>
          <HStack alignItems="center" w="100%">
            <Text w="100%" textAlign="left">
              City: Paris
            </Text>
            <Spacer />
            <Box>
              <AiFillEdit cursor="pointer" color="blue" />
            </Box>
          </HStack>
          <HStack alignItems="center" w="100%">
            <Text w="100%" textAlign="left">
              Email address: wetsmaxime@gmail.com
            </Text>
            <Spacer />
            <Box>
              <AiFillEdit cursor="pointer" color="blue" />
            </Box>
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
}

export default About;
