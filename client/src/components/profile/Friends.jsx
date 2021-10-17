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
  useMediaQuery,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Friend from "./Friend";

function Friends({ friends, setFriends, userData, isUserProfile }) {
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

  const confirmedFriends =
    friends.filter((friend) => friend.status === "confirmé") || null;
  const waitingFriends =
    friends.filter(
      (friend) => friend.status === "en attente de confirmation"
    ) || null;
  const recommendedFriends =
    friends.filter((friend) => friend.status === "recommandé") || null;

  return (
    <Container minW="300px" paddingTop="10px" pr={0} pl={0}>
      <Grid
        templateColumns="repeat(3, 1fr)"
        paddingBottom="20px"
        alignItems="center"
      >
        <Text ml={2} mr={2} fontWeight="bold">
          Friends
        </Text>
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
          <Tab>
            {isLargerThan700
              ? `Confirmed (${confirmedFriends.length})`
              : "Confirmed"}
          </Tab>
          <Tab>
            {isLargerThan700 ? `Pending (${waitingFriends.length})` : "Pending"}
          </Tab>
          <Tab>
            {isLargerThan700
              ? `Recommended (${recommendedFriends.length})`
              : "Recom."}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={isLargerThan700 ? 2 : 1} spacing={5}>
              {confirmedFriends.map((friend) => (
                <Friend
                  key={friend.friendId}
                  friend={friend}
                  setFriends={setFriends}
                  isUserProfile={isUserProfile}
                  userData={userData}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={isLargerThan700 ? 2 : 1} spacing={5}>
              {waitingFriends.map((friend) => (
                <Friend
                  key={friend.friendId}
                  friend={friend}
                  setFriends={setFriends}
                  isUserProfile={isUserProfile}
                  userData={userData}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={isLargerThan700 ? 2 : 1} spacing={5}>
              {recommendedFriends.map((friend) => (
                <Friend
                  key={friend.friendId}
                  friend={friend}
                  setFriends={setFriends}
                  isUserProfile={isUserProfile}
                  userData={userData}
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
