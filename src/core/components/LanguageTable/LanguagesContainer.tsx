import {
  usePaginatedQuery,
  withPageVisit,
  useSession,
} from "@variamosple/variamos-components";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { queryLanguages, queryPublicLanguages, queryUserLanguages } from "../../../DataProvider/Services/languagesService";
import { PagedModel } from "../../../Domain/Core/Entity/PagedModel";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import { SearchForm } from "../SearchForm";
import { LanguagesList } from "./LanguagesList";
import { deleteLanguage } from "../../../DataProvider/Services/languagesService";
import ConfirmationModal from "../ConfirmationModal";
import * as alertify from "alertifyjs";


export class LanguagesFilter extends PagedModel {
  constructor(
    public name?: string,
    public userId?: string,
    pageNumber?: number,
    pageSize?: number,
  ) {
    super(pageNumber, pageSize);
  }
}

export interface LanguagesContainerProps {
  variant : "user" | "public" | "languageDirector";
  loadDataOnInit?: boolean;
  eventKey?: string;
  queryFunction?;
  onLanguageClick?: (language: Language) => void;
}

function LanguagesContainerComponent ({
  variant,
  loadDataOnInit,
  onLanguageClick
} : LanguagesContainerProps) : JSX.Element {

  let queryFunction;
  let [state, del, share, approve] = [false,false,false,false]
  const { user } = useSession();
  let parameters = {name : null, userId : null};
  
  switch (variant) {
    case "user" :
      queryFunction = queryUserLanguages;
      share = true;
      del = true;
      parameters = {name : null, userId : user?.id};
      break;
    case "languageDirector" :
      queryFunction = queryLanguages;
      state = true;
      del = true;
      approve = true;
      break;
    default:
      queryFunction = queryPublicLanguages;
      break;
  }

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
    initialFilter: new LanguagesFilter(parameters.name, parameters.userId),
  });

  const [showDelete, setShowDelete] = useState(false);
  const [toDeleteLanguage, setToDeleteLanguage] = useState<Language>();

  const onReset = () => {
    loadLanguages(new LanguagesFilter(parameters.name, parameters.userId));
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
      Object.assign(new LanguagesFilter(parameters.name, parameters.userId), {
        ...languagesFilter,
        name,
        pageNumber: 1,
      })
    );
  };

  useEffect(() => {
    if (loadDataOnInit) {
      loadLanguages(new LanguagesFilter(parameters.name, parameters.userId));
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
