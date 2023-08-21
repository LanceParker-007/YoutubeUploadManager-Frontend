import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";
import { useState } from "react";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [workspaceName, setWorkspaceName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);
  const toast = useToast();

  const { user, selectedWorkspace, setSelectedWorkspace } =
    useWorkspaceContext();

  //Add user
  const handleAddUser = async (user1) => {
    if (selectedWorkspace.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    // If loggedIn user is not groupAdmin then
    if (selectedWorkspace.workspaceAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/workspace/addusertoworkspace`,
        {
          workspaceId: selectedWorkspace._id,
          userToBeAddedId: user1._id,
        },
        config
      );

      setSelectedWorkspace(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error ocurred!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  //Remove user
  const handleRemove = async (user1) => {
    if (
      selectedWorkspace.workspaceAdmin._id !== user._id &&
      user1._id !== user._id
    ) {
      toast({
        title: "Only admins are allowed!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/workspace/removeuserfromworkspace`,
        {
          workspaceId: selectedWorkspace._id,
          userToBeRemovedId: user1._id,
        },
        config
      );

      // if the user himself have left the group
      user1._id === user._id
        ? setSelectedWorkspace()
        : setSelectedWorkspace(data);

      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error ocurred!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  //Rename group name
  const handleRename = async () => {
    if (!workspaceName) return;

    try {
      setRenameloading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `api/workspace/renameworkspace`,
        {
          workspaceId: selectedWorkspace._id,
          workspaceName: workspaceName,
        },
        config
      );

      toast({
        title: "Workspace name updated",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setSelectedWorkspace(data);
      setFetchAgain(!fetchAgain);
      setRenameloading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setRenameloading(false);
    }

    setWorkspaceName("");
  };

  //Search user to add
  const handleSearch = async (query) => {
    if (!query || query.length === 0) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `api/user/searchusers?search=${query}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error ocurred while searching for user",
        status: "error",
        position: "top-left",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
        colorScheme="yellow"
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"body"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedWorkspace.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedWorkspace.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Group name"
                mb={3}
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add new user"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* Searching Users */}
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Workspace
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
