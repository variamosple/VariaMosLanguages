import {
  usePaginatedQuery,
  withPageVisit,
} from "@variamosple/variamos-components";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Form, Row, Spinner } from "react-bootstrap";
import { queryLanguages } from "../../../DataProvider/Services/languagesService";
import { PagedModel } from "../../../Domain/Core/Entity/PagedModel";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
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

const defaultFormValue = Object.freeze({ name: "" });

export interface PublicLanguagesContainerProps {
  loadDataOnInit?: boolean;
  onLanguageClick?: (language: Language) => void;
}

const PublicLanguagesContainerComponent: FC<PublicLanguagesContainerProps> = ({
  loadDataOnInit = true,
  onLanguageClick = () => {},
}) => {
  const [formValue, setFormValue] = useState({ ...defaultFormValue });

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

  const onClear = () => {
    setFormValue({ ...defaultFormValue });
  };

  const onReset = () => {
    setFormValue({ ...defaultFormValue });
    loadLanguages(new LanguagesFilter());
  };

  const hanldeOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormValue((currentValue) => ({ ...currentValue, [name]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filterValues = {};
    Object.entries(formValue)
      .filter(([_, value]) => value !== null && value !== undefined)
      .forEach(([key, value]) => (filterValues[key] = value));

    loadLanguages(
      Object.assign(
        new LanguagesFilter(),
        { ...languagesFilter, pageNumber: 1 },
        filterValues
      )
    );
  };

  useEffect(() => {
    if (loadDataOnInit) {
      loadLanguages(new LanguagesFilter());
    }
  }, [loadDataOnInit, loadLanguages]);

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Row className="mb-3">
          <Col xs={12} sm lg={9}>
            <Form.Control
              name="name"
              type="text"
              placeholder="Find a language..."
              value={formValue.name}
              onChange={hanldeOnChange}
            />
          </Col>

          <Col xs={12} sm="auto" lg={3} className="mt-2 mt-sm-0 text-center">
            <ButtonGroup className="d-flex w-100">
              <Button
                type="button"
                onClick={onClear}
                disabled={isLoading}
                className="flex-fill"
              >
                Clear
              </Button>
              <Button
                type="button"
                onClick={onReset}
                disabled={isLoading}
                className="flex-fill"
              >
                Reset
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-fill">
                Search
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>

      <PublicLanguagesList
        languages={languages}
        onLanguageClick={onLanguageClick}
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export const PublicLanguagesContainer = withPageVisit(
  PublicLanguagesContainerComponent,
  "PublicLanguageList"
);
