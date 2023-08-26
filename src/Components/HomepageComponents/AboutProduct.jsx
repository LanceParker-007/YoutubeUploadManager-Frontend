import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import TheProblem from "./TheProblem.jsx";
import TheProduct from "./TheProduct.jsx";
import HowToUseTheProduct from "./HowToUseTheProduct.jsx";

const AboutProduct = () => {
  return (
    <Box
      mx={{ base: "1rem", md: "4rem" }}
      my={4}
      border={"1px"}
      borderColor={"blackAlpha.100"}
    >
      <Tabs variant="enclosed">
        <TabList>
          <Tab>The Problem</Tab>
          <Tab>About us/ The Product/Solution</Tab>
          <Tab>How to use</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TheProblem />
          </TabPanel>
          <TabPanel>
            <TheProduct />
          </TabPanel>
          <TabPanel>
            <HowToUseTheProduct />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AboutProduct;
