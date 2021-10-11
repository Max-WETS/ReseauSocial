import {
  Text,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../config";

function Admin() {
  const { user, connectedUsers } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      let fetchedUsers = [];
      let fetchedFriendLists = [];

      try {
        const resUsers = await axiosInstance.get(`/users`);
        fetchedUsers = [...resUsers.data];
        const resLists = await axiosInstance.get(`/friends`);
        fetchedFriendLists = [...resLists.data];
        for (let user of fetchedUsers) {
          user.friendsList = [];
          const userFriendList = fetchedFriendLists.filter(
            (f) => f.userId === user._id
          );
          user.friendsList = [...userFriendList[0].friendsList];
        }
      } catch (err) {
        console.log(err);
      }

      console.log("fetched users", fetchedUsers);
      setUsers(fetchedUsers);
    };

    fetchUsersData();
  }, []);

  return (
    <>
      <Header />
      <HStack spacing={0} minW="100vw" minH="93vh" alignItems="flex-start">
        <VStack
          w="15%"
          minW="12rem"
          minH="93vh"
          pt="10px"
          borderRight="solid 1px lightgray"
          bg="gray.500"
        ></VStack>
        <VStack
          w="85%"
          minH="93vh"
          alignItems="stretch"
          bg="gray.100"
          spacing={0}
        >
          <HStack
            w="100%"
            minH="4rem"
            borderBottom="solid 1px gray"
            pl="10px"
            pr="10px"
            justifyContent="space-around"
          >
            <Text fontSize="20px" fontWeight="600">
              Users
            </Text>
            <Text>total: 0</Text>
          </HStack>
          <VStack w="100%" minH="84vh" overflow="auto">
            <Table>
              <Thead>
                <Th>Username</Th>
                <Th>Age</Th>
                <Th>City</Th>
                <Th>Admin</Th>
                <Th>Friends</Th>
                <Th>Registered since</Th>
                <Th>Profile URL</Th>
              </Thead>
            </Table>
          </VStack>
        </VStack>
      </HStack>
    </>
  );
}

export default Admin;
