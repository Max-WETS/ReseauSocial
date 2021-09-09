import {
  VStack,
  Box,
  HStack,
  Avatar,
  Input,
  Button,
  Center,
  Container,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { AiFillPicture } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import Post from "./Post";
import Share from "./Share";

function Feed() {
  return (
    <>
      <Share />
      <Post />
      <Post />
    </>
  );
}

export default Feed;
