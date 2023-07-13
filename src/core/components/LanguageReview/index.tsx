import React, { useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { People, PersonGear } from "react-bootstrap-icons";
import AutocompleteUserSearch from "./AutocompleteUserSearch";
import axios from "axios";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import {
  getDataBaseUserProfile,
  getUserProfile,
} from "../../../UI/SignUp/SignUp.utils";
import { UserTypes } from "../../../UI/SignUp/SignUp.constants";
import { Review, ReviewUser } from "./index.types";

export default function LanguageReview({ language }: { language: Language }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [enableReviewButton, setEnableReviewButton] = useState(false);
  const [enableReview, setEnableReview] = useState(false);
  const [, setReview] = useState<Review | null>(null);
  const [users, setUsers] = useState<ReviewUser[]>([]);
  const [owner, setOwner] = useState<ReviewUser>(null);

  useEffect(() => {
    axios
      .get("https://variamos-ms-users.azurewebsites.net/users")
      .then(({ data }) => {
        setUsers(data.map((item) => ({ ...item, avatar: "" })));
      });
  }, []);

  useEffect(() => {
    const userLoginProfile = getUserProfile();
    if (userLoginProfile.userType === UserTypes.Guest) {
      return;
    }

    if (!language) {
      return;
    }

    axios.get(`/languagereviews/language/${language.id}`).then(({ data }) => {
      const languageReview: Review = data;
      const owner = users.find(
        (user) => user.id === languageReview.languageOwner
      );

      if (language && !languageReview) {
        setReview(null);
        setEnableReview(false);
        setEnableReviewButton(true);
        setOwner(null);
        return;
      }

      setReview(languageReview);
      setEnableReview(true);
      setEnableReviewButton(false);
      setOwner(owner);
    });
  }, [language, users]);

  const handleStartReviewClick = () => {
    const userDBProfile = getDataBaseUserProfile();
    const userLoginProfile = getUserProfile();

    axios
      .post("/languagereviews/", {
        languageId: language.id,
        status: "review",
        languageOwner: userDBProfile.user.id,
        languageOwnerEmail: userLoginProfile.email,
      })
      .then(() => {
        setEnableReview(true);
      });
  };

  if (!language) {
    return null;
  }

  return (
    <>
      {enableReviewButton && (
        <Button
          className="mb-3 mt-3"
          variant="primary"
          onClick={handleStartReviewClick}
        >
          Start a new review
        </Button>
      )}
      {enableReview && (
        <>
          <AutocompleteUserSearch
            users={users}
            onClick={(user) => {
              console.log("Selected user", user);
              setSelectedUsers([...selectedUsers, user]);
            }}
          />
          {!!selectedUsers.length && (
            <>
              <div className="mt-3">
                <span>Reviewers:</span>
              </div>
              <ListGroup className="mt-2">
                {selectedUsers.map((user, index) => (
                  <ListGroup.Item action key={index}>
                    <People style={{ marginRight: "10px" }} />
                    <span>{user.name}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </>
      )}
      {owner && (
        <>
          <p className="mt-3">Owner:</p>
          <ListGroup className="mt-2">
            <ListGroup.Item action>
              <PersonGear style={{ marginRight: "10px" }} />
              <span>{owner.name}</span>
            </ListGroup.Item>
          </ListGroup>
        </>
      )}
    </>
  );
}
