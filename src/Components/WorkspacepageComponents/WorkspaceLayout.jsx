import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import MyWorkspaces from "../MyWorkspaces";
import WorkspaceBox from "../WorkspaceBox";
import { useWorkspaceContext } from "../../Context/WorkspaceProvider";

const WorkspaceLayout = () => {
  const { user } = useWorkspaceContext();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
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
  );
};

export default WorkspaceLayout;
