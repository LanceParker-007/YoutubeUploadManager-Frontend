import { useEffect } from "react";
import { useWorkspaceContext } from "../Context/WorkspaceProvider.js";
import { Box, Button, Text, Stack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import WorkspacesLoading from "./WorkspacesLoading.jsx";
import CreateWorkspaceModal from "./miscellaneous/CreateWorkspaceModal.jsx";

const MyWorkspaces = ({ fetchAgain }) => {
  const toast = useToast();
  const {
    user,
    workspaces,
    setWorkspaces,
    selectedWorkspace,
    setSelectedWorkspace,
  } = useWorkspaceContext();

  const fetchWorkspaces = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "/api/workspace/fetchallworkspaces",
        config
      );
      setWorkspaces(data);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to fetch workspaces",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    fetchWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]); //Why fetchAgain here

  return (
    <Box
      display={{ base: selectedWorkspace ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
      color={"black"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
      >
        <Text fontSize={"1rem"}>My Workspaces</Text>
        <CreateWorkspaceModal>
          <Button
            display={"flex"}
            fontSize={{
              base: "17px",
              md: "10px",
              lg: "17px",
            }}
            rightIcon={<AddIcon />}
            colorScheme="yellow"
          >
            Workspace
          </Button>
        </CreateWorkspaceModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#f8f8f8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {workspaces ? (
          <Stack>
            {workspaces.map((workspace) => (
              <Box
                onClick={() => setSelectedWorkspace(workspace)}
                cursor={"pointer"}
                bg={selectedWorkspace === workspace ? "black" : "#e8e8e8"}
                color={selectedWorkspace === workspace ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={workspace._id}
              >
                <Text>{workspace.workspaceName}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <WorkspacesLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyWorkspaces;
