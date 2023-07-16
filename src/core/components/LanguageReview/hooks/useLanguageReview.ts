import { useEffect, useState } from "react";
import { Review, ReviewUser } from "../index.types";
import { getUserProfile } from "../../../../UI/SignUp/SignUp.utils";
import { UserTypes } from "../../../../UI/SignUp/SignUp.constants";
import { Service } from "../index.structures";
import { ExternalServices } from "../index.constants";
import { getOwner, getReviewers } from "../index.utils";
import axios from "axios";
import { UseLanguageReviewProps } from "./useLanguageReview.type";

export default function useLanguageReview({
  selectedLanguage,
  users,
  setReview,
  setEnableReview,
  setSelectedUsers,
  setEnableReviewButton,
}: UseLanguageReviewProps): {
  owner: ReviewUser;
  setOwner: React.Dispatch<React.SetStateAction<ReviewUser>>;
} {
  const [owner, setOwner] = useState<ReviewUser>(null);

  useEffect(() => {
    const userLoginProfile = getUserProfile();
    if (userLoginProfile.userType === UserTypes.Guest) {
      return;
    }

    if (!selectedLanguage) {
      return;
    }

    const serviceUrlGetOneReview = Service(
      ExternalServices.LanguageReviewDomain
    ).getOne({
      service: ExternalServices.LanguageReviewsContext,
      subservice: ExternalServices.LanguageResource,
      id: selectedLanguage.id,
    });

    axios.get(serviceUrlGetOneReview).then(({ data }) => {
      const languageReview: Review = data;
      const owner = getOwner({ users, languageReview });

      if (selectedLanguage && !languageReview) {
        setReview(null);
        setEnableReview(false);
        setEnableReviewButton(true);
        setOwner(null);
        return;
      }

      console.log(languageReview);
      const reviewers = getReviewers({ users, languageReview });

      setReview(languageReview);
      setSelectedUsers(reviewers);
      setEnableReview(true);
      setEnableReviewButton(false);
      setOwner(owner);
    });
  }, [
    selectedLanguage,
    setEnableReview,
    setEnableReviewButton,
    setReview,
    setSelectedUsers,
    users,
  ]);

  return {
    owner,
    setOwner,
  };
}
