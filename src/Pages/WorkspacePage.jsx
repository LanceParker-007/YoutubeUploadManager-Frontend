import { useWorkspaceContext } from "../Context/WorkspaceProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyWorkspaces from "../Components/MyWorkspaces";
import WorkspaceBox from "../Components/WorkspaceBox";
import { useState } from "react";

const ChatPage = () => {
  const { user } = useWorkspaceContext();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {/* Pehle user load hone do phir vo component */}
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        minHeight={"91.5vh"}
        p={"10px"}
      >
        {user && <MyWorkspaces fetchAgain={fetchAgain} />}
        {user && (
          <WorkspaceBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
