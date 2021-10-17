import {
  Text,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Flex,
  Circle,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { axiosInstance } from "../config";
import { ImStatsDots } from "react-icons/im";
import { FaUsers } from "react-icons/fa";
import { BsFillTrashFill } from "react-icons/bs";

function Admin() {
  const [usersData, setUsersData] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Users");
  const menuItems = ["Statistics", "Users"];
  const menuIcons = [<ImStatsDots />, <FaUsers />];

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

      setUsersData(fetchedUsers);
    };

    fetchUsersData();
  }, []);

  function Row({ userData }) {
    const [mouseOver, setMouseOver] = useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = React.useRef();

    const handleClickDelete = async (userId) => {
      try {
        await axiosInstance.delete(`/users/${userId}`);
      } catch (err) {
        console.log(err);
      }
      setUsersData((prev) => [...prev].filter((u) => u._id !== userId));
      onClose();
    };

    return (
      <Tr
        _hover={{ bg: "gray.300" }}
        onMouseOver={() => setMouseOver(true)}
        onMouseOut={() => setMouseOver(false)}
      >
        <Td>{userData.username}</Td>
        <Td>{userData.email}</Td>
        <Td isNumeric>{userData.age}</Td>
        <Td>{userData.city}</Td>
        <Td>{userData.isAdmin ? "true" : "false"}</Td>
        <Td isNumeric>{userData.friendsList.length}</Td>
        <Td>{new Date(Date.parse(userData.createdAt)).toDateString()}</Td>
        <Td pr="5px" display="flex" justifyContent="center">
          <Link to={`/profile/${userData._id}`}>
            <Button textAlign="center" w="100px">
              View profile
            </Button>
          </Link>
        </Td>
        <Td pl={0} cursor="pointer">
          <Circle _hover={{ color: "gray" }} onClick={() => setIsOpen(true)}>
            <BsFillTrashFill visibility={mouseOver ? "visible" : "hidden"} />
          </Circle>

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Customer
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleClickDelete(userData._id)}
                    ml={3}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Td>
      </Tr>
    );
  }

  function MenuItem({ title, i, activeMenu }) {
    return (
      <Flex
        _hover={{ bg: "gray.300" }}
        bg={title === activeMenu ? "gray.300" : "gray.200"}
        align="center"
        mt={0}
        pl="20px"
        w="100%"
        h="40px"
        borderRadius="5px"
        cursor="pointer"
        onClick={() => handleClickMenu(title)}
      >
        <Box position="relative">{menuIcons[i]}</Box>
        <Text ml="10px" mr="8px">
          {title}
        </Text>
      </Flex>
    );
  }

  const handleClickMenu = (menuTitle) => {
    setActiveMenu(menuTitle);
  };

  return (
    <>
      <Header />
      <HStack
        style={{ height: `calc(100vh - 50px)` }}
        minW="100%"
        spacing={0}
        // minH="93vh"
        alignItems="flex-start"
      >
        <VStack
          w="10rem"
          minW="10rem"
          h="100%"
          //   minH="93vh"
          pt="3px"
          pr="4px"
          pl="4px"
          borderRight="solid 1px lightgray"
          bg="gray.500"
          spacing={1}
        >
          {menuItems.map((m, i) => (
            <MenuItem title={m} i={i} key={i} activeMenu={activeMenu} />
          ))}
        </VStack>
        <VStack
          style={{
            width: `calc(100% - 10rem)`,
          }}
          h="100%"
          minH="93vh"
          alignItems="stretch"
          bg="gray.100"
          spacing={0}
        >
          {activeMenu === "Users" ? (
            <>
              <HStack
                h="4rem"
                borderBottom="solid 1px gray"
                pl="10px"
                pr="10px"
                justifyContent="space-around"
              >
                <Text fontSize="20px" fontWeight="600">
                  Users
                </Text>
                <Text>total: {usersData.length}</Text>
              </HStack>
              <VStack w="100%" H="83vh" overflow="auto">
                <Table variant="simple" colorScheme="blackAlpha" size="md">
                  <Thead>
                    <Tr>
                      <Th>Username</Th>
                      <Th>Email</Th>
                      <Th>Age</Th>
                      <Th>City</Th>
                      <Th>Admin</Th>
                      <Th>Friends</Th>
                      <Th>Registered since</Th>
                      <Th textAlign="center" pr="5px">
                        Profile URL
                      </Th>
                      <Th w="10px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {usersData.map((userData) => (
                      <Row userData={userData} />
                    ))}
                  </Tbody>
                </Table>
              </VStack>
            </>
          ) : null}
        </VStack>
      </HStack>
    </>
  );
}

export default Admin;
