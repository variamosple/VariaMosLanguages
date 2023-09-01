import { Language } from "../../../../Domain/ProductLineEngineering/Entities/Language";
import { ReviewUser } from "../index.types";

export interface UseLanguageReviewProps {
  selectedLanguage: Language;
  users: ReviewUser[];
}
