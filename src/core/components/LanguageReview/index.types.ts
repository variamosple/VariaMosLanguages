export interface Reviewer {
  id: string;
  email: string;
}

export interface Comment {
  id: string;
  content: string;
  date: string;
  status: string;
}

export interface Review {
  id: number;
  languageId: number;
  status: string;
  languageOwner: string;
  languageOwnerEmail: string;
  reviewers: Reviewer[];
  comments: Comment[];
}

export interface ReviewUser {
  id: string;
  user: string;
  name: string;
  email: string;
}
