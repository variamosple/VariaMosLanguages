import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import { Comment, Review } from "../LanguageReview/index.types";
export interface LanguageDetailProps {
  language: Language;
  isCreatingLanguage: boolean;
  setComment?: React.Dispatch<React.SetStateAction<Comment>>;
  review: Review;
  setEditLanguage: (edit) => void;
}
