import Cookies from "js-cookie";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AES from "crypto-js/aes";

const secretKey = "secretKey"; // Replace with your actual key, stored securely

const encryptToken = (token) => {
  return AES.encrypt(token, secretKey).toString();
};

const YtSignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Get the URL hash fragment
    const hashFragment = window.location.hash;

    // Function to parse the hash fragment and store it in sessionStorage
    const storeHashFragmentInSessionStorage = () => {
      const hashParams = new URLSearchParams(hashFragment.substring(1)); // Remove the '#' character
      const hashObject = {};

      // Loop through the hash parameters and store them in the object
      for (const [key, value] of hashParams.entries()) {
        hashObject[key] = value;
      }

      // Encrypt the token before storing it
      const encryptedToken = encryptToken(hashObject["access_token"]);
      sessionStorage.setItem(
        "hashData",
        JSON.stringify({ ...hashObject, access_token: encryptedToken })
      );
      const expiryTime = 1 / 24; // Token expires in 1 hour
      //Store the token in cookies
      Cookies.set("yt_access_token", encryptedToken, { expires: expiryTime });

      navigate("/workspace");
    };

    // Call the function to store the hash data in sessionStorage
    storeHashFragmentInSessionStorage();

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <h1>Signing in to your YouTube account..</h1>;
  }
  return <h1>Sign in failed</h1>;
};

export default YtSignIn;
