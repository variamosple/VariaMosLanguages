import config from "../../../Infraestructure/config.json";

export function getServiceUrl(...services) {
  const service = services.join("/")
  return [config.urlBackEndLanguage, service].join("/");
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