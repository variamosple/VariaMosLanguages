import { Language } from "../../../../Domain/ProductLineEngineering/Entities/Language";
import { Review, ReviewUser } from "../index.types";

export interface UseLanguageReviewProps {
    selectedLanguage: Language;
    users: ReviewUser[];
    setReview: React.Dispatch<React.SetStateAction<Review>>;
    setEnableReview: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedUsers: React.Dispatch<React.SetStateAction<any[]>>;
    setEnableReviewButton: React.Dispatch<React.SetStateAction<boolean>>;
  }