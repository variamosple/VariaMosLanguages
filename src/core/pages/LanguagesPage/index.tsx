import { useState } from "react";
import LanguageDetail from "../../components/LanguageDetail";
import LanguageManager from "../../components/LanguageManager";
import LanguagePageLayout from "../../components/LanguagePageLayout";
import LanguageReview from "../../components/LanguageReview";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import LanguageContextProvider from "../../context/LanguageContext/LanguageContextProvider";
import useUsers from "../../components/LanguageReview/hooks/useUsers";
import useLanguageReview from "../../components/LanguageReview/hooks/useLanguageReview";

export default function LanguagePage() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [isCreatingLanguage, setCreatingLanguage] = useState(false);
  const [requestLanguages, setRequestLanguages] = useState(false);

  const users = useUsers();
  const {
    review,
    setReview,
    owner,
    setOwner,
    enableReview,
    setEnableReview,
    enableReviewButton,
    setEnableReviewButton,
    selectedUsers,
    setSelectedUsers,
  } = useLanguageReview({
    selectedLanguage: language,
    users,
  });

  return (
    <LanguageContextProvider>
      <LanguagePageLayout>
        <LanguageManager
          setLanguage={setLanguage}
          setCreatingLanguage={setCreatingLanguage}
          requestLanguages={requestLanguages}
          setRequestLanguages={setRequestLanguages}
        />
        <LanguageDetail
          language={language}
          comments={review ? review.comments : []}
          isCreatingLanguage={isCreatingLanguage}
          setRequestLanguages={setRequestLanguages}
        />
        <LanguageReview
          {...{
            review,
            setReview,
            owner,
            setOwner,
            enableReview,
            setEnableReview,
            enableReviewButton,
            setEnableReviewButton,
            selectedUsers,
            setSelectedUsers,
            users,
            selectedLanguage: language,
          }}
        />
      </LanguagePageLayout>
    </LanguageContextProvider>
  );
}
