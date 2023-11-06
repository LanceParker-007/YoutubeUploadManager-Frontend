import { Box, Button, Heading, Link, Text } from "@chakra-ui/react";
import React from "react";
import { FaTwitter } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      bg={"blackAlpha.900"}
      mb={0}
      height={"20vh"}
      p={"1rem"}
      color={"white"}
    >
      <Heading fontSize={"x-large"} my={1}>
        @YUM
      </Heading>
      <Box display={"flex"} alignItems={"center"}>
        <Text
          fontSize={{ base: "1rem", md: "1.5rem" }}
          ml={{ base: "2", md: "0" }}
        >
          Queries?{" "}
        </Text>
        <Text fontSize={{ base: "1rem", md: "1.5rem" }} ml={2}>
          Contact{" "}
        </Text>

        <Link href="https://twitter.com/Ore_wa_King" my={1}>
          <Button
            ml={2}
            color={"twitter.900"}
            rightIcon={
              <FaTwitter
                fontSize={"2rem"}
                color={"twitter.900"}
                icon={<FaTwitter />}
              />
            }
          >
            Twitter
          </Button>
        </Link>
      </Box>
      <NavLink style={{ color: "white" }} to={"/privacy-policy"}>
        Read Privacy Policy
      </NavLink>
    </Box>
  );
};

export default Footer;
