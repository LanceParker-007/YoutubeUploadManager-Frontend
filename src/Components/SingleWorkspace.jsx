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
import WorkspacesLoading from "../Components/WorkspacesLoading";
import server from "../index.js";
import ConnectToServer from "./ConnectToServerComponents/ConnectToServer";

const SingleWorkspace = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedWorkspace, setSelectedWorkspace } =
    useWorkspaceContext();
  const [uploadToYtBtnloading, setUploadToYtBtnloading] = useState(false);
  const [loadingWorkspaceVideos, setLoadingWorkspaceVideos] = useState(false);
  const toast = useToast();
  const [displayVideos, setDisplayVideos] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  // -----
  const [userServer, setUserServer] = useState("");
  // -----

  const fetchAllVideoDetails = async () => {
    if (!selectedWorkspace) return;

    try {
      setLoadingWorkspaceVideos(true);
      const { data } = await axios.get(
        `${server}/api/workspace/allvideos/${selectedWorkspace._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setDisplayVideos(data.videos);
      setLoadingWorkspaceVideos(false);
    } catch (error) {
      toast({
        title: `Failed to fecth workspace videos`,
        status: error,
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoadingWorkspaceVideos(false);
    }
  };

  const uploadToYoutube = async (videoId) => {
    if (!userServer || userServer.length === 0) {
      toast({
        title: "Connect to a server first!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const selectedWorkspaceId = selectedWorkspace._id;
    try {
      setUploadToYtBtnloading(true);
      const { data } = await axios.post(
        `${server}/api/workspace/uploadvideotoyoutube`,
        {
          selectedWorkspaceId: selectedWorkspaceId,
          videoId: videoId,
          accessToken: accessToken,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchAllVideoDetails();
      setUploadToYtBtnloading(false);
      toast({
        title: `${data.message}`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      setUploadToYtBtnloading(false);
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

  const fetchYtAccessToken = async () => {
    try {
      const { data } = await axios.get(`${server}/getytaccesstoken`);
      setAccessToken(data.ytAccessToken);
    } catch (error) {
      toast({
        title: `Failed to fecth ytAccessToken:`,
        status: error,
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    fetchAllVideoDetails();
    fetchYtAccessToken();
    if (sessionStorage.getItem("userServer")) {
      setUserServer(sessionStorage.getItem("userServer"));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkspace, userServer]);

  return (
    <>
      {selectedWorkspace ? (
        <>
          <Heading
            fontSize={{ base: "28px", md: "30px" }}
            py={3}
            px={2}
            w="100%"
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
            color={"black"}
            mb={4}
            bg={"aliceblue"}
            borderRadius={6}
          >
            <IconButton
              colorScheme="blue"
              display={{ base: "flex" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedWorkspace("")}
            />
            <Text textAlign={"center"}>
              {selectedWorkspace.workspaceName.toUpperCase()}
            </Text>

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
          </Heading>
          {/* Make this (form)conatiner a modal */}
          <UploadVideoOnYUMModal fetchAllVideoDetails={fetchAllVideoDetails} />
          {/* All uploaded videos details */}
          <Divider height={"0.1rem"} bg={"red"} margin={4} />
          {/* Youtube Authorizrtion: Admin needs to sign in to youtube */}
          {!accessToken &&
            selectedWorkspace.workspaceAdmin._id === user._id && (
              <HStack
                width={"full"}
                border={"1px solid black"}
                height={"6rem"}
                p={2}
                justifyContent={"center"}
              >
                {userServer && (
                  <LoginWithGoogle setUserServer={setUserServer} />
                )}
                {!userServer && (
                  <ConnectToServer
                    userServer={userServer}
                    setUserServer={setUserServer}
                  />
                )}
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
            {loadingWorkspaceVideos ? (
              <WorkspacesLoading />
            ) : (
              <Box
                padding={2}
                bg={"blackAlpha.400"}
                borderRadius={"md"}
                overflowX={"auto"}
              >
                {selectedWorkspace &&
                  displayVideos.map((video) => (
                    // <Text color={"black"}>{video._id}</Text>
                    <VideoListCard
                      key={video._id}
                      video={video}
                      uploadToYoutube={uploadToYoutube}
                      accessToken={accessToken}
                      uploadToYtBtnloading={uploadToYtBtnloading}
                      userServer={userServer}
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
          <Text fontSize={"3xl"} pb={3} fontFamily={"fantasy"} color={"black"}>
            Click on a Workspace
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleWorkspace;
