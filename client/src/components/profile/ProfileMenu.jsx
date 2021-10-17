import {
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
} from "@chakra-ui/react";
import React from "react";
import About from "./About";
import Feed from "./Feed";
import Friends from "./Friends";

function ProfileMenu({ userData, friends, setFriends, isUserProfile }) {
  return (
    <>
      {/* <Container maxW="50%" bg="white" pr={0} pl={0}> */}
      <Tabs defaultIndex={1} isFitted variant="enclosed">
        <Container maxW="55%">
          <TabList>
            <Tab zIndex="8">About</Tab>
            <Tab zIndex="8">Feed</Tab>
            <Tab zIndex="8">Friends</Tab>
          </TabList>
        </Container>
        <Box w="100%" h="10px" bg="gray.100" />
        <Box bg="gray.100" maxH="100%" pb="20px">
          <Container maxW="45%" bg="white" minW="350px" padding={0}>
            <TabPanels>
              <TabPanel p={0}>
                <About userData={userData} isUserProfile={isUserProfile} />
              </TabPanel>
              <TabPanel p={0}>
                <Feed userData={userData} />
              </TabPanel>
              <TabPanel p={0}>
                <Friends
                  userData={userData}
                  friends={friends}
                  setFriends={setFriends}
                  isUserProfile={isUserProfile}
                />
              </TabPanel>
            </TabPanels>
          </Container>
        </Box>
      </Tabs>
    </>
  );
}

export default ProfileMenu;
