import axios from "axios";
import { LANGUAGES_CLIENT } from "../../Infraestructure/AxiosConfig";
import { ResponseModel } from "@variamosple/variamos-components";
import { User } from "../../Domain/ProductLineEngineering/Entities/User";
import { PagedModel } from "../../Domain/Core/Entity/PagedModel";

export async function querySharedUsers(languageId: number): Promise<ResponseModel<User[]>> {
    return LANGUAGES_CLIENT.get(`/v2/users/shared/${languageId}`)
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
}

export class UsersFilter extends PagedModel {
  constructor(
    public languageId?: number,
    public name?: string,
    public email?: string,
    pageNumber?: number,
    pageSize?: number,
  ) {
    super(pageNumber, pageSize);
  }
}

export async function queryAllUsers(filter: UsersFilter): Promise<ResponseModel<User[]>> {
    const params = {
        pageNumber: filter.pageNumber || 1,
        pageSize: filter.pageSize || 10,
        name: filter.name || null,
        email: filter.email || null,
    };
    
    return LANGUAGES_CLIENT.get(`/v2/users/${filter.languageId}`, { params })
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
          "Error when trying to get users, please try again later."
        );
      }
    });
}

export async function shareLanguageWithUser(languageId: number, userId: string): Promise<ResponseModel<void>> {
    return LANGUAGES_CLIENT.post(`/v2/users/share/${userId}/${languageId}`)
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
          "Error when trying to share language with user, please try again later."
        );
      }
    });
}

export async function unshareLanguageWithUser(languageId: number, userId: string): Promise<ResponseModel<void>> {
    return LANGUAGES_CLIENT.post(`/v2/users/unshare/${userId}/${languageId}`)
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
          "Error when trying to unshare language with user, please try again later."
        );
      }
    });
}