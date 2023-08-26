import {
  Button,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";
// import Cookies from "js-cookie";
import { FaYoutube } from "react-icons/fa";

const VideoListCard = ({
  video,
  uploadToYoutube,
  accessToken,
  uploadToYtBtnloading,
}) => {
  const { user, selectedWorkspace, handleLogin } = useWorkspaceContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const accessToken = Cookies.get("accessToken");
  const [videoTitle, setVideoTitle] = useState(video.title);

  useEffect(() => {
    let isLargeScreen = window.innerWidth >= 500;
    if (!isLargeScreen) {
      setVideoTitle(videoTitle.substring(0, 6) + "...");
    }
  }, [videoTitle]);

  return (
    <>
      <HStack
        bg={"blackAlpha.900"}
        color={"whitesmoke"}
        justifyContent={"space-between"}
        p={2}
        borderRadius={"0.6rem"}
        mb={2}
        width={"full"}
        // overflowX={"auto"}
      >
        <div style={{ textAlign: "left", width: "32%" }}>
          <Text>{videoTitle}</Text>
        </div>
        <div style={{ textAlign: "left", width: "18%" }}>
          <Text onClick={onOpen} cursor={"pointer"} color={"red"}>
            Watch Video
          </Text>
        </div>

        <div style={{ textAlign: "right", width: "50%" }}>
          {/* For admin */}
          {selectedWorkspace.workspaceAdmin._id === user._id && accessToken ? (
            video.status ? (
              <Button
                isLoading={uploadToYtBtnloading}
                colorScheme={"whatsapp"}
                cursor={"not-allowed"}
                rightIcon={<FaYoutube size={"2rem"} />}
              >
                Uploaded to
              </Button>
            ) : (
              <Button
                isLoading={uploadToYtBtnloading}
                colorScheme={"yellow"}
                onClick={() => uploadToYoutube(video._id)}
                rightIcon={<FaYoutube size={"2rem"} color="red" />}
              >
                Upload to
              </Button>
            )
          ) : (
            selectedWorkspace.workspaceAdmin._id === user._id && (
              <Button
                isLoading={uploadToYtBtnloading}
                colorScheme={"yellow"}
                onClick={handleLogin}
                rightIcon={<FaYoutube size={"2rem"} color="red" />}
              >
                Login to
              </Button>
            )
          )}
          {/* For team members */}
          {selectedWorkspace.workspaceAdmin._id !== user._id &&
            (video.status ? (
              <Button
                isLoading={uploadToYtBtnloading}
                colorScheme={"whatsapp"}
                cursor={"not-allowed"}
                rightIcon={<FaYoutube size={"2rem"} />}
              >
                Uploaded to
              </Button>
            ) : (
              <Button
                isLoading={uploadToYtBtnloading}
                colorScheme={"red"}
                cursor={"not-allowed"}
              >
                Action Needed
              </Button>
            ))}
        </div>
      </HStack>
      {/* Modal to watch video  */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"40px"}
            display={"flex"}
            justifyContent={"center"}
          >
            <Heading fontFamily={"body"}>{video.title}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <video controls controlsList="nodownload">
              <source src={video.video.url} type="video/mp4" />
            </video>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VideoListCard;
