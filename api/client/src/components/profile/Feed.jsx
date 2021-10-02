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
import React, { useContext, useEffect, useState } from "react";
import { AiFillPicture } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import Post from "./Post";
import Share from "./Share";

function Feed({ userData }) {
  const [posts, setPosts] = useState([]);
  const [confirmedFriends, setConfirmedFriends] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get(`/posts/timeline/${userData._id}`);
        const postsList = res.data.sort((a, b) => {
          return new Date(b.createAt) - new Date(a.createdAt);
        });
        setPosts(postsList);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [userData]);

  useEffect(() => {
    const fetchConfirmedFriends = async () => {
      try {
        const res = await axiosInstance.get(`/friends/${user.userId}`);
        const confirmedFriendsList = res.data
          .filter((f) => f.status === "confirmé")
          .reduce((acc, obj) => {
            acc.push(obj.friendId);
            return acc;
          }, []);
        setConfirmedFriends(confirmedFriendsList);
      } catch (err) {
        console.log(err);
      }
    };
    fetchConfirmedFriends();
  }, [user.userId]);

  return (
    <>
      {(userData._id === user.userId ||
        confirmedFriends.includes(userData._id)) && <Share />}
      {posts.map((p) => (
        <Post post={p} key={p._id} />
      ))}
    </>
  );
}

export default Feed;
