import { AddIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, HStack, Heading, Text } from "@chakra-ui/react";
import React from "react";

const HowToUseTheProduct = () => {
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
        YUM is easy:
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
            Login into your account. Choose a workspace from 'My Workspaces'
            section.
          </Text>
        </HStack>
        <Divider my={1} />
        <HStack>
          <ArrowRightIcon boxSize={{ base: "1.4rem", md: "2.4rem" }} />
          <Text bg={"aliceblue"} p={1}>
            If you have no workspaces, click on{" "}
            <Button colorScheme="yellow" rightIcon={<AddIcon />}>
              Workspace
            </Button>{" "}
            to create your workspace.
          </Text>
        </HStack>
        <Divider my={1} />
        <HStack>
          <ArrowRightIcon boxSize={{ base: "1.4rem", md: "2.4rem" }} />
          <Text bg={"aliceblue"} p={1}>
            Now, the editors can upload video to the YUM using{" "}
            <Button variant={"solid"} colorScheme={"blue"}>
              Upload Video
            </Button>{" "}
            . Once uploaded the uploaded video will be visible to everyone in
            the workspace.
          </Text>
        </HStack>
        <Divider my={1} />
        <HStack>
          <ArrowRightIcon boxSize={{ base: "1.4rem", md: "2.4rem" }} />
          <Text bg={"aliceblue"} p={1}>
            Now the Youtuber can upload this video directly to Youtube with just
            one click 🚀. Yayy!
          </Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default HowToUseTheProduct;
