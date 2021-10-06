import { Text, VStack } from "@chakra-ui/react";
import React from "react";
import Header from "../components/Header";

function Home() {
  return (
    <>
      <Header />
      <VStack
        spacing={0}
        h="93vh"
        w="100vw"
        m={0}
        alignItems="center"
        justifyContent="center"
        backgroundImage="url('background/subtle-prism.svg')"
      >
        <Text fontSize="24px" fontWeight="400" mb={0}>
          Welcome to
        </Text>
        <Text
          textShadow="1px 1px 2px black;"
          fontSize="50px"
          fontWeight="700"
          color="blue.600"
          mt={0}
        >
          MaxWeb
        </Text>
      </VStack>
    </>
  );
}

export default Home;
