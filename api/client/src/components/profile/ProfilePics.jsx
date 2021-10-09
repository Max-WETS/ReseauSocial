import {
  Avatar,
  Center,
  Image,
  Text,
  Container,
  Circle,
  VStack,
  HStack,
  Box,
  useMediaQuery,
  SimpleGrid,
  Button,
  FormLabel,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useContext, useState, useEffect } from "react";
import { AiFillCamera, AiOutlineCheck } from "react-icons/ai";
import { IoPersonAddSharp } from "react-icons/io5";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";
//const requestUtils = require("../../request.utils");

function ProfilePics({ userData, profileUserStatus, isUserProfile }) {
  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");
  const { user, dispatch } = useContext(AuthContext);
  const PF = "http://localhost:3000/";
  const [file, setFile] = useState();
  const [recommendations, setRecommendations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handlePicture = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", user.username);
    data.append("userId", user.userId);
    data.append("file", file);
    console.log(data);

    try {
      await axiosInstance.post(`users/upload`, data);
      dispatch({
        type: "UPDATE_PROFILE_PIC",
        payload: `person/${user.username}.jpg`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickAdd = async () => {
    try {
      await axiosInstance.post(`/friends/${userData._id}/add`, {
        userId: user.userId,
      });
      const res = await axiosInstance.get(`/friends/${user.userId}`);
      const friendsList = res.data;
      const newFriendArray = friendsList.filter(
        (friend) => friend.friendId === userData._id
      );
      const newFriend = newFriendArray[0];
      newFriend["username"] = userData.username;
      newFriend["profilePicture"] = userData.profilePicture;

      dispatch({ type: "ADD_FRIEND", payload: newFriend });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickRemove = async () => {
    try {
      await axiosInstance.put(`/friends/${userData._id}/remove`, {
        userId: user.userId,
      });
      dispatch({ type: "REMOVE_FRIEND", payload: userData._id });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickRecommend = async (recommendation) => {
    setIsOpen(false);
    try {
      await axiosInstance.post(`/friends/${recommendation._id}/recommend`, {
        userId: user.userId,
        recommendedFriendId: userData._id,
      });
      const recommendations = await axiosInstance.post(
        `/friends/${userData._id}/recommendations`,
        { senderId: user.userId }
      );
      console.log("recommendations post add: " + recommendations.data.length);
      for (let u of recommendations.data) {
        console.log(u);
      }
      setRecommendations(recommendations.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (isUserProfile) return;
      try {
        const recommendations = await axiosInstance.post(
          `/friends/${userData._id}/recommendations`,
          { senderId: user.userId }
        );
        console.log("recommendations ante add: " + recommendations.data.length);
        for (let u of recommendations.data) {
          console.log(u);
        }
        setRecommendations(recommendations.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRecommendations();
  }, [user.userId, userData._id]);

  return (
    <>
      <Box maxH="450px">
        <Center
          boxSizing="border-box"
          boxShadow="rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;"
        >
          <Image
            h="350px"
            w="900px"
            objectFit="cover"
            src={PF + "cover/nocover.svg"}
            alt="cover picture"
            borderBottomRadius="5px"
          />
        </Center>
        <Container
          maxW="800px"
          maxH="230px"
          borderBottom="solid 1px lightgray"
          position="relative"
          top="-140px"
        >
          <Center>
            <VStack>
              <Circle>
                <Image
                  position="relative"
                  zIndex={0}
                  w="150px"
                  h="150px"
                  borderRadius="50%"
                  name={userData.username}
                  src={
                    PF + userData.profilePicture || PF + "person/noAvatar.png"
                  }
                  cursor="pointer"
                  border="white 2px solid"
                />
              </Circle>
              <Popover placement="right-end" isLazy>
                <PopoverTrigger>
                  <Circle
                    visibility={isUserProfile ? "visible" : "hidden"}
                    cursor="pointer"
                    maxW="30px"
                    bg="gray.100"
                    border="solid 3px lightgray"
                    zIndex={2}
                    position="relative"
                    top="-50px"
                    left="55px"
                  >
                    <AiFillCamera sizes="sm" />
                  </Circle>
                </PopoverTrigger>
                <PopoverContent zIndex={8}>
                  <Formik>
                    <Form onSubmit={handlePicture}>
                      <FormLabel
                        htmlFor="file"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Input
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          pt="4px"
                          mt="5px"
                          type="file"
                          id="file"
                          name="file"
                          accept=".jpg, .jpeg, .png"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                        <Input
                          margin="auto"
                          mt="5px"
                          mb="5px"
                          w="80px"
                          h="30px"
                          bg="blue.400"
                          _hover={{
                            backgroundColor: "lightblue",
                          }}
                          cursor="pointer"
                          color="white"
                          type="submit"
                          value="Send"
                        />
                      </FormLabel>
                    </Form>
                  </Formik>
                </PopoverContent>
              </Popover>
              {isLargerThan900 ? (
                <HStack
                  visibility={isUserProfile ? "visible" : "hidden"}
                  borderRadius="md"
                  pl="6px"
                  pr="6px"
                  position="relative"
                  bg="gray.100"
                  h="28px"
                  right="-300px"
                  bottom="110px"
                  cursor="pointer"
                >
                  <AiFillCamera sizes="xs" />
                  <Text fontSize="14px" fontWeight="600">
                    Changer la photo de couverture
                  </Text>
                </HStack>
              ) : (
                <Box
                  borderRadius="md"
                  border="2px solid lightgray"
                  bg="gray.100"
                  h="28px"
                  position="relative"
                  right="-250px"
                  bottom="110px"
                  cursor="pointer"
                >
                  <AiFillCamera sizes="md" />
                </Box>
              )}
            </VStack>
          </Center>
          <SimpleGrid columns={3} spacing={0}>
            <Box></Box>
            <Center position="relative" top="-55px">
              <Text fontSize="28px" fontWeight="bold">
                {userData.username}
              </Text>
            </Center>
            <Box>
              <Center>
                {(() => {
                  switch (profileUserStatus) {
                    case "friend":
                      return (
                        <Popover
                          // isOpen={isOpen}
                          closeOnBlur={true}
                          closeOnEsc={true}
                          modifiers={[
                            {
                              name: "eventListeners",
                              options: { scroll: false },
                            },
                            // {
                            //   name: "offset",
                            //   options: { offset: [183, -40] },
                            // },
                          ]}
                          // placement="right-end"
                          isLazy
                        >
                          <PopoverTrigger m={0}>
                            <Button
                              bg="blue.300"
                              w="65px"
                              h="25px"
                              position="relative"
                              top="-45px"
                              alignItems="center"
                              justifyContent="center"
                              textAlign="center"
                              onClick={() => setIsOpen(true)}
                            >
                              <HStack spacing={0}>
                                <Text>Friend</Text>
                                <AiOutlineCheck />
                              </HStack>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>
                              Recommend this friend to:
                            </PopoverHeader>
                            <PopoverBody>
                              {recommendations.length > 0 ? (
                                recommendations.map((recommendation, i) => (
                                  <HStack
                                    bg="white"
                                    p="4px"
                                    _hover={{ backgroundColor: "blue.200" }}
                                    key={i}
                                    cursor="pointer"
                                    onClick={() =>
                                      handleClickRecommend(recommendation)
                                    }
                                  >
                                    <Avatar
                                      size="md"
                                      name={recommendation.username}
                                      src={PF + recommendation.profilePicture}
                                      cursor="pointer"
                                    />
                                    <Text
                                      h="14px"
                                      fontWeight="500"
                                      position="relative"
                                      top="-5px"
                                      style={{ textDecoration: "none" }}
                                    >
                                      {recommendation.username}
                                    </Text>
                                  </HStack>
                                ))
                              ) : (
                                <Text>
                                  This user is already in touch with all your
                                  friends
                                </Text>
                              )}
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      );
                    case "pending":
                      return (
                        <Button
                          bg="blue.300"
                          w="80px"
                          h="25px"
                          position="relative"
                          top="-45px"
                          alignItems="center"
                          justifyContent="center"
                          textAlign="center"
                        >
                          <HStack spacing={0}>
                            <Text>Pending...</Text>
                          </HStack>
                        </Button>
                      );
                    case "friend request sent":
                      return (
                        <Button
                          bg="red.200"
                          w="80px"
                          h="25px"
                          position="relative"
                          top="-45px"
                          alignItems="center"
                          justifyContent="center"
                          textAlign="center"
                          onClick={handleClickRemove}
                        >
                          <HStack spacing={0}>
                            <Text>Cancel</Text>
                          </HStack>
                        </Button>
                      );
                    case "notFriend":
                      return (
                        <Button
                          bg="gray.100"
                          w="70px"
                          h="25px"
                          position="relative"
                          top="-45px"
                          alignItems="center"
                          justifyContent="center"
                          textAlign="center"
                          onClick={handleClickAdd}
                        >
                          <HStack spacing={1}>
                            <Text>Add</Text>
                            <IoPersonAddSharp />
                          </HStack>
                        </Button>
                      );
                    default:
                      return null;
                  }
                })()}
              </Center>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}

export default ProfilePics;
