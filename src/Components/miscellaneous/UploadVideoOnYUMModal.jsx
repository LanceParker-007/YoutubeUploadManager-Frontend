import {
  Button,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";
import server from "../../index.js";

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

  const uploadVideoToPlatform = async (e) => {
    e.preventDefault();
    // const file = e.target.files[0];
    // This we stored in out vide

    try {
      // 1. Get Secure url from server
      const response1 = await axios.post(`${server}/api/workspace/trial`, {
        videoName: video.name,
        videoType: video.type,
      });

      // 2. Post the video directly to the s3 bucket
      await axios.put(`${response1.data.signedURL}`, video, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progress) => {
          setVideoUploaded(
            Math.round((progress.loaded / progress.total) * 100)
          );
        },
      });

      const url = response1.data.signedURL.split("?")[0];
      const public_id = response1.data.public_id;
      // console.log(url);
      // console.log(public_id);

      // 3. Post req to my server to store any data
      const videoInfo = {
        title: title,
        video: {
          public_id: public_id,
          url: url,
        },
        status: false,
      };
      //save video to DB
      const response3 = await axios.post(
        `${server}/api/workspace/upload/${selectedWorkspace._id}`,
        videoInfo,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchAllVideoDetails();
      toast({
        title: `${response3.data.video.title} uploaded to ${selectedWorkspace.workspaceName}`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      onClose();
      setTitle("");
      setVideo("");
      setVideoPrev("");
      setVideoUploaded(0);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        status: "error",
        duration: 1000,
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
            <form onSubmit={uploadVideoToPlatform}>
              <VStack m={"auto"} spacing={4}>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  type="text"
                  focusBorderColor="purple.300"
                  isRequired
                />
                <Input
                  name="File name"
                  id="file"
                  accept="video/mp4"
                  isRequired
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
                    <CircularProgress value={videoUploaded} color="green.400">
                      <CircularProgressLabel>
                        {videoUploaded}%
                      </CircularProgressLabel>
                    </CircularProgress>
                  </>
                )}
                {/* Cloudinary Upload */}
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
