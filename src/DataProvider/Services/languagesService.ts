import axios from "axios";

import { ResponseModel } from "@variamosple/variamos-components";
import { Language } from "../../Domain/ProductLineEngineering/Entities/Language";
import { LANGUAGES_CLIENT } from "../../Infraestructure/AxiosConfig";
import { LanguagesFilter } from "../../core/components/PublicLanguages/PublicLanguagesContainer";

export const queryUserLanguages = (
  filter: LanguagesFilter
): Promise<ResponseModel<Language[]>> => {
  const userId: string = filter?.userId || "";

  const newFilter = Object.assign({}, filter, { userId: null });

  return LANGUAGES_CLIENT.get(`/v2/users/${userId}/languages`, {
    params: newFilter,
  })
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);

        const response = error.response?.data;

        if (!!response) {
          return response;
        }

        return new ResponseModel("BACK-ERROR").withError(
          Number.parseInt(error.code || "500"),
          "Error when comunicating with the back-end."
        );
      } else {
        console.error("Unexpected error:", error);

        return new ResponseModel("APP-ERROR").withError(
          500,
          "Error when trying to get session info, please try again later."
        );
      }
    });
};

export const queryLanguages = (
  filter: LanguagesFilter
): Promise<ResponseModel<Language[]>> => {
  return LANGUAGES_CLIENT.get(`/v2/languages`, {
    params: filter,
  })
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);

        const response = error.response?.data;

        if (!!response) {
          return response;
        }

        return new ResponseModel("BACK-ERROR").withError(
          Number.parseInt(error.code || "500"),
          "Error when comunicating with the back-end."
        );
      } else {
        console.error("Unexpected error:", error);

        return new ResponseModel("APP-ERROR").withError(
          500,
          "Error when trying to get session info, please try again later."
        );
      }
    });
};

export const deleteLanguage = (
  languageId: number,
  userId: string
): Promise<ResponseModel<void>> => {
  return LANGUAGES_CLIENT.delete(`/languages/${languageId}/${userId}`)
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);

        const response = error.response?.data;

        return response;
      } else {
        console.error("Unexpected error:", error);

        return new ResponseModel("APP-ERROR").withError(
          500,
          `Error when trying to delete the user with id: ${userId}, please try again later.`
        );
      }
    });
};
