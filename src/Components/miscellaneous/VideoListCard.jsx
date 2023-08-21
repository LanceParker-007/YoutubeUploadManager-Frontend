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
import React from "react";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";

const VideoListCard = ({ video, uploadToYoutube }) => {
  const { user, selectedWorkspace } = useWorkspaceContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <HStack
        bg={"black"}
        color={"whitesmoke"}
        justifyContent={"space-between"}
        p={2}
        borderRadius={"0.6rem"}
        mb={1}
      >
        <Text>{video.title}</Text>
        <Text onClick={onOpen} cursor={"pointer"} color={"red"}>
          Watch Video
        </Text>
        {selectedWorkspace.workspaceAdmin._id === user._id &&
          (video.status ? (
            <Button colorScheme={"whatsapp"} cursor={"not-allowed"}>
              Uploaded to Youtube
            </Button>
          ) : (
            <Button
              colorScheme={"yellow"}
              onClick={() => uploadToYoutube(video._id)}
            >
              Upload to Youtube
            </Button>
          ))}
        {selectedWorkspace.workspaceAdmin._id !== user._id &&
          (video.status ? (
            <Button colorScheme={"whatsapp"} cursor={"not-allowed"}>
              Uploaded to Youtube
            </Button>
          ) : (
            <Button colorScheme={"red"} cursor={"not-allowed"}>
              Action Needed
            </Button>
          ))}
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
