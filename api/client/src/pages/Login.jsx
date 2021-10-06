import React, { useContext, useRef } from "react";
import {
  CircularProgress,
  Flex,
  VStack,
  Text,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { loginCall } from "../apiCalls";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

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
          <Formik>
            <Flex
              flexDirection="column"
              justifyContent="space-between"
              borderRadius="10px"
            >
              <Form h="300px" p="20px" bg="white" onSubmit={handleClick}>
                <FormControl>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    id="email"
                    required
                    ref={email}
                    h="50px"
                    borderRadius="10px"
                    border="1px solid lightgray"
                    fontSize="18px"
                    pl="20px"
                    _focus={{ outline: "none" }}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    id="password"
                    required
                    ref={password}
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
                    disabled={isFetching}
                  >
                    {isFetching ? (
                      <CircularProgress color="white" size="20px" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </FormControl>
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
                  {isFetching ? (
                    <CircularProgress color="white" size="20px" />
                  ) : (
                    <Link to="/register">Create a New Account</Link>
                  )}
                </Button>
              </Form>
            </Flex>
          </Formik>
        </VStack>
      </Flex>
    </Flex>
  );
}

export default Login;
