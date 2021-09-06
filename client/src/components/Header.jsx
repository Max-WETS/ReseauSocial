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
import axios from "axios";

function Header() {
  const { user, dispatch } = useContext(AuthContext);
  const history = useHistory();

  const handleClick = () => {
    const path = "/login";
    user && axios.get("/auth/logout");
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
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.500" />}
          />
          <Input
            h="35px"
            bg="white"
            type="search"
            placeholder="Search someone..."
          />
        </InputGroup>
      </HStack>
      <Spacer />
      <HStack spacing="10px" mr="20px">
        <Link to="/profile">
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
              src="person/Max.jpg"
            />
            <Text ml="4px" mr="8px">
              Maxime
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
