export interface Reviewer {
  id: string;
  email: string;
}

export interface Review {
  id: number;
  languageId: number;
  status: string;
  languageOwner: string;
  languageOwnerEmail: string;
  reviewers: Reviewer[];
}

export interface ReviewUser {
  id: string;
  user: string;
  name: string;
  email: string;
}
