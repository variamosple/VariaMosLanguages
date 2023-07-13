export interface Review {
  languageId: number;
  status: string;
  languageOwner: string;
  languageOwnerEmail: string;
}

export interface ReviewUser {
  id: string;
  user: string;
  name: string;
  email: string;
}
