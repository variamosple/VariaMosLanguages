import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Alert, Col, Form, ListGroup, Row, Spinner } from "react-bootstrap";
import { CardText } from "react-bootstrap-icons";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import CreateLanguageButton from "./CreateLanguageButton/CreateLanguageButton";
import LanguageManagerLayout from "./LanguageManagerLayout/LanguageManagerLayout";
import { getServiceUrl, sortAphabetically } from "./index.utils";
import { CreatingMode, LanguageManagerProps } from "./index.types";
import CreationModeButton from "./CreateLanguageButton/CreationModeButton";
import { LanguageContext } from "../../context/LanguageContext/LanguageContextProvider";


export default function LanguageManager({
  setLanguage,
  setCreatingLanguage,
  requestLanguages,
  setRequestLanguages,
}: LanguageManagerProps) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [displayedLanguages, setDisplayedLanguages] = useState<Language[]>([]);
  const { setCreatingMode } = useContext(LanguageContext);

  const handleCreateClick = () => {
    setCreatingLanguage(true);
  };
  
  const handleModeClick = (mode: CreatingMode) => {
    setCreatingMode(mode);
  };

  useEffect(() => {
    setShowSpinner(true);
    setDisplayedLanguages([]);
    axios
      .get(getServiceUrl("languages", "detail"))
      .then(({ data: { data } }) => {
        const sortedLanguages = data.sort(sortAphabetically);
        setLanguages(sortedLanguages);
        setDisplayedLanguages(sortedLanguages);
        setShowSpinner(false);
        setRequestLanguages(false);
      });
  }, [requestLanguages, setRequestLanguages]);

  const handleClick = (language) => () => {
    setLanguage(language);
    setCreatingLanguage(false);
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
        <Col >
          <CreationModeButton handleModeClick={handleModeClick}/>
        </Col>
      </Col>      <Form.Group controlId="searchLanguages">
        <Form.Control
          type="text"
          placeholder="Find a language..."
          onChange={handleSearchChange}
        />
      </Form.Group>
      <ListGroup style={{ minWidth: "312px", marginBottom: "10px" }}>
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
