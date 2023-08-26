import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import AboutProduct from "../Components/HomepageComponents/AboutProduct";
import Footer from "../Components/HomepageComponents/Footer";
import SigninForm from "../Components/HomepageComponents/SigninForm";

const HomePage = () => {
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        p={3}
        w={"100%"}
        mb={"2rem"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        bg={"aliceblue"}
      >
        <Heading fontSize={"2xl"} color={"black"} letterSpacing={1}>
          Youtube Upload Manager
        </Heading>
      </Box>
      {/* Signup or Signin form */}
      <SigninForm />
      {/* About Product */}
      <AboutProduct />
      {/* Footer */}
      <Footer />
    </>
  );
};

export default HomePage;
