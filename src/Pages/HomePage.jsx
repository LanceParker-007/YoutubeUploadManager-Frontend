import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Heading,
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
        bg={"white"}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Heading
          fontFamily={"fantasy"}
          fontSize={"2xl"}
          color={"black"}
          letterSpacing={1}
        >
          Youtube Upload Manager
        </Heading>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Tabs variant="unstyled" color={"black"}>
          <TabList mb={"1em"}>
            <Tab
              _selected={{ color: "white", bg: "green.400" }}
              width={"50%"}
              p={2}
              borderRadius={"lg"}
            >
              Login
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "blue.500" }}
              width={"50%"}
              p={2}
              borderRadius={"lg"}
            >
              SignUp
            </Tab>
          </TabList>
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
