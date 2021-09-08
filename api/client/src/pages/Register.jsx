import React, { useRef } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import {axiosInstance} from "../config"
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
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";

function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axiosInstance.post("/auth/register", user);
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
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
            <Form
              h="300px"
              p="20px"
              bg="white"
              borderRadius="10px"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              onSubmit={handleClick}
            >
              <FormControl>
                <Input
                  type="text"
                  name="username"
                  placeholder="username"
                  id="signupUsername"
                  ref={username}
                  required
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
                  type="email"
                  name="email"
                  placeholder="email"
                  id="signupEmail"
                  ref={email}
                  required
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
                  placeholder="password"
                  id="signupPassword"
                  ref={password}
                  required
                  h="50px"
                  minLength="6"
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
                  name="passwordAgain"
                  placeholder="password again"
                  id="signupPasswordAgain"
                  ref={passwordAgain}
                  required
                  h="50px"
                  minLength="6"
                  borderRadius="10px"
                  border="1px solid lightgray"
                  fontSize="18px"
                  pl="20px"
                  _focus={{ outline: "none" }}
                />
              </FormControl>
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
                Sign Up
              </Button>
              <Link to="/login">
                <Button
                  w="60%"
                  h="50px"
                  borderRadius="10px"
                  border="none"
                  bg="green.400"
                  color="white"
                  fontSize="20px"
                  fontWeight="500"
                  cursor="pointer"
                  alignSelf="center"
                  _focus={{ outline: "none" }}
                >
                  Log into Account
                </Button>
              </Link>
            </Form>
          </Formik>
        </VStack>
      </Flex>
    </Flex>
  );
}

export default Register;
