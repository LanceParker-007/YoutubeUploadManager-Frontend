import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";

// Login to Youtube Account------------------------
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_PROD_REDIRECT_URI;
const scopes = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

const authorizationUrl = `https://accounts.google.com/o/oauth2/auth?${queryString.stringify(
  {
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    response_type: "code",
  }
)}`;
//-----------------------------------------------

const WorkspaceContext = createContext();

// eslint-disable-next-line react/prop-types
const WorkspaceContextProvider = ({ children }) => {
  //state banate
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState();

  const handleLogin = () => {
    window.location.href = authorizationUrl;
  };

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
        handleLogin,
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
