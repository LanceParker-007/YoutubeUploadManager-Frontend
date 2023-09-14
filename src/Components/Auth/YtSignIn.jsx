import Cookies from "js-cookie";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

      // Store the hashObject in sessionStorage
      sessionStorage.setItem("hashData", JSON.stringify(hashObject));
      Cookies.set("yt_access_token", hashObject["access_token"], {
        expires: 3600,
      });

      navigate("/workspace");
    };

    // Call the function to store the hash data in sessionStorage
    storeHashFragmentInSessionStorage();

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <h1>Loading..</h1>;
  }
  return <h1>Sign in failed</h1>;
};

export default YtSignIn;

// http://localhost:3000/ytsignin/callback#state=pass-through-value&access_token=ya29.a0AfB_byBdC-C77XRVCzqA1LaOAeY5WCR4V_Kp2A5g7kBzeXq1djq7YRAdqCJdp88Uv2Wquy18RoeHtXEHHvgfqVS8Xo5BKV-VTJp_xmv_A7I14Uwkf769hj538Rn4Ba6TWyVnXoMzAUJqTRr58dCNUs3RD7r5sfpfwgaCgYKAa0SARESFQGOcNnC_rAKHKSdopiPlnbzf_cxxA0169&token_type=Bearer&expires_in=3599&scope=email%20profile%20https://www.googleapis.com/auth/userinfo.email%20openid%20https://www.googleapis.com/auth/youtube.upload%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/youtube.force-ssl&authuser=0&prompt=consent
