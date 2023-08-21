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
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";

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
        "/api/user/login",
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
      console.log(error);
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

  return (
    <VStack spacing={"5px"}>
      <form
        onSubmit={(e) => submitHandler(e)}
        style={{ width: "100%", padding: "6px" }}
      >
        <FormControl id="loginEmail" isRequired>
          <FormLabel htmlFor="inputloginEmail">Email</FormLabel>
          <Input
            id="inputloginEmail"
            type="text"
            placeholder="Enter your email!"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            borderColor={"blackAlpha.600"}
          />
        </FormControl>
        <FormControl id="loginPassword" isRequired>
          <FormLabel htmlFor="inputLoginPassword">Password</FormLabel>
          <InputGroup>
            <Input
              id="inputLoginPassword"
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

        <Button
          isLoading={loading}
          my={4}
          type="submit"
          width={"100%"}
          colorScheme="yellow"
        >
          Login
        </Button>
      </form>
    </VStack>
  );
};

export default Login;
