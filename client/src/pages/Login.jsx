import React from "react";
import {
  CircularProgress,
  CircularProgressLabel,
  Box,
  Flex,
  VStack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
} from "@chakra-ui/react";

function Login() {
  return (
    <Flex
      w="100vw"
      h="100vh"
      bg="white"
      alignItems="center"
      justifyContent="center"
    >
      <Flex w="70%" h="70%">
        <VStack flex={1} justifyContent="center">
          <Text fontSize="50px" fontWeight="800" color="blue.400" mb="10px">
            MaxWeb
          </Text>
          <Text fontSize="24px">
            Connect with friends and the world around you on MaxWeb
          </Text>
        </VStack>
        <VStack flex={1} justifyContent="center">
          <FormControl
            h="300px"
            p="20px"
            bg="white"
            borderRadius="10px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Input
              type="email"
              placeholder="Email"
              required
              h="50px"
              borderRadius="10px"
              border="1px solid lightgray"
              fontSize="18px"
              pl="20px"
              _focus={{ outline: "none" }}
            />
            <Input
              type="password"
              placeholder="Password"
              required
              h="50px"
              minLength="6"
              borderRadius="10px"
              border="1px solid lightgray"
              fontSize="18px"
              pl="20px"
              _focus={{ outline: "none" }}
            />
            <Button
              type="submit"
              h="50px"
              borderRadius="10px"
              border="none"
              bg="blue.400"
              color="white"
              fontSize="20px"
              fontWeight="500"
              cursor="pointer"
              _focus={{ outline: "none" }}
            >
              Log In
            </Button>
            <Button
              w="60%"
              alignSelf="center"
              h="50px"
              borderRadius="10px"
              border="none"
              bg="green.400"
              color="white"
              fontSize="20px"
              fontWeight="500"
              cursor="pointer"
              _focus={{ outline: "none" }}
            >
              Create a New Account
            </Button>
          </FormControl>
        </VStack>
      </Flex>
    </Flex>
  );
}

export default Login;
