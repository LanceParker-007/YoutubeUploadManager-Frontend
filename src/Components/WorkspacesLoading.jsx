import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height={"45px"} colorScheme={"blackAlpha.200"}></Skeleton>
      <Skeleton height={"45px"} colorScheme={"blackAlpha.200"}></Skeleton>
      <Skeleton height={"45px"} colorScheme={"blackAlpha.200"}></Skeleton>
      <Skeleton height={"45px"} colorScheme={"blackAlpha.200"}></Skeleton>
      <Skeleton height={"45px"} colorScheme={"blackAlpha.200"}></Skeleton>
      <Skeleton height={"45px"} colorScheme={"blackAlpha.200"}></Skeleton>
    </Stack>
  );
};

export default ChatLoading;
