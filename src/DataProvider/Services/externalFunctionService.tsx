import axios, { Method } from "axios";
import { ExternalFuntion } from "../../Domain/ProductLineEngineering/Entities/ExternalFuntion";
import { ResponseAPISuccess } from "./languageService";
import { LANGUAGES_CLIENT } from "../../Infraestructure/AxiosConfig";
export default class ExternalFuntionService {
  apiVariamos: any;

  getExternalFunctions(callback: any, languageId: number) {
    let externalFunctions: ExternalFuntion[] = [];
    try {
      LANGUAGES_CLIENT
        .get("/languages/" + languageId + "/externalfunctions")
        .then((res) => {
          let responseAPISuccess: ResponseAPISuccess = new ResponseAPISuccess();
          responseAPISuccess = Object.assign(responseAPISuccess, res.data);

          if (responseAPISuccess.message?.includes("Error"))
            throw new Error(JSON.stringify(res.data));

          externalFunctions = Object.assign(
            externalFunctions,
            responseAPISuccess.data
          );
          callback(externalFunctions);
        });
    } catch (error) {
      console.log("Something wrong in getExternalFunctions Service: " + error);
      callback(externalFunctions);
    }
  }

  callExternalFuntion(callback: any, externalFunction: ExternalFuntion): any {
    const config = {
      baseURL: externalFunction.url,
      method: "POST" as Method, 
      headers: externalFunction.header,
      data: externalFunction.request
    };

    try {
      axios(config).then((res) => {
        let responseAPISuccess: ResponseAPISuccess = new ResponseAPISuccess();
        responseAPISuccess = Object.assign(responseAPISuccess, res.data);

        if (responseAPISuccess.message?.includes("Error"))
          throw new Error(JSON.stringify(res.data));
          

        callback(responseAPISuccess);
      }).catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
    
      });
    } catch (error) {
      console.log("Something wrong in getExternalFunctions Service: " + error);
    }
  }
}
