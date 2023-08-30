import React from "react";
import { Box, Button, Tooltip, useToast } from "@chakra-ui/react";
import { FaYoutube } from "react-icons/fa";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";

const LoginWithGoogle = ({ setUserServer }) => {
  const { handleLogin } = useWorkspaceContext();
  const userServerFromSession = sessionStorage.getItem("userServer");
  const toast = useToast();

  const LoginToYoutube = () => {
    if (!userServerFromSession || userServerFromSession.length === 0) {
      toast({
        title: "Connect to a server first!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    handleLogin(userServerFromSession);
  };

  return (
    <Box
      w={"full"}
      display={"flex"}
      justifyContent={"space-evenly"}
      alignItems={"center"}
    >
      {!userServerFromSession && (
        <Tooltip label={`Admin needs to sign in`} hasArrow placement="top">
          <Button
            fontSize={"xl"}
            rightIcon={<FaYoutube />}
            colorScheme="red"
            onClick={LoginToYoutube}
            padding={2}
          >
            Login to
          </Button>
        </Tooltip>
      )}
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
