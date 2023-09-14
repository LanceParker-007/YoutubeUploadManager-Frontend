import {
  Avatar,
  Box,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const SideDrawer = () => {
  const { user } = useWorkspaceContext();
  const navigate = useNavigate();

  //Logout Handler
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userServer");
    sessionStorage.removeItem("hashData");
    Cookies.remove("yt_access_token");
    return navigate("/homepage");
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
        bg={"blackAlpha.200"}
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        {/* 1st part */}
        <Heading fontSize={"2xl"} fontFamily={"fantasy"} letterSpacing={2}>
          YUM
        </Heading>
        {/* 2nd part */}
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={"2xl"} margin={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </>
  );
};

export default SideDrawer;
