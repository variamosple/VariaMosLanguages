import { Review, ReviewUser } from "./index.types";

export function getReviewers({
  users,
  languageReview,
}: {
  users: ReviewUser[];
  languageReview: Review;
}): ReviewUser[] {
  return languageReview &&
    languageReview.reviewers &&
    languageReview.reviewers.length
    ? users.filter((user) =>
        languageReview.reviewers
          .map((review) => review.email)
          .includes(user.email)
      )
    : [];
}

export function getOwner({ users, languageReview }) {
  return users.find((user) => user.id === languageReview.languageOwner);
}