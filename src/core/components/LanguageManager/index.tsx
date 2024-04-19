import { useEffect, useState } from "react";
import { Alert, Col, Form, ListGroup, Row, Spinner } from "react-bootstrap";
import { CardText } from "react-bootstrap-icons";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import CreateLanguageButton from "./CreateLanguageButton/CreateLanguageButton";
import LanguageManagerLayout from "./LanguageManagerLayout/LanguageManagerLayout";
import { getServiceUrl, sortAphabetically } from "./index.utils";
import { LanguageManagerProps } from "./index.types";
import CreationModeButton from "./CreationModeButton/CreationModeButton";
import {
  CreatingMode,
  useLanguageContext,
} from "../../context/LanguageContext/LanguageContextProvider";

export default function LanguageManager({
  setLanguage,
  setCreatingLanguage,
  requestLanguages,
  setRequestLanguages,
  setEditLanguage
}: LanguageManagerProps) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [displayedLanguages, setDisplayedLanguages] = useState<Language[]>([]);
  const { setCreatingMode } = useLanguageContext();

  const handleCreateClick = () => {
    setCreatingLanguage(true);
    setEditLanguage(true);
  };

  const handleModeClick = (mode: CreatingMode) => {
    setCreatingMode(mode);
  };

  useEffect(() => {
    setShowSpinner(true);
    setDisplayedLanguages([]);
    const servicePath = getServiceUrl("languages", "detail");

    const fetchData = async () => {
      try {
        const response = await fetch(servicePath);
        const dataResponse = await response.json();
        const sortedLanguages = dataResponse.data.sort(sortAphabetically);
        setLanguages(sortedLanguages);
        setDisplayedLanguages(sortedLanguages);
        setShowSpinner(false);
        setRequestLanguages(false);
      } catch (error) {
        console.log(
          `Error trying to connect to the ${servicePath} service. Error: ${error}`
        );
        setLanguages([]);
        setShowSpinner(false);
        setRequestLanguages(false);
      }
    };

    fetchData();
  }, [requestLanguages, setRequestLanguages]);

  const handleClick = (language) => () => {
    setLanguage(language);
    setCreatingLanguage(false);
    setEditLanguage(true);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;

    const filteredLanguages = languages.filter((language) => {
      return language.name
        .toLocaleLowerCase()
        .includes(searchTerm.toLocaleLowerCase());
    });

    setDisplayedLanguages(filteredLanguages);
  };

  return (
    <LanguageManagerLayout>
      <Col as={Row}>
        <Col sm={6}>
          <CreateLanguageButton handleCreateClick={handleCreateClick} />
        </Col>
      </Col>
      <Form.Group controlId="searchLanguages">
        <Form.Control
          type="text"
          placeholder="Find a language..."
          onChange={handleSearchChange}
        />
      </Form.Group>
      <ListGroup
        style={{
          minWidth: "312px",
          marginBottom: "10px",
          maxHeight: "100vh",
          overflow: "auto",
        }}
      >
        {showSpinner && (
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            className="mb-3"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {!!displayedLanguages.length ? (
          displayedLanguages.map((language, index) => (
            <ListGroup.Item action key={index} onClick={handleClick(language)}>
              <CardText style={{ marginRight: "10px" }} />
              {language.name}
            </ListGroup.Item>
          ))
        ) : (
          <NoResultsAvailableAlert showSpinner={showSpinner} />
        )}
      </ListGroup>
    </LanguageManagerLayout>
  );
}

function NoResultsAvailableAlert({ showSpinner }: { showSpinner: boolean }) {
  return !showSpinner && <Alert variant="info">No results available</Alert>;
}
