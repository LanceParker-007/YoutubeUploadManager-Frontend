import { createContext, useContext, useEffect, useState } from "react";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";

const WorkspaceContext = createContext();

// eslint-disable-next-line react/prop-types
const WorkspaceContextProvider = ({ children }) => {
  //state banate
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState();

  const handleLogin = (userServer) => {
    //Login to Youtube account vala section idhar copy karna padega
    // redirectUri = https://test-yum-backend.vercel.app/google/callback

    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = `${userServer}/google/callback`; //CLIENT_REDIRECT_URI_SERVER
    // console.log(redirectUri);
    const scopes = [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      // "https://www.googleapis.com/auth/youtube.force-ssl",
    ];

    const authorizationUrl = `https://accounts.google.com/o/oauth2/auth?${queryString.stringify(
      {
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scopes.join(" "),
        response_type: "code",
      }
    )}`;

    //--------------------------------------------------------
    window.location.href = authorizationUrl;
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // If user not logged in push it to "/"
    if (!userInfo) {
      return navigate("/");
    } else {
      setUser(userInfo);
      // return navigate("/workspace");
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
