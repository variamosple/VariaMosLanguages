import { useEffect, useState } from "react";
import { Review, ReviewUser } from "../components/LanguageReview/index.types";
import { getUserProfile } from "../../UI/SignUp/SignUp.utils";
import { UserTypes } from "../../UI/SignUp/SignUp.constants";
import { Service } from "../components/LanguageReview/index.structures";
import { ExternalServices } from "../components/LanguageReview/index.constants";
import {
  getOwner,
  getReviewers,
} from "../components/LanguageReview/index.utils";
import axios from "axios";
import { UseLanguageReviewProps } from "./useLanguageReview.type";
import { UseLanguageReviewOutput } from "./useLanguageReview.type";
import { joinPath } from "../utils/PathUtils";

export default function useLanguageReview({
  selectedLanguage,
  users,
}: UseLanguageReviewProps): UseLanguageReviewOutput {
  const [owner, setOwner] = useState<ReviewUser>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [enableReview, setEnableReview] = useState<boolean>(false);
  const [enableReviewButton, setEnableReviewButton] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [comment, setComment] = useState(null);

  useEffect(() => {
    const userLoginProfile = getUserProfile();
    if (userLoginProfile.userType === UserTypes.Guest) {
      return;
    }

    if (!selectedLanguage) {
      return;
    }

    const servicePath = joinPath(
      process.env.REACT_APP_URLBACKENDLANGUAGEREVIEWS || ExternalServices.LanguageReviewDomain,
      ExternalServices.LanguageReviewsContext,
      ExternalServices.LanguageResource,
      String(selectedLanguage.id)
    );

    const fetchData = async () => {

      try {
        const response = await fetch(servicePath);
        const data = await response.json();

        const languageReview: Review = data;
        const owner = getOwner({ users, languageReview });

        if (selectedLanguage && !languageReview) {
          setReview(null);
          setEnableReview(false);
          setEnableReviewButton(true);
          setOwner(null);
          return;
        }

        const reviewers = getReviewers({ users, languageReview });

        setReview(languageReview);
        setSelectedUsers(reviewers);
        setEnableReview(true);
        setEnableReviewButton(false);
        setOwner(owner);
      } catch (error) {
        console.log(`Error trying to connect to the ${servicePath} service. Error ${(error)}`);
      }
      
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedLanguage,
    setEnableReview,
    setEnableReviewButton,
    setReview,
    setSelectedUsers,
    users,
    comment,
  ]);

  return {
    owner,
    setOwner,
    review,
    setReview,
    enableReview,
    setEnableReview,
    enableReviewButton,
    setEnableReviewButton,
    selectedUsers,
    setSelectedUsers,
    setComment,
  };
}
