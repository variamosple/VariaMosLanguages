import axios from "axios";
import { gapi } from "gapi-script";
import { useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import VariaMosLogo from "../../Addons/images/VariaMosLogo.png";
import _config from "../../Infraestructure/config.json";
import {
  CREATE_LANGUAGES_PERMISSION_ID,
  CREATE_PRODUCT_LINES_PERMISSION_ID,
} from "../../core/components/Layout/Layout.constants";
import {
  CLIENT_ID,
  SignUpKeys,
  SignUpMessages,
  SignUpURLs,
  SignUpUserTypes,
} from "./SignUp.constants";
import "./SignUp.css";

interface SignInUpProps {
  disableLogin?: boolean;
}

function SignInUp(props: SignInUpProps) {
  const { disableLogin } = props;
  const [loginProgress, setLoginProgress] = useState(SignUpMessages.Welcome);
  const [hasErrors, setErrors] = useState(false);

  useEffect(() => {
    if (disableLogin) {
      sessionStorage.setItem(
        SignUpKeys.CurrentUserProfile,
        JSON.stringify({
          email: 'dummyuser@variamos.com',
          userType: SignUpUserTypes.Registered,
        })
      );

      sessionStorage.setItem(
        SignUpKeys.DataBaseUserProfile,
        JSON.stringify({
          user: {
            id: "0",
            name: "Local user",
          },
          permissions: [
            { id: CREATE_LANGUAGES_PERMISSION_ID, name: "Create languages" },
            {
              id: CREATE_PRODUCT_LINES_PERMISSION_ID,
              name: "Create product lines",
            },
          ],
        })
      );

      setLoginProgress(SignUpMessages.Loading);
    }
  }, [disableLogin]);

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
      .post(`${process.env.REACT_APP_URLBACKENDLANGUAGE || _config.urlBackEndLanguage}${SignUpURLs.SignIn}`, {
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
