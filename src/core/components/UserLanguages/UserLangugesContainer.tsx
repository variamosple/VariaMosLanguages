import {
  usePaginatedQuery,
  useSession,
  withPageVisit,
} from "@variamosple/variamos-components";
import * as alertify from "alertifyjs";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Form, Row, Spinner } from "react-bootstrap";
import {
  deleteLanguage,
  queryUserLanguages,
} from "../../../DataProvider/Services/languagesService";
import { PagedModel } from "../../../Domain/Core/Entity/PagedModel";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import ConfirmationModal from "../ConfirmationModal";
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

const defaultFormValue = Object.freeze({ name: "" });

export interface UserLanguagesContainerProps {
  loadDataOnInit?: boolean;
  onLanguageClick?: (language: Language) => void;
}

// TODO: refactor this component so it content is no more than 100 lines of Code

const UserLanguagesContainerComponent: FC<UserLanguagesContainerProps> = ({
  loadDataOnInit = true,
  onLanguageClick = () => {},
}) => {
  const { user } = useSession();

  const [formValue, setFormValue] = useState({ ...defaultFormValue });
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

  const onClear = () => {
    setFormValue({ ...defaultFormValue });
  };

  const onReset = () => {
    setFormValue({ ...defaultFormValue });
    loadLanguages(new LanguagesFilter(null, user?.id));
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

      <UserLanguagesList
        languages={languages}
        onLanguageClick={onLanguageClick}
        onLanguageDelete={onLanguageDelete}
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />

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
