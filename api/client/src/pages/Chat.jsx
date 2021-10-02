import { HStack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import ChatLeftBar from "../components/chat/ChatLeftBar";
import ChatWindow from "../components/chat/ChatWindow";
import Header from "../components/Header";
import { axiosInstance } from "../config";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";

function Chat() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    socket.on("users", (users) => {
      users.forEach((user) => {
        user.self = user.userID === socket.id;
        user.hasNewMessages = false;
        setConnectedUsers((prevUsers) => [...prevUsers, user]);
      });

      const sortedConnectedUsers = connectedUsers.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setConnectedUsers(sortedConnectedUsers);
    });

    socket.on("user connected", (user) => {
      user.hasnewMessages = false;
      setConnectedUsers((prevUsers) => [...prevUsers, user]);
    });
  }, [connectedUsers]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axiosInstance.get("/conversations/" + user.userId);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user.userId]);

  return (
    <>
      <Header />
      <HStack spacing={0} minW="100vw" minH="90vh" alignItems="flex-start">
        <ChatLeftBar
          conversations={conversations}
          setConversations={setConversations}
          user={user}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
        />
        <ChatWindow currentChat={currentChat} user={user} />
      </HStack>
    </>
  );
}

export default Chat;
