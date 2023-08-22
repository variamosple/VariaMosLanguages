import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import { CreatingMode } from "../LanguageManager/index.types";
export interface LanguageDetailProps {
  language: Language;
  isCreatingLanguage: boolean;
  setRequestLanguages: (value) => void;
}

export type propertyType = {
  name:string;
  type:string;
  possible_values:string[];
  comment:string;
  linked_property:string;
  linked_value:string;
}