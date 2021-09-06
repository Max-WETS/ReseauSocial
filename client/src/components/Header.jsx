import React, { useContext } from "react";
import {
  Flex,
  Spacer,
  Center,
  Text,
  HStack,
  Box,
  Avatar,
  Button,
  Circle,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { ChatIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "./SearchBar";
import axios from "axios";

function Header({ userData }) {
  const { user, dispatch } = useContext(AuthContext);
  const history = useHistory();
  const PF = "http://localhost:3000/";

  const handleClick = () => {
    const path = "/login";
    axios.get("/auth/logout");
    dispatch({ type: "LOGOUT" });
    history.push(path);
  };

  return (
    <Flex
      h="50px"
      w="100%"
      bg="blue.500"
      position="sticky"
      top={0}
      zIndex={999}
    >
      <HStack spacing="10px">
        <Link to="/">
          <Center
            fontSize="24px"
            ml="20px"
            fontWeight="bold"
            color="white"
            cursor="pointer"
          >
            <Text>MaxWeb</Text>
          </Center>
        </Link>
        <SearchBar />
      </HStack>
      <Spacer />
      <HStack spacing="10px" mr="20px">
        <Link to={`/profile/${user.userId}`}>
          <Flex
            _hover={{ bg: "gray.200" }}
            align="center"
            maxW="100px"
            h="35px"
            bg="white"
            borderRadius="50px"
            cursor="pointer"
          >
            <Avatar
              ml="1px"
              size="sm"
              name="Maxime Wets"
              src={PF + user.profilePicture || "person/noAvatar.jpg"}
            />
            <Text ml="4px" mr="8px">
              {user.username}
            </Text>
          </Flex>
        </Link>
        <Link to="/chat">
          <Circle
            bg="white"
            h="35px"
            w="40px"
            cursor="pointer"
            _hover={{ bg: "gray.200" }}
          >
            <ChatIcon />
          </Circle>
        </Link>
        <Menu>
          <>
            <MenuButton
              w="35px"
              h="35px"
              bg="white"
              borderRadius="45%"
              as={IconButton}
              icon={<ChevronDownIcon />}
            ></MenuButton>
            <MenuList>
              <MenuItem icon={<FaUser />}>Profile</MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={handleClick}>
                Logout
              </MenuItem>
            </MenuList>
          </>
        </Menu>
      </HStack>
    </Flex>
  );
}

export default Header;
