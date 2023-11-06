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

// http://localhost:3000/ytsignin/callback#state=pass-through-value&access_token=ya29.a0AfB_byBdC-C77XRVCzqA1LaOAeY5WCR4V_Kp2A5g7kBzeXq1djq7YRAdqCJdp88Uv2Wquy18RoeHtXEHHvgfqVS8Xo5BKV-VTJp_xmv_A7I14Uwkf769hj538Rn4Ba6TWyVnXoMzAUJqTRr58dCNUs3RD7r5sfpfwgaCgYKAa0SARESFQGOcNnC_rAKHKSdopiPlnbzf_cxxA0169&token_type=Bearer&expires_in=3599&scope=email%20profile%20https://www.googleapis.com/auth/userinfo.email%20openid%20https://www.googleapis.com/auth/youtube.upload%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/youtube.force-ssl&authuser=0&prompt=consent
