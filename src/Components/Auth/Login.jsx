import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";
import server from "../../index";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useWorkspaceContext();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Please fill all the required fields",
        status: "warning",
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
        `${server}/api/user/login`,
        { email, password },
        config
      );

      toast({
        title: "Login successful 👍",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      //Saving user in local storage
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/workspaces");
    } catch (error) {
      // console.log(error);
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    let userLoginDetail = Cookies.get("userLoginDetail");
    if (userLoginDetail) {
      userLoginDetail = userLoginDetail.substring(2);
      userLoginDetail = JSON.parse(userLoginDetail);
      setLoading(false);
      setUser(userLoginDetail);
      localStorage.setItem("userInfo", JSON.stringify(userLoginDetail));
      navigate("/workspaces");
    }
    setLoading(false);
  }, [navigate, setUser]);

  return (
    <VStack spacing={"5px"}>
      <form
        onSubmit={(e) => submitHandler(e)}
        style={{ width: "100%", padding: "6px" }}
      >
        <FormControl id="loginEmail" isRequired>
          <FormLabel htmlFor="inputloginEmail" mb={0}>
            Email
          </FormLabel>
          <Input
            id="inputloginEmail"
            type="text"
            placeholder="Enter your email!"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            borderColor={"blackAlpha.600"}
            autoComplete="true"
          />
        </FormControl>
        <FormControl id="loginPassword" isRequired mt={2}>
          <FormLabel htmlFor="inputLoginPassword" mb={0}>
            Password
          </FormLabel>
          <InputGroup>
            <Input
              id="inputLoginPassword"
              type={show ? "text" : "password"}
              placeholder="Enter your password!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              borderColor={"blackAlpha.600"}
              autoComplete="true"
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

        <Button
          isLoading={loading}
          mt={4}
          type="submit"
          width={"100%"}
          colorScheme="yellow"
        >
          Login
        </Button>
      </form>
      <Text fontFamily={"fantasy"} my={4}>
        OR
      </Text>
      {/* ------Google Sign in Button----------- */}
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const credentialResponseDecoded = jwt_decode(
            credentialResponse.credential
          );
          const name = credentialResponseDecoded.name;
          const email = credentialResponseDecoded.email;
          const pic = credentialResponseDecoded.picture;
          try {
            setLoading(true);
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };

            const { data } = await axios.post(
              `${server}/api/user/signinwithgoogle`,
              { name, email, pic },
              config
            );

            toast({
              title: "Login successful 👍",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            //Saving user in local storage
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/workspaces");
          } catch (error) {
            // console.log(error);
            toast({
              title: `${error.response.data.message}`,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            setLoading(false);
          }
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      ;{/* -------------------------------------- */}
      {/* <Button
        leftIcon={<FaGoogle />}
        colorScheme="red"
        width={"97%"}
        onClick={loginWithGoogle}
      >
        {" "}
        Sign in with Google
      </Button> */}
    </VStack>
  );
};

export default Login;
