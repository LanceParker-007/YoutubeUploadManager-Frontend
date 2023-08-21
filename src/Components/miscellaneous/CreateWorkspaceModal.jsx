import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import server from "../../index.js";

const GroupModalChat = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [workspaceName, setWorkspaceName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Append this new groupchat to the users chat list, so get chatState from ChatContextProvider
  const { user, workspaces, setWorkspaces } = useWorkspaceContext();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${server}/api/user/searchusers?search=${search}`,
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

  const handleSubmit = async () => {
    if (!workspaceName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${server}/api/workspace/createworkspace`,
        {
          workspaceName: workspaceName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)), //Since we cannot sent array
        },
        config
      );

      setWorkspaces([...workspaces, data]);
      onClose();
      toast({
        title: "New Group Chat Created",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setWorkspaceName("");
      setSelectedUsers([]);
      setSearchResult([]);
    } catch (error) {
      toast({
        title: "Failed to create group chat",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  //Add to selectedUsers list
  const handleGroup = (userToBeAdded) => {
    if (selectedUsers.includes(userToBeAdded)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToBeAdded]);
  };

  //Delete user from selectedUsers list
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  //Will be getting button(New Group) as chilren
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"body"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Workspace
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            {/* First form to create Group with respective name */}
            <FormControl>
              <Input
                placeholder="Workspace Name"
                mb={3}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </FormControl>
            {/* Second form to search users */}
            <FormControl>
              <Input
                placeholder="Search and add team members here"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* List of selected users which are selected from our search */}
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers &&
                selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
            </Box>
            {/* Rendering searched users*/}
            {loading ? (
              <Spinner />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModalChat;
