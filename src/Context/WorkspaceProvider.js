import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WorkspaceContext = createContext();

// eslint-disable-next-line react/prop-types
const WorkspaceContextProvider = ({ children }) => {
  //state banate
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // If user not logged in push it to "/"
    if (!userInfo) {
      return navigate("/");
    } else {
      setUser(userInfo);
      return navigate("/workspaces");
    }
  }, [navigate]);

  return (
    <WorkspaceContext.Provider
      value={{
        //state pass kar dete
        user,
        setUser,
        workspaces,
        setWorkspaces,
        selectedWorkspace,
        setSelectedWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

const useWorkspaceContext = () => {
  return useContext(WorkspaceContext);
};

export { WorkspaceContextProvider, useWorkspaceContext };
