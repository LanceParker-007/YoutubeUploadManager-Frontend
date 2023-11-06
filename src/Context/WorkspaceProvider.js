import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const publicRoutes = [
  "/privacy-policy", // Add other public routes as needed
  // ... other public route paths
];

const WorkspaceContext = createContext();

// eslint-disable-next-line react/prop-types
const WorkspaceContextProvider = ({ children }) => {
  //state banate
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState();
  const [accessToken, setAccessToken] = useState(null);

  const handleLogin = () => {
    console.log("yo here");
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    let form = document.createElement("form");
    form.setAttribute("method", "GET");
    form.setAttribute("action", oauth2Endpoint);

    let params = {
      client_id: process.env.REACT_APP_CLIENT_ID,
      redirect_uri: process.env.REACT_APP_DEV_REDIRECT_URI,
      response_type: "token",
      scope: [
        "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
      ],
      include_granted_scopes: "true",
      state: "pass-through-value",
    };

    for (let p in params) {
      let input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const currentPath = window.location.pathname; // Get the current route path

    // Check if the current path is one of the public routes
    const isPublicRoute = publicRoutes.includes(currentPath);

    // If user not logged in and it's not a public route, push to "/"
    if (!userInfo || !isPublicRoute) {
      navigate("/");
    } else {
      setUser(userInfo);
      const yt_access_token_cookie = Cookies.get("yt_access_token");
      if (yt_access_token_cookie) {
        setAccessToken(yt_access_token_cookie);
      }
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
        accessToken,
        setAccessToken,
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
