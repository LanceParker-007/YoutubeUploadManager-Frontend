import { DeleteIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={2}
      variant={"solid"}
      fontSize={"1rem"}
      backgroundColor={"purple.400"}
      color={"white"}
    >
      {user.name}
      <DeleteIcon
        m={1}
        fontSize={"2xl"}
        p={1}
        onClick={handleFunction}
        cursor={"pointer"}
        _hover={{ color: "black" }}
      />
    </Box>
  );
};

export default UserBadgeItem;
