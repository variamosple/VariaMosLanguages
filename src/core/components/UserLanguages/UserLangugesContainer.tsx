import {
  usePaginatedQuery,
  useSession,
  withPageVisit,
} from "@variamosple/variamos-components";
import * as alertify from "alertifyjs";
import { FC, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import {
  deleteLanguage,
  queryUserLanguages,
} from "../../../DataProvider/Services/languagesService";
import { PagedModel } from "../../../Domain/Core/Entity/PagedModel";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import ConfirmationModal from "../ConfirmationModal";
import { SearchForm } from "../SearchForm";
import { UserLanguagesList } from "./UserLanguagesList";

export class LanguagesFilter extends PagedModel {
  constructor(
    public name?: string,
    public userId?: string,
    pageNumber?: number,
    pageSize?: number
  ) {
    super(pageNumber, pageSize);
  }
}

export interface UserLanguagesContainerProps {
  loadDataOnInit?: boolean;
  onLanguageClick?: (language: Language) => void;
}

const UserLanguagesContainerComponent: FC<UserLanguagesContainerProps> = ({
  loadDataOnInit = true,
  onLanguageClick = () => {},
}) => {
  const { user } = useSession();

  const [showDelete, setShowDelete] = useState(false);
  const [toDeleteLanguage, setToDeleteLanguage] = useState<Language>();

  const {
    data: languages,
    loadData: loadLanguages,
    isLoading,
    currentPage,
    onPageChange,
    totalPages,
    filter: languagesFilter,
  } = usePaginatedQuery<LanguagesFilter, Language>({
    queryFunction: queryUserLanguages,
    initialFilter: new LanguagesFilter(null, user?.id),
  });

  const onReset = () => {
    loadLanguages(new LanguagesFilter(null, user?.id));
  };

  const onSubmit = (name: string) => {
    loadLanguages(
      Object.assign(new LanguagesFilter(), {
        ...languagesFilter,
        name,
        pageNumber: 1,
      })
    );
  };

  const onDeleteLanguage = (language: Language) => {
    const { id, userId } = language || {};

    alertify.notify("Deleting language...", "info");

    deleteLanguage(id, userId).then((response) => {
      if (response.errorCode) {
        alertify.error("Error when trying to delete the language");
      } else {
        alertify.dismissAll();
        alertify.success("Language deleted successfully");
        onPageChange(currentPage);
      }
    });
  };

  const onLanguageDelete = (language: Language) => {
    setToDeleteLanguage(language);
    setShowDelete(true);
  };

  useEffect(() => {
    if (loadDataOnInit) {
      loadLanguages(new LanguagesFilter(null, user?.id));
    }
  }, [loadDataOnInit, loadLanguages, user?.id]);

  return (
    <div>
      <SearchForm
        isLoading={isLoading}
        onSearchReset={onReset}
        onSubmit={onSubmit}
      />

      {isLoading && (
        <div className="w-100 text-center">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            className="mx-3"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {!isLoading && (
        <UserLanguagesList
          languages={languages}
          onLanguageClick={onLanguageClick}
          onLanguageDelete={onLanguageDelete}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      )}

      <ConfirmationModal
        show={showDelete}
        message="Are you sure you want to delete the language?"
        confirmButtonVariant="danger"
        onConfirm={() => {
          onDeleteLanguage(toDeleteLanguage);
          setShowDelete(false);
        }}
        onCancel={() => {
          setToDeleteLanguage(null);
          setShowDelete(false);
        }}
      />
    </div>
  );
};

export const UserLanguagesContainer = withPageVisit(
  UserLanguagesContainerComponent,
  "UserLanguageList"
);
