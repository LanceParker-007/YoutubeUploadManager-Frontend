import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import server from "../..";
import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";

// Input File Style
const fileUploadCss = {
  cursor: "pointer",
  marginLeft: "-5%",
  width: "110%",
  border: "none",
  height: "100%",
  color: "#ECC94B",
  backgroundColor: "white",
};

const fileUploadStyle = {
  "&::file-selector-button": fileUploadCss,
};

const VideoInfo = () => {
  const { workspaceId, videoId } = useParams();
  const [loading, setLoading] = useState(false);
  const [saveChangesLoading, setSaveChangesLoading] = useState(false);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  //Video Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState();
  const [thumbnailPrev, setThumbnailPrev] = useState();
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [videoUrl, setVideoUrl] = useState();
  const [thumbnailUrl, setThumbnailUrl] = useState();
  const [youtubeId, setYoutubeId] = useState("");
  const [userServer, setUserServer] = useState("");
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (sessionStorage.getItem("userServer")) {
      setUserServer(sessionStorage.getItem("userServer"));
    }
    // Fetch Token from userServer
    const fetchYtAccessToken = async () => {
      if (!userServer || userServer.length === 0) {
        return;
      }
      try {
        // console.log(userServer);
        const { data } = await axios.get(`${userServer}/getytaccesstoken`);
        setAccessToken(data.ytAccessToken);
        console.log(accessToken);
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
    fetchYtAccessToken();
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${server}/api/workspace/${workspaceId}/${videoId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setVideoUrl(data.videoInfo.video.url);
        setTitle(data.videoInfo.title);
        setDescription(
          data.videoInfo.description ? data.videoInfo.description : ""
        );
        setCategory(data.videoInfo.category ? data.videoInfo.category : "");
        setTags(data.videoInfo.tags ? data.videoInfo.tags : "");
        setThumbnailUrl(
          data.videoInfo.thumbnail?.url ? data.videoInfo.thumbnail?.url : ""
        );
        setYoutubeId(data.videoInfo.youtubeId ? data.videoInfo.youtubeId : "");
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error fetching video",
          status: "error",
          duration: "4000",
          position: "top",
        });
        setLoading(false);
      }
    };
    fetchVideoDetails();
  }, [
    setAccessToken,
    navigate,
    toast,
    videoId,
    workspaceId,
    userServer,
    accessToken,
  ]);

  //Thumbnail change handler, to preview and setThumbnail
  const changeThumbnailHandler = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setThumbnailPrev(reader.result); //base64 String
      setThumbnail(file);
    };
  };

  //Save the thumbnail to db
  const saveThumbnail = async () => {
    console.log("saveThumbnail");
    if (!thumbnail) {
      return;
    }
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", thumbnail);
    cloudinaryForm.append("upload_preset", "yum-app");
    cloudinaryForm.append("cloud_name", "dk2fcl7bi");

    cloudinaryForm.append(
      "public_id",
      `ProjectS/${thumbnail.name}${new Date().getTime()}`
    );

    try {
      setThumbnailLoading(true);
      //Upload thumbnail to cloudinary
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dk2fcl7bi/image/upload",
        cloudinaryForm
      );

      //get necessary video details
      const thumbnailInfo = {
        public_id: data.public_id,
        url: data.secure_url,
      };
      //save thumbnail to DB
      const response = await axios.put(
        `${server}/api/workspace/updatethumbnail/${workspaceId}/${videoId}`,
        thumbnailInfo,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: `${response.data.message}`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setThumbnailLoading(false);
    } catch (error) {
      console.log(error);
      setThumbnailLoading(false);
      toast({
        title: "Thumbnail update failed",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  //Save changes
  const saveChanges = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("userInfo"));
    try {
      setSaveChangesLoading(true);
      const { data } = await axios.put(
        `${server}/api/workspace/${workspaceId}/${videoId}`,
        {
          title,
          description,
          category,
          tags,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast({
        title: `${data.message}`,
        status: "success",
        duration: "4000",
        position: "top",
      });
      setSaveChangesLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error updating video info",
        status: "error",
        duration: "4000",
        position: "top",
      });
    }
  };

  //Make it Youtube thumbnail
  const makeItYoutubeThumbnail = async () => {
    if (!youtubeId) {
      toast({
        title: "Upload to youtube first",
        status: "warning",
        duration: 2000,
        position: "top",
      });
      return;
    }
    try {
      //replace in cloudinary
      //save to db
      //upload to youtube
      const response2 = await axios.post(
        `${server}/api/youtubecontrol/updatevideothumbnail/${workspaceId}/${videoId}`,
        { youtubeId, accessToken }
      );
      console.log(response2.data);
      toast({
        title: "Thumbnail updated",
        status: "success",
        position: "top",
        duration: 2000,
      });
    } catch (error) {
      console.log(error.response.data.message);
      toast({
        title: "Error while updating thumbnail",
        status: "error",
        position: "top",
        duration: 2000,
      });
    }
  };

  //Push Changes to youtube
  const pushChanges = () => {
    try {
    } catch (error) {}
  };

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <Box p={{ base: "1", md: "5" }}>
      <HStack justifyContent={"space-between"} p={2}>
        <Heading>Video details</Heading>
        <div>
          <Button
            isLoading={saveChangesLoading}
            colorScheme={"blue"}
            onClick={saveChanges}
          >
            Save
          </Button>
          <Button
            isLoading={saveChangesLoading}
            colorScheme={"blue"}
            // onClick={pushChanges}
          >
            Push
          </Button>
        </div>
      </HStack>
      <Box display={"flex"} flexDirection={{ base: "column", md: "row" }}>
        <VStack bg={"aliceblue"} p={2} borderRadius={6}>
          <video controls controlsList="nodownload">
            <source src={videoUrl} type="video/mp4" />
          </video>
          <Input
            accept="image/*"
            type="file"
            focusBorderColor={"yellow.500"}
            css={fileUploadStyle}
            onChange={changeThumbnailHandler}
          />
          {(thumbnailPrev || thumbnailUrl) && (
            <>
              <img src={thumbnailPrev || thumbnailUrl} alt="thumbnail" />
              <HStack>
                <Button
                  onClick={saveThumbnail}
                  isLoading={thumbnailLoading}
                  colorScheme="blue"
                >
                  Save Thumbnail
                </Button>
                <Button
                  isLoading={thumbnailLoading}
                  colorScheme="green"
                  onClick={makeItYoutubeThumbnail}
                >
                  Push to Youtube
                </Button>
              </HStack>
            </>
          )}
        </VStack>
        <Box width={{ base: "full", md: "70%" }} mx={"auto"}>
          <FormControl
            borderRadius={6}
            my={1}
            border={"1px"}
            borderColor={"blackAlpha.200"}
            padding={2}
          >
            <FormLabel m={0}>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl
            borderRadius={6}
            my={1}
            border={"1px"}
            borderColor={"blackAlpha.200"}
            padding={2}
          >
            <FormLabel m={0}>Description</FormLabel>
            <Textarea
              value={description}
              rows={10}
              resize={"none"}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl
            borderRadius={6}
            my={1}
            border={"1px"}
            borderColor={"blackAlpha.200"}
            padding={2}
          >
            <FormLabel m={0}>Category</FormLabel>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </FormControl>
          <FormControl
            borderRadius={6}
            my={1}
            border={"1px"}
            borderColor={"blackAlpha.200"}
            padding={2}
          >
            <FormLabel m={0}>Tags</FormLabel>
            <Textarea
              rows={10}
              value={tags}
              resize={"none"}
              onChange={(e) => {
                setTags(e.target.value);
              }}
            />
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoInfo;
