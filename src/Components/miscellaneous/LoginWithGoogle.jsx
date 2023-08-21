import React from "react";
import queryString from "query-string";
import { Box, Button, Tooltip } from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";

const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = "http://localhost:5000/google/callback";
const scopes = ["https://www.googleapis.com/auth/youtube.upload"];

const authorizationUrl = `https://accounts.google.com/o/oauth2/auth?${queryString.stringify(
  {
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    response_type: "code",
  }
)}`;

const LoginWithGoogle = () => {
  const handleLogin = () => {
    window.location.href = authorizationUrl;
  };

  return (
    <Box
      w={"full"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Tooltip label={`Admin needs to sign in`} hasArrow placement="top">
        <Button
          rightIcon={<FaGoogle />}
          colorScheme="red"
          onClick={handleLogin}
        >
          Login with Google
        </Button>
      </Tooltip>
    </Box>
  );
};

export default LoginWithGoogle;
