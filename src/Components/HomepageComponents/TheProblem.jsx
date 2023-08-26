import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Divider, HStack, Heading, Text } from "@chakra-ui/react";
import React from "react";

const TheProblem = () => {
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
        The problem:
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
            A Youtuber rercords his video and send the recordings to his team of
            editors.
          </Text>
        </HStack>
        <Divider my={1} />
        <HStack>
          <ArrowRightIcon boxSize={{ base: "1.4rem", md: "2.4rem" }} />
          <Text bg={"aliceblue"} p={1}>
            Once the editors finish their job they send the video back to the
            Youtuber.
          </Text>
        </HStack>
        <Divider my={1} />
        <HStack>
          <ArrowRightIcon boxSize={{ base: "1.4rem", md: "2.4rem" }} />
          <Text bg={"aliceblue"} p={1}>
            Now, to upload this video to Youtube, Youtuber first has to download
            the large video file on his system and then he will upload this to
            the Youtube.
          </Text>
        </HStack>
        <Divider my={1} />
        <HStack>
          <ArrowRightIcon boxSize={{ base: "1.4rem", md: "2.4rem" }} />
          <Text bg={"aliceblue"} p={1}>
            This downloading and uploading of large video file is the problem
            Youtubers face, which we can solve using YUM(Youtube Upload
            Manager).
          </Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default TheProblem;
