import React from "react";
import { Box, Button, Tooltip } from "@chakra-ui/react";
import { FaYoutube } from "react-icons/fa";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";

const LoginWithGoogle = () => {
  const { handleLogin } = useWorkspaceContext();

  return (
    <Box
      w={"full"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Tooltip label={`Admin needs to sign in`} hasArrow placement="top">
        <Button
          fontSize={"2xl"}
          leftIcon={<FaYoutube />}
          colorScheme="red"
          onClick={handleLogin}
          padding={2}
        >
          Login to Youtube
        </Button>
      </Tooltip>
    </Box>
  );
};

export default LoginWithGoogle;
