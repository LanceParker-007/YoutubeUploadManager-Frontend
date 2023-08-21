import React, { useEffect, useState } from "react";
import { useWorkspaceContext } from "../Context/WorkspaceProvider";
import {
  Heading,
  Box,
  Text,
  useToast,
  IconButton,
  Divider,
  HStack,
} from "@chakra-ui/react";
import "./styles.css";
import axios from "axios";
import VideoListCard from "./miscellaneous/VideoListCard";
import { ArrowBackIcon } from "@chakra-ui/icons";
import UpdateWorkspaceModal from "./miscellaneous/UpdateWorkspaceModal";
import UploadVideoOnYUMModal from "./miscellaneous/UploadVideoOnYUMModal";
import LoginWithGoogle from "./miscellaneous/LoginWithGoogle";
import server from "../index.js";

const SingleWorkspace = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedWorkspace, setSelectedWorkspace } =
    useWorkspaceContext();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [displayVideos, setDisplayVideos] = useState([]);

  const fetchAllVideoDetails = async () => {
    if (!selectedWorkspace) return;

    try {
      const { data } = await axios.get(
        `${server}/api/workspace/allvideos/${selectedWorkspace._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setDisplayVideos(data.videos);
    } catch (error) {
      toast({
        title: `Failed to fecth workspace videos`,
        status: error.message,
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const uploadToYoutube = async (videoId) => {
    const selectedWorkspaceId = selectedWorkspace._id;
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/api/workspace/uploadvideotoyoutube`,
        { selectedWorkspaceId, videoId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchAllVideoDetails();
      toast({
        title: `${data.message}`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Video upload to Yt failed",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    fetchAllVideoDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkspace]);

  return (
    <>
      {selectedWorkspace ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
            color={"black"}
          >
            <IconButton
              colorScheme="blue"
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedWorkspace("")}
            />
            {selectedWorkspace.workspaceName.toUpperCase()}
            {selectedWorkspace.workspaceAdmin._id === user._id ? (
              <>
                {/* Groupchat hai to uski settings dikha rahe */}

                <UpdateWorkspaceModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            ) : (
              <></>
            )}
          </Text>
          {/* Make this (form)conatiner a modal */}
          <UploadVideoOnYUMModal fetchAllVideoDetails={fetchAllVideoDetails} />
          {/* All uploaded videos details */}
          <Divider height={"0.1rem"} bg={"red"} margin={4} />
          {/* Youtube Authorizrtion: Admin needs to sign in to youtube */}
          {selectedWorkspace.workspaceAdmin._id === user._id && (
            <HStack
              width={"full"}
              border={"1px solid black"}
              height={"6rem"}
              p={2}
              justifyContent={"space-between"}
            >
              <LoginWithGoogle />

              <Text color={"red"}>
                Admin needs to login in with the Yt channel google channel
              </Text>
            </HStack>
          )}

          {/* All Videos Details */}
          <Box width={"full"} overflowY={"auto"}>
            <Heading
              color={"black"}
              fontFamily={"body"}
              textAlign={"center"}
              mb={4}
            >
              All Videos Details
            </Heading>
            {loading ? (
              <Heading color={"black"}>Loading...</Heading>
            ) : (
              <Box padding={2} bg={"blackAlpha.500"} borderRadius={"md"}>
                {selectedWorkspace &&
                  displayVideos.map((video) => (
                    // <Text color={"black"}>{video._id}</Text>
                    <VideoListCard
                      key={video._id}
                      video={video}
                      uploadToYoutube={uploadToYoutube}
                    />
                  ))}
              </Box>
            )}
          </Box>
        </>
      ) : (
        //-----------------
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
          w={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"cursive"} color={"black"}>
            Click on a Workspace
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleWorkspace;
