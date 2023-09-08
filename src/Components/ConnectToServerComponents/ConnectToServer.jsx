import {
  Button,
  HStack,
  Input,
  Text,
  Tooltip,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import server from "../../index";

const ConnectToServer = ({ userServer, setUserServer }) => {
  const [inputServer, setInputServer] = useState(
    "https://yum-backend.vercel.app"
  ); //singleworkspace se leke aate isko
  const [loading, setLoading] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const toast = useToast();

  const authenticateUserServer = async () => {
    if (!inputServer || inputServer.length === 0) {
      toast({
        title: "Enter your server IP address",
        status: "error",
        duration: 4000,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${server}/api/userserver/checksubscription`,
        { inputServer },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: data.message,
        status: "success",
        duration: 4000,
        position: "top",
      });
      setUserServer(inputServer);
      sessionStorage.setItem("userServer", inputServer);
      setLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 4000,
        position: "top",
      });
      setLoading(false);
    }
  };
  useEffect(() => {}, [fetchAgain]);

  return (
    <VStack>
      <Text fontSize={"xl"} fontFamily={"monospace"}>
        Enter server IP
      </Text>
      <HStack width={"20rem"} alignItems={"center"}>
        <Input
          bg={"white"}
          name="userServer"
          value={inputServer}
          onChange={(e) => setInputServer(e.target.value)}
          isRequired
          borderColor={"orange"}
          fontFamily={"monospace"}
        />
        <Tooltip placement={"top"} label={"Connect to your server"} hasArrow>
          <Button
            isLoading={loading}
            onClick={authenticateUserServer}
            colorScheme={"green"}
          >
            Connect
          </Button>
        </Tooltip>
      </HStack>
    </VStack>
  );
};

export default ConnectToServer;
