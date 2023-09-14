import React from "react";
import { Box, Button, Tooltip } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider.js";

const LoginWithGoogle = ({ setUserServer }) => {
  const { setSelectedWorkspace } = useWorkspaceContext();

  const disconnectServer = async () => {
    setUserServer("");
    sessionStorage.removeItem("userServer");
    sessionStorage.removeItem("hashData");
    Cookies.remove("yt_access_token");
    setSelectedWorkspace(null);
  };

  return (
    <Box
      w={"full"}
      display={"flex"}
      justifyContent={"space-evenly"}
      alignItems={"center"}
    >
      <Tooltip label={`Disconnect from server`} hasArrow placement="top">
        <Button colorScheme="red" onClick={disconnectServer}>
          Disconnect
        </Button>
      </Tooltip>
    </Box>
  );
};

export default LoginWithGoogle;
