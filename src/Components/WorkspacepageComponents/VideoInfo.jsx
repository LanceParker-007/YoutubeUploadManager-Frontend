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
  Select,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";
import { FaYoutube } from "react-icons/fa";
import Cookies from "js-cookie";

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

// Youtube Categories
const categories = [
  { id: "1", name: "Film & Animation" },
  { id: "2", name: "Autos & Vehicles" },
  { id: "10", name: "Music" },
  { id: "15", name: "Pets & Animals" },
  { id: "17", name: "Sports" },
  { id: "19", name: "Travel & Events" },
  { id: "20", name: "Gaming" },
  { id: "22", name: "People & Blogs" },
  { id: "23", name: "Comedy" },
  { id: "24", name: "Entertainment" },
  { id: "25", name: "News & Politics" },
  { id: "26", name: "Howto & Style" },
  { id: "27", name: "Education" },
  { id: "28", name: "Science & Technology" },
  { id: "29", name: "Nonprofits & Activism" },
];

const VideoInfo = () => {
  const { user, handleLogin } = useWorkspaceContext();
  const userServerFromSession = sessionStorage.getItem("userServer");

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

  // const fetchYtAccessToken = async () => {
  //   if (!userServer || userServer.length === 0) {
  //     return;
  //   }
  //   try {
  //     // console.log(userServer);
  //     const { data } = await axios.get(`${userServer}/getytaccesstoken`);
  //     setAccessToken(data.ytAccessToken);
  //   } catch (error) {
  //     toast({
  //       title: `Failed to fecth ytAccessToken:`,
  //       status: error,
  //       duration: 4000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //   }
  // };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (sessionStorage.getItem("userServer")) {
      setUserServer(sessionStorage.getItem("userServer"));
    }
    // Fetch Token from userServer

    // fetchYtAccessToken();
    const yt_access_token_cookie = Cookies.get("yt_access_token");
    if (yt_access_token_cookie) setAccessToken(yt_access_token_cookie);
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
        setTags(data.videoInfo.tags ? data.videoInfo.tags.toString() : "");
        setThumbnailUrl(
          data.videoInfo.thumbnail?.url ? data.videoInfo.thumbnail?.url : ""
        );
        setYoutubeId(data.videoInfo.youtubeId ? data.videoInfo.youtubeId : "");
        setLoading(false);
      } catch (error) {
        // console.log(error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  //Save the thumbnail to db in workspaceController
  const saveThumbnail = async () => {
    // console.log("saveThumbnail");
    if (!thumbnail) {
      toast({
        title: "select a thumbnail",
        duration: 1000,
        position: "top",
        status: "warning",
      });
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
      // console.log(error);
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

  //Save changes in Workspace controller
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
      // console.log(error);
      setSaveChangesLoading(false);
      toast({
        title: "Error updating video info",
        status: "error",
        duration: "4000",
        position: "top",
      });
    }
  };

  //Push thumbnail to Youtube in YoutubeController
  const makeItYoutubeThumbnail = async () => {
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
    if (!youtubeId) {
      toast({
        title: "Upload Video to youtube first",
        status: "warning",
        duration: 2000,
        position: "top",
      });
      return;
    }
    try {
      //1. place in cloudinary
      if (!thumbnail) {
        toast({
          title: "select a thumbnail",
          duration: 1000,
          position: "top",
          status: "warning",
        });
        return;
      }

      const cloudinaryForm = new FormData();
      cloudinaryForm.append("file", thumbnail);
      cloudinaryForm.append("upload_preset", "yum-app");
      cloudinaryForm.append("cloud_name", "dk2fcl7bi");

      cloudinaryForm.append(
        "public_id",
        `ProjectS/${thumbnail.name}${new Date().getTime()}`
      );

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

      //2. save to db
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

      //3. upload to youtube
      // const response2 =
      await axios.post(
        `${userServer}/api/youtubecontrol/updatevideothumbnail/${workspaceId}/${videoId}`,
        { youtubeId, accessToken }
      );
      // console.log(response2.data);
      toast({
        title: "Thumbnail updated to Youtube",
        status: "success",
        position: "top",
        duration: 2000,
      });
      setThumbnailLoading(false);
    } catch (error) {
      setThumbnailLoading(false);
      // console.log(error.response.data.message);
      toast({
        title: "Error while updating thumbnail",
        status: "error",
        position: "top",
        duration: 2000,
      });
    }
  };

  //Push Changes to youtube
  const pushChanges = async () => {
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
    if (!youtubeId) {
      toast({
        title: "Upload Video to youtube first",
        status: "warning",
        duration: 2000,
        position: "top",
      });
      return;
    }
    const user = JSON.parse(localStorage.getItem("userInfo"));
    try {
      // 1. save changes in th db
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
        duration: "1000",
        position: "top",
      });

      // 2. push changes to youtube
      // const response =
      await axios.post(
        `${userServer}/api/youtubecontrol/pushchangestoyoutube/${workspaceId}/${videoId}`,
        { youtubeId, accessToken }
      );
      // console.log(response.data);
      toast({
        title: "Video info updated on Youtube!",
        status: "success",
        position: "top",
        duration: 2000,
      });

      setSaveChangesLoading(false);
    } catch (error) {
      console.log(error);
      setSaveChangesLoading(false);
      toast({
        title: "Video info updated on Youtube! Failed!",
        status: "error",
        position: "top",
        duration: 2000,
      });
    }
  };

  //Login to Youtueb
  const LoginToYoutube = () => {
    if (!userServerFromSession || userServerFromSession.length === 0) {
      toast({
        title: "Connect to a server first!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    handleLogin(userServerFromSession);
  };

  return loading ? (
    <Heading>Loading...</Heading>
  ) : (
    <Box p={{ base: "1", md: "5" }} bg={"blackAlpha.700"}>
      <Box
        display={"flex"}
        flexDirection={{ base: "column", md: "row" }}
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems={{ base: "center", md: "center" }}
        p={2}
        fontFamily={"monospace"}
      >
        <Heading fontFamily={"monospace"}>Video Info</Heading>
        <HStack>
          <Button
            isLoading={saveChangesLoading}
            colorScheme={"blue"}
            onClick={saveChanges}
            width={"7rem"}
          >
            Save
          </Button>

          {accessToken ? (
            <Button
              isLoading={saveChangesLoading}
              colorScheme={"blue"}
              onClick={pushChanges}
              width={"7rem"}
            >
              Push
            </Button>
          ) : (
            <Button
              colorScheme={"yellow"}
              onClick={LoginToYoutube}
              rightIcon={<FaYoutube size={"2rem"} color="red" />}
            >
              Login
            </Button>
          )}
        </HStack>
      </Box>
      <Box display={"flex"} flexDirection={{ base: "column", md: "row" }}>
        <VStack
          bg={"aliceblue"}
          p={2}
          borderRadius={6}
          width={{ base: "100%", md: "60%", lg: "40%" }}
          border={"1px"}
          borderColor={"blackAlpha.200"}
          fontFamily={"monospace"}
        >
          <video controls controlsList="nodownload">
            <source src={videoUrl} type="video/mp4" />
          </video>
          <FormControl
            my={2}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <FormLabel m={0}>Select Thumbail Below</FormLabel>
            <Input
              accept="image/*"
              type="file"
              focusBorderColor={"yellow.500"}
              css={fileUploadStyle}
              onChange={changeThumbnailHandler}
            />
          </FormControl>
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
                {accessToken ? (
                  <Button
                    isLoading={thumbnailLoading}
                    colorScheme="green"
                    onClick={makeItYoutubeThumbnail}
                  >
                    Push to Youtube
                  </Button>
                ) : (
                  <Button
                    colorScheme={"yellow"}
                    onClick={LoginToYoutube}
                    rightIcon={
                      <FaYoutube size={"2rem"} color="red" width={"4rem"} />
                    }
                  >
                    Login
                  </Button>
                )}
              </HStack>
            </>
          )}
        </VStack>
        <Box
          bg={"aliceblue"}
          width={{ base: "full", md: "70%" }}
          mx={"auto"}
          border={"1px"}
          borderColor={"blackAlpha.200"}
          borderRadius={6}
          fontFamily={"monospace"}
        >
          <FormControl
            borderRadius={6}
            my={1}
            border={"1px"}
            borderColor={"blackAlpha.200"}
            padding={2}
          >
            <FormLabel m={0}>Title</FormLabel>
            <Input
              bg={"white"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
              bg={"white"}
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
            <Select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
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
              bg={"white"}
              resize={"none"}
              onChange={(e) => {
                setTags(e.target.value.toString());
              }}
            />
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoInfo;
