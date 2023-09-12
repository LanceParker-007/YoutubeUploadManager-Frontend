import React from "react";
import { Box, Button, Tooltip } from "@chakra-ui/react";
import Cookies from "js-cookie";

const LoginWithGoogle = ({ setUserServer, fetchAllVideoDetails }) => {
  return (
    <Box
      w={"full"}
      display={"flex"}
      justifyContent={"space-evenly"}
      alignItems={"center"}
    >
      <Tooltip label={`Disconnect from server`} hasArrow placement="top">
        <Button
          colorScheme="red"
          onClick={() => {
            setUserServer("");
            sessionStorage.removeItem("userServer");
            Cookies.remove("yt_access_token");
            fetchAllVideoDetails();
          }}
        >
          Disconnect
        </Button>
      </Tooltip>
    </Box>
  );
};

export default LoginWithGoogle;
