import React from "react";
import { useWorkspaceContext } from "../Context/WorkspaceProvider";
import { Box } from "@chakra-ui/react";
import SingleWorkspace from "./SingleWorkspace";

const WorkspaceBox = ({ fetchAgain, setFetchAgain }) => {
  // In chat provider we have user, his/her chats, his/her selectedChat
  const { selectedWorkspace } = useWorkspaceContext();

  return (
    <Box
      display={{ base: selectedWorkspace ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SingleWorkspace fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default WorkspaceBox;
