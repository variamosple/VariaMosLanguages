import axios from "axios";
import { useEffect, useState } from "react";
import { ExternalServices } from "../components/LanguageReview/index.constants";
import { Comment as CommentType } from "../components/LanguageReview/index.types";

export function useComment({
  setComment,
}: {
  setComment?: React.Dispatch<React.SetStateAction<CommentType>>;
}) {
  const [comment, saveComment] = useState<CommentType>(null);
  useEffect(() => {
    if (!comment) {
      return;
    }
    console.log("Hook executing?");

    axios
      .post(
        `${ExternalServices.LanguageReviewDomain}/${ExternalServices.CommentsContext}`,
        { ...comment }
      )
      .then(() => {
        setComment(comment);
        // setReview({
        //   ...review,
        //   comments: [...review.comments, comment],
        // });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment]);

  return { saveComment };
}
