import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Text,
  FormControl,
  Input,
  Button,
  VStack,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../config";

function ResetPassword() {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("token", token);
    const checkToken = async () => {
      try {
        const res = await axiosInstance.get(`/auth/reset/${token}`);
        console.log("message", res.data.message);

        if (res.data.message === "password reset link ok") {
          setUserId(res.data.userId);
          setUsername(res.data.username);
          setUpdate(false);
          setIsLoading(false);
          setError(false);
        } else {
          setUpdate(false);
          setIsLoading(false);
          setError(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkToken();
  }, []);

  const handleClickUpdatePassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.put(`/users/${userId}`, {
        password: password,
      });
      console.log("update: ", res.data);
      if (res.data === "Account has been updated") {
        setUpdate(true);
        setError(false);
      } else {
        setUpdate(false);
        setError(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (error) {
    return (
      <Flex
        w="100vw"
        h="100vh"
        bg="white"
        alignItems="center"
        justifyContent="center"
      >
        <Box>Problem resetting password. Please send another reset link.</Box>
        <Link to={"/login"}>
          <Button>Go back</Button>
        </Link>
      </Flex>
    );
  } else if (isLoading) {
    return (
      <Flex
        w="100vw"
        h="100vh"
        bg="white"
        alignItems="center"
        justifyContent="center"
      >
        <Box>Loading user data...</Box>
      </Flex>
    );
  } else {
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
                onSubmit={(e) => handleClickUpdatePassword(e)}
              >
                <FormControl>
                  <Input
                    type="password"
                    name="password"
                    placeholder="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    Update Password
                  </Button>
                </FormControl>
              </Form>
            </Flex>
          </Formik>
          <Link to={"/login"}>
            <Button>Go back</Button>
          </Link>
        </VStack>
      </Flex>
    );
  }
}

export default ResetPassword;
