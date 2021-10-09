import React from "react";
import {
  Container,
  Grid,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Friend from "./Friend";

function Friends({ friends, userData, isUserProfile }) {
  const confirmedFriends =
    friends.filter((friend) => friend.status === "confirmé") || null;
  const waitingFriends =
    friends.filter(
      (friend) => friend.status === "en attente de confirmation"
    ) || null;
  const recommendedFriends =
    friends.filter((friend) => friend.status === "recommandé") || null;

  return (
    <Container w="600px" paddingTop="10px" pr={0} pl={0}>
      <Grid
        templateColumns="repeat(3, 1fr)"
        paddingBottom="20px"
        alignItems="center"
      >
        <Text fontWeight="bold">Friends</Text>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.500" />}
          />
          <Input
            h="35px"
            w="200px"
            bg="gray.100"
            type="search"
            placeholder="Search someone..."
          />
        </InputGroup>
      </Grid>
      <Tabs variant="soft-rounded" colorScheme="blue.100">
        <TabList borderBottom="solid 1px lightgray">
          <Tab>Confirmés</Tab>
          <Tab>En attente</Tab>
          <Tab>Recommandés</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={2} spacing={5}>
              {confirmedFriends.map((friend) => (
                <Friend
                  key={friend.friendId}
                  friend={friend}
                  isUserProfile={isUserProfile}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={2} spacing={5}>
              {waitingFriends.map((friend) => (
                <Friend
                  key={friend.friendId}
                  friend={friend}
                  isUserProfile={isUserProfile}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={2} spacing={5}>
              {recommendedFriends.map((friend) => (
                <Friend
                  key={friend.friendId}
                  friend={friend}
                  isUserProfile={isUserProfile}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default Friends;
