import {
  Center,
  Image,
  Text,
  Container,
  Circle,
  Avatar,
  VStack,
  HStack,
  Box,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import { AiFillCamera } from "react-icons/ai";

function ProfilePics() {
  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");

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
            src="cover/SaintMichel-cover.jpg"
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
                <Avatar
                  position="relative"
                  zIndex={0}
                  w="150px"
                  h="150px"
                  name="Maxime Wets"
                  src="person/Max.jpg"
                  cursor="pointer"
                  border="white 2px solid"
                />
              </Circle>
              <Circle
                cursor="pointer"
                maxW="30px"
                bg="gray.100"
                border="solid 3px lightgray"
                zIndex={2}
                position="relative"
                top="-50px"
                left="55px"
              >
                <AiFillCamera size="xs" />
              </Circle>
              {isLargerThan900 ? (
                <HStack
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
                  <AiFillCamera />
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
                  <AiFillCamera size="md" />
                </Box>
              )}
            </VStack>
          </Center>
          <Center position="relative" top="-55px">
            <Text fontSize="28px" fontWeight="bold">
              Maxime Wets
            </Text>
          </Center>
        </Container>
      </Box>
    </>
  );
}

export default ProfilePics;
