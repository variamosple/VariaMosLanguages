import {
  usePaginatedQuery,
  withPageVisit,
} from "@variamosple/variamos-components";
import { FC, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { queryLanguages } from "../../../DataProvider/Services/languagesService";
import { PagedModel } from "../../../Domain/Core/Entity/PagedModel";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import { SearchForm } from "../SearchForm";
import { PublicLanguagesList } from "./PublicLanguagesList";

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

export interface PublicLanguagesContainerProps {
  loadDataOnInit?: boolean;
  onLanguageClick?: (language: Language) => void;
}

const PublicLanguagesContainerComponent: FC<PublicLanguagesContainerProps> = ({
  loadDataOnInit = true,
  onLanguageClick = () => {},
}) => {
  const {
    data: languages,
    loadData: loadLanguages,
    isLoading,
    currentPage,
    onPageChange,
    totalPages,
    filter: languagesFilter,
  } = usePaginatedQuery<LanguagesFilter, Language>({
    queryFunction: queryLanguages,
    initialFilter: new LanguagesFilter(),
  });

  const onReset = () => {
    loadLanguages(new LanguagesFilter());
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
        <PublicLanguagesList
          languages={languages}
          onLanguageClick={onLanguageClick}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export const PublicLanguagesContainer = withPageVisit(
  PublicLanguagesContainerComponent,
  "PublicLanguageList"
);
