import SideDrawer from "../Components/miscellaneous/SideDrawer";
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import WorkspaceLayout from "../Components/WorkspacepageComponents/WorkspaceLayout";
import VideoInfo from "../Components/WorkspacepageComponents/VideoInfo";
import { useWorkspaceContext } from "../Context/WorkspaceProvider";

const ChatPage = () => {
  const { user, setUser } = useWorkspaceContext();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // If user not logged in push it to "/"
    if (!userInfo) {
      return navigate("/");
    } else {
      setUser(userInfo);
    }
  }, [navigate, setUser]);

  return (
    <div style={{ width: "100%" }}>
      {/* Pehle user load hone do phir vo component */}
      {user && <SideDrawer />}
      <Routes>
        <Route path="/" element={<WorkspaceLayout />} />
        <Route path="/:workspaceId/:videoId" element={<VideoInfo />} />
      </Routes>
    </div>
  );
};

export default ChatPage;
