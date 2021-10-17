import React, { useState, useEffect, useContext } from "react";
import {
  InputGroup,
  InputLeftElement,
  Input,
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import { axiosInstance } from "../config";
import { AuthContext } from "../context/AuthContext";

function SearchBar({ isLargerThan700 }) {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const PF = "http://localhost:3000/";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [user]);

  const onChangeHandler = (text) => {
    let matches = [];
    if (text.length > 0) {
      matches = users.filter((user) => {
        const regex = new RegExp(`${text}`, "gi");
        return user.username.match(regex);
      });
    }
    //console.log("matches", matches);
    setSuggestions(matches);
    setText(text);
  };

  return (
    <VStack
      position="absolute"
      left={isLargerThan700 ? "120px" : "0px"}
      top="8px"
      spacing={0}
    >
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.500" />}
        />
        <Input
          w={isLargerThan700 ? "220px" : "160px"}
          h="35px"
          bg="white"
          type="text"
          placeholder={isLargerThan700 ? "Search someone..." : "Search..."}
          onChange={(e) => onChangeHandler(e.target.value)}
          value={text}
        />
      </InputGroup>
      <Box mt="4px" maxH="250px" w="99%" overflowY="auto" zIndex="50">
        {suggestions &&
          suggestions.map((suggestion, i) => (
            <Link
              to={`/profile/${suggestion._id}`}
              style={{ textDecoration: "none" }}
              key={i}
            >
              <HStack
                bg="white"
                p="4px"
                _hover={{ backgroundColor: "blue.200" }}
              >
                <Avatar
                  size="md"
                  name={suggestion.username}
                  src={PF + suggestion.profilePicture}
                  cursor="pointer"
                />
                <Text
                  h="14px"
                  fontWeight="500"
                  position="relative"
                  top="-5px"
                  style={{ textDecoration: "none" }}
                >
                  {suggestion.username}
                </Text>
              </HStack>
            </Link>
          ))}
      </Box>
    </VStack>
  );
}

export default SearchBar;
