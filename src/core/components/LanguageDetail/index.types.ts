import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import { Comment, Review } from "../LanguageReview/index.types";
export interface LanguageDetailProps {
  language: Language;
  isCreatingLanguage: boolean;
  setRequestLanguages: (value) => void;
  setComment?: React.Dispatch<React.SetStateAction<Comment>>;
  review: Review;
}

export type propertyType = {
  name:string;
  type:string;
  possibleValues:string[];
  comment:string;
  linked_property:string;
  linked_value:string;
}