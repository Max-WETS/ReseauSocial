import React, { useEffect, useState } from "react";
import { Container, Text, Box, VStack, HStack } from "@chakra-ui/react";
import { axiosInstance } from "../../config";
import AboutField from "./AboutField";

function About({ userData, isUserProfile }) {
  const [bufferBio, setBufferBio] = useState("");
  const [bufferAge, setBufferAge] = useState("");
  const [bufferCity, setBufferCity] = useState("");
  const [bufferEmail, setBufferEmail] = useState("");
  const [updateFormBio, setUpdateFormBio] = useState(false);
  const [updateFormAge, setUpdateFormAge] = useState(false);
  const [updateFormCity, setUpdateFormCity] = useState(false);
  const [updateFormEmail, setUpdateFormEmail] = useState(false);
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get(`/users/${userData._id}`);
        const userInfo = {
          bio: res.data.desc,
          age: res.data.age,
          city: res.data.city,
          email: res.data.email,
        };
        setBio(userInfo.bio);
        setAge(userInfo.age);
        setCity(userInfo.city);
        setEmail(userInfo.email);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserData();
  }, [userData]);

  const updateUserInfo = async (field, update) => {
    const payload = {
      userId: userData._id,
    };
    payload[field] = update;
    try {
      await axiosInstance.put(`/users/${userData._id}`, payload);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    try {
      switch (e.target.value) {
        case "desc":
          setBio(bufferBio);
          updateUserInfo("desc", bufferBio);
          setUpdateFormBio(false);
          break;
        case "age":
          setAge(bufferAge);
          updateUserInfo("age", bufferAge);
          setUpdateFormAge(false);
          break;
        case "city":
          setCity(bufferCity);
          updateUserInfo("city", bufferCity);
          setUpdateFormCity(false);
          break;
        case "email":
          setEmail(bufferEmail);
          updateUserInfo("email", bufferEmail);
          setUpdateFormCity(false);
          break;
        default:
          return null;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container
      maxW="600px"
      paddingTop="10px"
      paddingBottom="10px"
      pr={0}
      pl={0}
    >
      <Box paddingBottom="5px">
        <Text ml="8px" fontWeight="600" fontSize="16px">
          About
        </Text>
      </Box>
      <Box borderTop="1px solid lightgray">
        <VStack paddingTop="10px" ml="6px" mr="6px">
          <HStack alignItems="center" w="100%">
            <AboutField
              userData={userData}
              updateForm={updateFormBio}
              setUpdateForm={setUpdateFormBio}
              field="bio"
              value={bio}
              setBuffer={setBufferBio}
              handleUpdate={handleUpdate}
              isUserProfile={isUserProfile}
            />
          </HStack>
          <HStack alignItems="center" w="100%">
            <AboutField
              userData={userData}
              updateForm={updateFormAge}
              setUpdateForm={setUpdateFormAge}
              field="age"
              value={age}
              setBuffer={setBufferAge}
              handleUpdate={handleUpdate}
              isUserProfile={isUserProfile}
            />
          </HStack>
          <HStack alignItems="center" w="100%">
            <AboutField
              userData={userData}
              updateForm={updateFormCity}
              setUpdateForm={setUpdateFormCity}
              field="city"
              value={city}
              setBuffer={setBufferCity}
              handleUpdate={handleUpdate}
              isUserProfile={isUserProfile}
            />
          </HStack>
          <HStack alignItems="center" w="100%">
            <AboutField
              userData={userData}
              updateForm={updateFormEmail}
              setUpdateForm={setUpdateFormEmail}
              field="email"
              value={email}
              setBuffer={setBufferEmail}
              handleUpdate={handleUpdate}
              isUserProfile={isUserProfile}
            />
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
}

export default About;
