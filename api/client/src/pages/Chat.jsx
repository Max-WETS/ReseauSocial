import { HStack } from "@chakra-ui/react";
import React from "react";
import ChatLeftBar from "../components/chat/ChatLeftBar";
import ChatWindow from "../components/chat/ChatWindow";
import Header from "../components/Header";

function Chat() {
  return (
    <>
      <Header />
      <HStack spacing={0} minW="100vw" minH="90vh" alignItems="flex-start">
        <ChatLeftBar />
        <ChatWindow />
      </HStack>
    </>
  );
}

export default Chat;
