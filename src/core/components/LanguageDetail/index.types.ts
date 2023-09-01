import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import { CreatingMode } from "../LanguageManager/index.types";
import { Comment, Review } from "../LanguageReview/index.types";
export interface LanguageDetailProps {
  language: Language;
  isCreatingLanguage: boolean;
  setRequestLanguages: (value) => void;
  comments: Comment[];
}

export type propertyType = {
  name:string;
  type:string;
  possibleValues:string[];
  comment:string;
  linked_property:string;
  linked_value:string;
}