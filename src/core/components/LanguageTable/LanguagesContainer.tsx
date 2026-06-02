import {
  usePaginatedQuery,
  withPageVisit,
} from "@variamosple/variamos-components";
import { FC, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { queryLanguages, queryUserLanguages } from "../../../DataProvider/Services/languagesService";
import { PagedModel } from "../../../Domain/Core/Entity/PagedModel";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import { SearchForm } from "../SearchForm";
import { LanguagesList } from "./LanguagesList";
import { deleteLanguage } from "../../../DataProvider/Services/languagesService";
import ConfirmationModal from "../ConfirmationModal";
import * as alertify from "alertifyjs";
import { set } from "immer/dist/internal";

export class LanguagesFilter extends PagedModel {
  constructor(
    public name?: string,
    public userId?: string,
    pageNumber?: number,
    pageSize?: number,
    stateAccept?: string
  ) {
    super(pageNumber, pageSize);
  }
}

export interface LanguagesContainerProps {
  state? : boolean;
  del? : boolean;
  share? : boolean;
  approve? : boolean;
  loadDataOnInit?: boolean;
  eventKey?: string;
  queryFunction?;
  onLanguageClick?: (language: Language) => void;
}

function LanguagesContainerComponent ({
  state = false,
  del = false,
  share = false,
  approve = false,
  queryFunction,
  // onLanguageShare, // To be continued
  // onLanguageApproved, // To be continued 
  loadDataOnInit,
  onLanguageClick
} : LanguagesContainerProps) : JSX.Element {

  const {
    data: languages,
    loadData: loadLanguages,
    isLoading,
    currentPage,
    onPageChange,
    totalPages,
    filter: languagesFilter,
  } = usePaginatedQuery<LanguagesFilter, Language>({
    queryFunction: queryFunction,
    initialFilter: new LanguagesFilter(),
  });

  const [showDelete, setShowDelete] = useState(false);
  const [toDeleteLanguage, setToDeleteLanguage] = useState<Language>();

  const onReset = () => {
    loadLanguages(new LanguagesFilter());
  };

   const onLanguageDelete = (language: Language) => {
    setToDeleteLanguage(language);
    setShowDelete(true);
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


  const onSubmit = (name: string) => {
    loadLanguages(
      Object.assign(new LanguagesFilter(), {
        ...languagesFilter,
        name,
        pageNumber: 1,
      })
    );
  };

  useEffect(() => {
    if (loadDataOnInit) {
      loadLanguages(new LanguagesFilter());
    }
  }, [loadDataOnInit, loadLanguages]);

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
        <LanguagesList
          state={state}
          del={del}
          share={share}
          approve={approve}
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

export const LanguagesContainer = withPageVisit(
  LanguagesContainerComponent,
  "AllLanguageList"
);
