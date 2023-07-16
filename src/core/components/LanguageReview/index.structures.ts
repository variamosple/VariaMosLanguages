export const Service = (domain?: string) => ({
  getAll: (service: string) => {
    return [domain, service].join("/");
  },
  getOne: ({ service, subservice, id }: { service: string; subservice?: string; id: number }) => {
    return [domain, service, subservice, String(id)].join("/");
  },
  post: (service) => {
    return [domain, service].join("/");
  },
});
