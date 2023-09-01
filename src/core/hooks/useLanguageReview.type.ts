import { Language } from "../../Domain/ProductLineEngineering/Entities/Language";
import { Comment, Review, ReviewUser } from "../components/LanguageReview/index.types";

export interface UseLanguageReviewProps {
  selectedLanguage: Language;
  users: ReviewUser[];
}

export interface UseLanguageReviewOutput {
  owner: ReviewUser;
  setOwner: React.Dispatch<React.SetStateAction<ReviewUser>>;
  review: Review;
  setReview: React.Dispatch<React.SetStateAction<Review>>;
  enableReview: boolean;
  setEnableReview: React.Dispatch<React.SetStateAction<boolean>>;
  enableReviewButton: boolean;
  setEnableReviewButton: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUsers: ReviewUser[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<ReviewUser[]>>;
  setComment?: React.Dispatch<React.SetStateAction<Comment>>;
}

