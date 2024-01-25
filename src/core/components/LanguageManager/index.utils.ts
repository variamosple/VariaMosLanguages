import config from "../../../Infraestructure/config.json";

const URL_BACKEND_LANGUAGE = process.env.REACT_APP_URLBACKENDLANGUAGE || config.urlBackEndLanguage;

export function getServiceUrl(...services) {
  const service = services.join("/")
  return [URL_BACKEND_LANGUAGE, service].join("/");
}

export function sortAphabetically(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};