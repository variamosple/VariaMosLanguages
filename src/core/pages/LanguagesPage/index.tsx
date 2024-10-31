import { useState } from "react";
import LanguageDetail from "../../components/LanguageDetail";
import LanguageManager from "../../components/LanguageManager";
import LanguagePageLayout from "../../components/LanguagePageLayout";
import LanguageReview from "../../components/LanguageReview";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import LanguageContextProvider from "../../context/LanguageContext/LanguageContextProvider";
import useUsers from "../../hooks/useUsers";
import useLanguageReview from "../../hooks/useLanguageReview";

export default function LanguagePage() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [isCreatingLanguage, setCreatingLanguage] = useState(false);
  const [showLanguageManager, setShowLanguageManager] = useState(null);
  const [showLanguageDetail, setShowLanguageDetail] = useState({display:"none"}); 

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
    setComment
  } = useLanguageReview({
    selectedLanguage: language,
    users,
  });

  const setEditLanguage = (edit) => {
    if (edit) {
      setShowLanguageManager({display:"none"});
      setShowLanguageDetail(null); 
    }else{
      setShowLanguageManager(null);
      setShowLanguageDetail({display:"none"});
    }
  }

  return (
    <LanguageContextProvider>
      <LanguagePageLayout>
        <div style={showLanguageManager}>
          {!!showLanguageDetail && (
            <LanguageManager
              setLanguage={setLanguage}
              setCreatingLanguage={setCreatingLanguage}
              setEditLanguage={setEditLanguage}
            />
          )}
        </div>
        <div style={showLanguageDetail}>
          <LanguageDetail
            language={language}
            review={review}
            setComment={setComment}
            isCreatingLanguage={isCreatingLanguage}
            setEditLanguage={setEditLanguage}
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
        </div>
      </LanguagePageLayout>
    </LanguageContextProvider>
  );
}
