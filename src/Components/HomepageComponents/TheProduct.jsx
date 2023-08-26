import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Divider, HStack, Heading, Text } from "@chakra-ui/react";
import React from "react";

const TheProduct = () => {
  return (
    <Box
      padding={"1rem"}
      mt={"2rem"}
      minH={"40vh"}
      border={"1px solid black"}
      mx={{ base: "0rem", md: "4rem" }}
      mb={"1rem"}
    >
      <Heading
        fontFamily={"monospace"}
        borderBottom={"1px solid black"}
        bg={"yellow.200"}
        p={1}
        fontSize={"2rem"}
      >
        The product:
      </Heading>

      <Box
        minheight={"40vh"}
        my={1}
        fontFamily={"mono"}
        fontSize={{ base: "0.9rem", md: "1.4rem" }}
        textAlign={"justify"}
      >
        <HStack>
          <ArrowRightIcon boxSize={{ base: "1.4rem", md: "2.4rem" }} />
          <Text bg={"aliceblue"} p={1}>
            YUM is the solution of the discussed problem.
          </Text>
        </HStack>
        <Divider my={1} />
        <HStack>
          <ArrowRightIcon boxSize={{ base: "1.4rem", md: "2.4rem" }} />
          <Text bg={"aliceblue"} p={1}>
            A Youtuber can create a workspace on YUM and add his editors to the
            workspace.
          </Text>
        </HStack>
        <Divider my={1} />
        <HStack>
          <ArrowRightIcon boxSize={{ base: "1.4rem", md: "2.4rem" }} />
          <Text bg={"aliceblue"} p={1}>
            Now, after the doing the editing the editors can upload the video on
            YUM.
          </Text>
        </HStack>
        <Divider my={1} />
        <HStack>
          <ArrowRightIcon boxSize={{ base: "1.4rem", md: "2.4rem" }} />
          <Text bg={"aliceblue"} p={1}>
            Now, the Youtuber can upload these videos to Youtube with just
            single click without any downloading or uploading of the video.
          </Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default TheProduct;
