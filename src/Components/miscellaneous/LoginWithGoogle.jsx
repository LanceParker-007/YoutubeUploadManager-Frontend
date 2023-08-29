import React from "react";
import { Box, Button, Tooltip } from "@chakra-ui/react";
import { FaYoutube } from "react-icons/fa";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";

const LoginWithGoogle = ({ setUserServer }) => {
  const { handleLogin } = useWorkspaceContext();

  return (
    <Box
      w={"full"}
      display={"flex"}
      justifyContent={"space-evenly"}
      alignItems={"center"}
    >
      <Tooltip label={`Admin needs to sign in`} hasArrow placement="top">
        <Button
          fontSize={"xl"}
          rightIcon={<FaYoutube />}
          colorScheme="red"
          onClick={handleLogin}
          padding={2}
        >
          Login to
        </Button>
      </Tooltip>
      <Tooltip label={`Disconnect from server`} hasArrow placement="top">
        <Button
          colorScheme="red"
          onClick={() => {
            setUserServer("");
            sessionStorage.removeItem("userServer");
          }}
        >
          Disconnect
        </Button>
      </Tooltip>
    </Box>
  );
};

export default LoginWithGoogle;
