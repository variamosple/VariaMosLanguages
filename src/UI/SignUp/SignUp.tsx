import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleLogin } from "react-google-login";
import VariaMosLogo from "../../Addons/images/VariaMosLogo.png";
import _config from "../../Infraestructure/config.json";
import "./SignUp.css";
import {
  CLIENT_ID,
  SignUpKeys,
  SignUpMessages,
  SignUpURLs,
  SignUpUserTypes,
} from "./SignUp.constants";
import { gapi } from "gapi-script";

function SignInUp() {
  const [loginProgress, setLoginProgress] = useState(SignUpMessages.Welcome);
  const [hasErrors, setErrors] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = !!sessionStorage.getItem(
      SignUpKeys.CurrentUserProfile
    );
    if (isUserLoggedIn) {
      window.location.href = SignUpURLs.HomePage;
    }

    function start() {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: "email",
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const signUpAsAGuestHandler = () => {
    const guestProfile = {
      email: null,
      givenName: "Guest",
      userType: SignUpUserTypes.Guest,
    };
    sessionStorage.setItem(
      SignUpKeys.CurrentUserProfile,
      JSON.stringify(guestProfile)
    );
    window.location.href = SignUpURLs.HomePage;
  };

  const onSuccess = (response) => {
    const userProfile = {
      ...response.profileObj,
      userType: SignUpUserTypes.Registered,
    };
    sessionStorage.setItem(
      SignUpKeys.CurrentUserProfile,
      JSON.stringify(userProfile)
    );

    setLoginProgress(SignUpMessages.Loading);

    axios
      .post(`${_config.urlBackEndLanguage}${SignUpURLs.SignIn}`, {
        email: userProfile.email,
        name: userProfile.givenName,
      })
      .then(({ data: responseData }) => {
        const { data } = responseData;
        sessionStorage.setItem(
          SignUpKeys.DataBaseUserProfile,
          JSON.stringify(data)
        );

        if (response && response.accessToken) {
          window.location.href = SignUpURLs.HomePage;
        }
      })
      .catch((e) => {
        setErrors(true);
        setLoginProgress(SignUpMessages.LoginError);
      });
  };

  const onFailure = (response) => {
    console.log("FAILED", response);
  };

  return (
    <div className="signup">
      <div className="signup__container shadow-sm rounded">
        <img
          src={VariaMosLogo}
          alt=""
          className="img-fluid"
          width="191"
          height="39"
        />
        <h3
          className={`signup__title text-center ${
            hasErrors ? `signup__error` : `projectName`
          } p-2`}
        >
          {loginProgress}
        </h3>
        <div>
          <GoogleLogin
            clientId={CLIENT_ID}
            onSuccess={onSuccess}
            onFailure={onFailure}
          />
        </div>
        <div className="signup__guest">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            href="#"
            onClick={signUpAsAGuestHandler}
            className="signup__guest-link"
          >
            {SignUpMessages.ContinueAsGuest}
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignInUp;
