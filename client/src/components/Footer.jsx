import React from "react";
import { Box, Stack } from "@chakra-ui/react";

function Footer() {
  return (
    <Box
      as="footer"
      role="contentinfo"
      mx="auto"
      maxW="100vw"
      py="5"
      px={{ base: "4", md: "8" }}
      bg="blue.700"
    >
      <Stack>
        <Box color="white" alignSelf={{ base: "center", sm: "start" }}>
          © 2021 MaxWeb, Inc. All rights reserved.
        </Box>
      </Stack>
    </Box>
  );
}

export default Footer;
