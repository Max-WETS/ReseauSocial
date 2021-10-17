import React, { useState, useEffect, useContext } from "react";
import {
  Flex,
  HStack,
  VStack,
  Text,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Textarea,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { FiMoreVertical } from "react-icons/fi";
import { axiosInstance } from "../../config";
import { timeFormatting } from "../../timeAgo";
import { AuthContext } from "../../context/AuthContext";

function Post({ post, setPosts, isLargerThan700 }) {
  const { user } = useContext(AuthContext);
  const [postUser, setPostUser] = useState({});
  const PF = "http://localhost:3000/";
  const [updatePost, setUpdatePost] = useState(false);
  const [buffer, setBuffer] = useState("");

  useEffect(() => {
    const fectchUserData = async () => {
      try {
        const res = await axiosInstance.get(`/users/${post.userId}`);
        setPostUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fectchUserData();
  }, [post]);

  const handleClickDelete = async () => {
    try {
      await axiosInstance.delete(`/posts/${post._id}`);
      setPosts((prev) => [...prev].filter((p) => p._id !== post._id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickEdit = async () => {
    const payload = {
      userId: user.userId,
      desc: buffer,
    };
    try {
      await axiosInstance.put(`/posts/${post._id}`, payload);
      setPosts((prev) =>
        [...prev].map((p) => {
          if (p._id === post._id) p.desc = buffer;
          return p;
        })
      );
    } catch (err) {
      console.log(err);
    }
    setUpdatePost(false);
  };

  return (
    <>
      <Box bg="gray.100" w="100%" h="5px" />
      <Flex
        paddingTop="10px"
        paddingLeft="10px"
        paddingRight="10px"
        marginTop="10px"
        marginBottom="5px"
        borderRadius="10%"
        margin="auto"
        justifyContent="center"
        maxW="500px"
      >
        <VStack paddingBottom="20px" alignItems="flex-start" minW="100%">
          <HStack
            position="relative"
            minW="100%"
            justifyContent="space-between"
          >
            <Flex>
              <Link
                to={`/profile/${postUser?._id}`}
                style={{ textDecoration: "none" }}
              >
                <Avatar
                  size="md"
                  name={postUser?.username}
                  src={PF + postUser?.profilePicture}
                  cursor="pointer"
                />
              </Link>
              <VStack alignItems="flex-start" ml="5px">
                <Text h="14px" fontWeight="500">
                  {postUser?.username}
                </Text>
                <Text w="100%" marginTop={0} fontSize="12px" align="left">
                  {timeFormatting(Date.parse(post.createdAt))}
                </Text>
              </VStack>
            </Flex>
            {user.userId === postUser?._id || user.isAdmin ? (
              <Menu>
                <MenuButton
                  borderRadius="50%"
                  size="xs"
                  as={IconButton}
                  icon={<FiMoreVertical />}
                />
                <MenuList>
                  <MenuItem
                    icon={<BiEdit />}
                    onClick={() => setUpdatePost(true)}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem icon={<MdDelete />} onClick={handleClickDelete}>
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : null}
          </HStack>
          <Flex minW="100%" borderBottom="1px solid lightgray">
            {!updatePost ? (
              <Text
                minW="100%"
                fontSize="16px"
                lineHeight={1.3}
                paddingBottom="10px"
              >
                {post.desc}
              </Text>
            ) : (
              <VStack w="100%" mb="8px" justifyContent="right">
                <Textarea
                  minW="100%"
                  fontSize="16px"
                  lineHeight={1.3}
                  paddingBottom="10px"
                  defaultValue={post.desc}
                  onChange={(e) => setBuffer(e.target.value)}
                />
                <HStack>
                  <Button w="60px" h="20px" onClick={(e) => handleClickEdit(e)}>
                    Save
                  </Button>
                  <Button
                    w="60px"
                    h="20px"
                    onClick={() => setUpdatePost(false)}
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            )}
          </Flex>
        </VStack>
      </Flex>
    </>
  );
}

export default Post;
