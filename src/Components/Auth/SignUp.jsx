import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "everybody-chat-app");
      data.append("cloud_name", "dk2fcl7bi");
      fetch("https://api.cloudinary.com/v1_1/dk2fcl7bi/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Only JPEG and PNG images are supported",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password) {
      toast({
        title: "Please fill all the required fields ⚠",
        status: "warning ",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/register",
        { name, email, password, pic },
        config
      );

      toast({
        title: "Registration successful 👍",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      console.log(data);
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error occured 🌋",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={"5px"}>
      <form
        onSubmit={(e) => submitHandler(e)}
        style={{ width: "100%", padding: "6px" }}
      >
        <FormControl id="signupName" isRequired>
          <FormLabel htmlFor="inputSignupName">Name</FormLabel>
          <Input
            id="inputSignupName"
            type="text"
            placeholder="Enter your name!"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            borderColor={"blackAlpha.600"}
          />
        </FormControl>
        <FormControl id="signupEmail" isRequired>
          <FormLabel htmlFor="inputSignupEmail">Email</FormLabel>
          <Input
            id="inputSignupEmail"
            type="text"
            placeholder="Enter your email!"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            borderColor={"blackAlpha.600"}
          />
        </FormControl>
        <FormControl id="signupPassword" isRequired>
          <FormLabel htmlFor="inputSignupPassword">Password</FormLabel>
          <InputGroup>
            <Input
              id="inputSignupPassword"
              type={show ? "text" : "password"}
              placeholder="Enter your password!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              borderColor={"blackAlpha.600"}
            />
            <InputRightElement width={"4.5rem"} backgroundColor={"green.400"}>
              <Button
                color={"blackAlpha.900"}
                h={"1.75rem"}
                size={"sm"}
                onClick={() => setShow(!show)}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="signupPicture" isRequired>
          <FormLabel htmlFor="picture">Upload your picture</FormLabel>
          <Input
            id="picture"
            type="file"
            p={1.5}
            accept="image/*"
            placeholder="Enter your picture"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>
        <Button
          isLoading={loading}
          my={4}
          type="submit"
          size={"lg"}
          colorScheme="yellow"
        >
          Sign Up
        </Button>
      </form>
    </VStack>
  );
};

export default SignUp;
