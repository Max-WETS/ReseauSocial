import { HStack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import ChatLeftBar from "../components/chat/ChatLeftBar";
import ChatWindow from "../components/chat/ChatWindow";
import Header from "../components/Header";
import { axiosInstance } from "../config";
import { AuthContext } from "../context/AuthContext";

function Chat() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    console.log("currenct chat conv: " + currentChat?._id);
  }, [currentChat]);

  useEffect(() => {
    console.log(
      "chat window / connected users: " + user.connectedUsers
        ? user.connectedUsers.length
        : "0"
    );
    for (let u of user.connectedUsers) {
      console.log(u);
    }
    const getConversations = async () => {
      try {
        const res = await axiosInstance.get("/conversations/" + user.userId);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user.userId, user.connectedUsers]);

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
