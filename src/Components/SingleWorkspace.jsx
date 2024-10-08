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
import Cookies from "js-cookie";

const SingleWorkspace = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedWorkspace,
    setSelectedWorkspace,
    accessToken,
    setAccessToken,
  } = useWorkspaceContext();
  const [uploadToYtBtnloading, setUploadToYtBtnloading] = useState(false);
  const [loadingWorkspaceVideos, setLoadingWorkspaceVideos] = useState(false);
  const toast = useToast();
  const [displayVideos, setDisplayVideos] = useState([]);

  // -----
  const [userServer, setUserServer] = useState("");
  // -----

  //Our server
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

  //Upload Video to YouTube function will also act on userServer
  const uploadToYoutube = async (videoId, videoUrl) => {
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
    // console.log(accessToken);
    try {
      setUploadToYtBtnloading(true);
      // Working serverless
      // const response = await axios.post(
      //   `https://9h0ejhqbgk.execute-api.ap-south-1.amazonaws.com/dev/api/youtubecontrol/uploadvideotoyoutube`,
      //   { accessToken, selectedWorkspaceId, videoId }
      // );

      // Working normal
      const response = await axios.post(
        `${server}/api/youtubecontrol/uploadvideotoyoutube`,
        {
          accessToken,
          selectedWorkspaceId,
          videoId,
        }
      );

      console.log(response);

      fetchAllVideoDetails();
      setUploadToYtBtnloading(false);
      toast({
        title: `${response.data.message}`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.log(error);
      setUploadToYtBtnloading(false);
      toast({
        title: "Video upload to Yt failed",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("userServer")) {
      setUserServer(sessionStorage.getItem("userServer"));
    }
    const yt_access_token_cookie = Cookies.get("yt_access_token");
    if (yt_access_token_cookie) {
      setAccessToken(yt_access_token_cookie);
    } else {
      setAccessToken(null);
    }
    fetchAllVideoDetails();
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
          <Divider height={"0.2rem"} bg={"blackalpha.200"} margin={4} />
          {/* Youtube Authorizrtion: Admin needs to sign in to youtube */}
          {(!accessToken || (accessToken && accessToken.length !== 0)) &&
            selectedWorkspace.workspaceAdmin._id === user._id && (
              <HStack
                width={"full"}
                border={"1px"}
                borderColor={"blackAlpha.200"}
                height={"6rem"}
                p={2}
                justifyContent={"center"}
              >
                {userServer && (
                  <LoginWithGoogle
                    setUserServer={setUserServer}
                    fetchAllVideoDetails={fetchAllVideoDetails}
                  />
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
          <HStack
            justifyContent={"center"}
            alignItems={"center"}
            // bg={"red"}
            width={"full"}
            py={2}
          >
            <Heading color={"black"} fontFamily={"body"} textAlign={"center"}>
              All Videos Details
            </Heading>
          </HStack>

          <Box width={"full"} overflowY={"auto"}>
            {loadingWorkspaceVideos ? (
              <WorkspacesLoading />
            ) : (
              <Box
                // padding={2}
                bg={"blackAlpha.100"}
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
