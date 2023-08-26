import {
  Box,
  Container,
  // Tab,
  // TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Heading,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Login from "../Components/Auth/Login";
import SignUp from "../Components/Auth/SignUp";

const HomePage = () => {
  return (
    <Container maxW={"xl"} centerContent>
      <Box
        display={"flex"}
        justifyContent={"center"}
        p={3}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        bg={"aliceblue"}
      >
        <Heading fontSize={"2xl"} color={"black"} letterSpacing={1}>
          Youtube Upload Manager
        </Heading>
      </Box>
      <Box
        bg={"aliceblue"}
        w={"100%"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Tabs variant="unstyled" color={"black"}>
          {/* <TabList mb={"1em"}>
            <Tab
              bg={"green.100"}
              _selected={{ color: "white", bg: "green.400" }}
              width={"50%"}
              p={2}
              borderRadius={"lg"}
            >
              Login
            </Tab>
            <Tab
              bg={"blue.100"}
              _selected={{ color: "white", bg: "blue.500" }}
              width={"50%"}
              p={2}
              borderRadius={"lg"}
            >
              SignUp
            </Tab>
          </TabList> */}
          <Text
            textAlign={"center"}
            fontFamily={"monospace"}
            fontWeight={"bold"}
            fontSize={"2xl"}
          >
            Already have an account
          </Text>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Box
        color={"red"}
        width={"full"}
        textAlign={"left"}
        p={1}
        bg={"whitesmoke"}
      >
        *Only Google Accounts allowed by developer will be able to upload videos
        to youtube. <br />
        *Since in demo mode, video size is limited to 40mb max.
      </Box>
    </Container>
  );
};

export default HomePage;
