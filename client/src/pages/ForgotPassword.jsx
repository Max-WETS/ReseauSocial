import React, { useState } from "react";
import {
  Text,
  FormControl,
  Input,
  Button,
  VStack,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { axiosInstance } from "../config";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [response, setResponse] = useState("");

  const handleClickSendEmail = async (e) => {
    e.preventDefault();
    console.log("email: ", email);

    if (email === "") {
      setError(true);
      setResponse("");
    } else {
      try {
        const res = await axiosInstance.post(`/auth/forgotPassword`, {
          email: email,
        });
        console.log(res.data);
        if (res.data === "email not found in MongoDB") {
          console.log("error", error);
          setError(true);
          setResponse("");
        } else if (res.data === "recovery email sent") {
          setError(false);
          setResponse("recovery email sent");
        }
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
      <VStack flex={1} justifyContent="center">
        <Formik>
          <Flex
            flexDirection="column"
            justifyContent="space-between"
            borderRadius="10px"
            w="300px"
          >
            <Form
              h="300px"
              p="20px"
              bg="white"
              onSubmit={(e) => handleClickSendEmail(e)}
            >
              <FormControl>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  h="50px"
                  borderRadius="10px"
                  border="1px solid lightgray"
                  fontSize="18px"
                  pl="20px"
                  _focus={{ outline: "none" }}
                />
                <Button
                  mt="5px"
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
                  Send Password Reset Email
                </Button>
              </FormControl>
            </Form>
            {error && (
              <HStack mt="8px">
                <Text mr="4px">
                  That email address cannot be found. Please try again or use
                  create a new account.
                </Text>
                <Link to={"/register"}>
                  <Button>Register</Button>
                </Link>
              </HStack>
            )}
            {response === "recovery email sent" && (
              <HStack mt="8px">
                <Text mr="4px">Password Reset Email Successfully Sent!</Text>
                <Link to={"/login"}>
                  <Button>Go back</Button>
                </Link>
              </HStack>
            )}
          </Flex>
        </Formik>
      </VStack>
    </Flex>
  );
}

export default ForgotPassword;
