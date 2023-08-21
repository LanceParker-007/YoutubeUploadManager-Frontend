import {
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";

const fileUploadCss = {
  cursor: "pointer",
  marginLeft: "-5%",
  width: "110%",
  border: "none",
  height: "100%",
  color: "#ECC94B",
  backgroundColor: "white",
};

const UploadVideoOnYUMModal = ({ fetchAllVideoDetails }) => {
  const { user, selectedWorkspace } = useWorkspaceContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState();
  const [videoPrev, setVideoPrev] = useState();
  const [loading, setLoading] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(0);
  const toast = useToast();

  const changeVideoHandler = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVideoPrev(reader.result); //base64 String
      setVideo(file);
    };
  };

  const uploadVideoOnYUM = async (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      setLoading(true);
      const { data } = await axios.post(
        `/api/workspace/upload/${selectedWorkspace._id}`,
        myForm,
        {
          onUploadProgress: (progress) => {
            setVideoUploaded(
              Math.round((progress.loaded / progress.total) * 100)
            );
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchAllVideoDetails();
      toast({
        title: `${data.video.title} uploaded to ${selectedWorkspace.workspaceName}`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      onClose();
      setTitle("");
      setDescription("");
      setVideo("");
      setVideoPrev("");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Video upload failed",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Tooltip
        label={`Click here to upload video on YUM`}
        hasArrow
        placement="top"
      >
        <Button variant={"solid"} colorScheme={"blue"} onClick={onOpen}>
          Upload Video
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"40px"}
            display={"flex"}
            justifyContent={"center"}
          >
            <Heading fontFamily={"body"}>Video Info</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            {/* -----Form----- */}
            <form onSubmit={uploadVideoOnYUM}>
              <VStack m={"auto"} spacing={8}>
                <Input
                  id="title"
                  borderColor={"black"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  type="text"
                  focusBorderColor="purple.300"
                />
                <Input
                  id="description"
                  borderColor={"black"}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  type="text"
                  focusBorderColor="purple.300"
                />
                <Input
                  id="file"
                  borderColor={"blackAlpha.600"}
                  accept="video/mp4"
                  required
                  type="file"
                  focusBorderColor="purple.300"
                  css={{
                    "&::file-selector-button": {
                      ...fileUploadCss,
                      color: "purple",
                    },
                  }}
                  onChange={changeVideoHandler}
                />
                {videoPrev && (
                  <>
                    <video
                      controlsList="nodownload"
                      controls
                      src={videoPrev}
                    ></video>
                  </>
                )}
                <Progress my={1} value={videoUploaded} size={"lg"} />
                <Button
                  isLoading={loading}
                  w={"full"}
                  colorScheme="purple"
                  type="submit"
                >
                  Upload
                </Button>
              </VStack>
            </form>
            {/* ---------- */}
          </ModalBody>
          <ModalFooter height={"6rem"}>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadVideoOnYUMModal;
