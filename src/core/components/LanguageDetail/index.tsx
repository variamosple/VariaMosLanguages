import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Form,
  InputGroup,
  ListGroup,
  Spinner,
  Container,
  Row,
} from "react-bootstrap";
import Comment from "./Comment/Comment";
import { capitalize, formatCode, getFormattedDate } from "./index.utils";
import ProjectService from "../../../Application/Project/ProjectService";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import { LanguageDetailProps } from "./index.types";
import config from "../LanguageManager/CreateLanguageButton/CreateLanguageButton.json";
import {
  graphicalToTextual,
  textualToGraphical,
} from "./GraphicalMode/SyntaxCompiler";
import TextualMode from "./TextualMode/TextualMode";
import GraphicalMode from "./GraphicalMode/GraphicalMode";
import { Comment as CommentType } from "../LanguageReview/index.types";
import { useComment } from "../../hooks/useComment";
import { useLanguageContext, CreatingMode } from "../../context/LanguageContext/LanguageContextProvider";
import { Tab, Tabs } from "react-bootstrap";
import CreationModeButton from "../LanguageManager/CreationModeButton/CreationModeButton";
import Semantics from "./Semantics";
import ConfirmationModal, {ConfirmationModalProps, confirmationModalDefaultProps} from "../ConfirmationModal";
import * as alertify from "alertifyjs";

const DEFAULT_SYNTAX = "{}";
const DEFAULT_STATE_ACCEPT = "PENDING";
const DEFAULT_ELEMENTS = [];
const DEFAULT_RELATIONSHIPS = [];
const DEFAULT_RESTRICTIONS = {
  unique_name: {
    elements: [[]],
  },
  parent_child: [],
  quantity_element: [],
};

const COMMENT_STATUS_OPEN = "open";

export default function LanguageDetail({
  language,
  isCreatingLanguage,
  review,
  setComment,
  setEditLanguage
}: LanguageDetailProps) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState(String());
  const [languageName, setLanguageName] = useState(String());
  const [languageType, setLanguageType] = useState(String());
  const [commentContent, setCommentContent] = useState(String());
  const { saveComment } = useComment({ setComment });
  const { setCreatingMode } = useLanguageContext();
  const [confirmModalState, setConfirmModalState] = useState<ConfirmationModalProps>({...confirmationModalDefaultProps});

  const {
    abstractSyntax,
    setAbstractSyntax,
    concreteSyntax,
    setConcreteSyntax,
    semantics,
    setSemantics,
    elements,
    relationships,
    restrictions,
    setElements,
    setRelationships,
    setRestrictions,
    creatingMode,
  } = useLanguageContext();

  useEffect(() => {
    if (isCreatingLanguage) {
      setLanguageName(String());
      setLanguageType("Domain");
      setAbstractSyntax(DEFAULT_SYNTAX);
      setConcreteSyntax(DEFAULT_SYNTAX);
      setSemantics(DEFAULT_SYNTAX);
      setElements(DEFAULT_ELEMENTS);
      setRelationships(DEFAULT_RELATIONSHIPS);
      setRestrictions(DEFAULT_RESTRICTIONS);
    }
  }, [
    isCreatingLanguage,
    setAbstractSyntax,
    setConcreteSyntax,
    setElements,
    setRelationships,
    setRestrictions,
    setSemantics
  ]);

  useEffect(() => {
    if (language && !isCreatingLanguage) {
      setLanguageName(language.name || "");
      setLanguageType(capitalize(language.type));
      setAbstractSyntax(formatCode(language.abstractSyntax || DEFAULT_SYNTAX));
      setConcreteSyntax(formatCode(language.concreteSyntax || DEFAULT_SYNTAX));
      setSemantics(formatCode(language.semantics || DEFAULT_SYNTAX));
    }
    setShowErrorMessage(false);
  }, [
    language,
    isCreatingLanguage,
    setAbstractSyntax,
    setConcreteSyntax,
    setElements,
    setRelationships,
    setRestrictions,
    setSemantics,
  ]);

  useEffect(() => {
    if (
      creatingMode === config.modeGraphicalLabel &&
      language &&
      !isCreatingLanguage
    ) {
      if (abstractSyntax && concreteSyntax) {
        const { elements, relationships, restrictions } = textualToGraphical(
          abstractSyntax,
          concreteSyntax
        );
        if (elements) {
          setElements(elements);
        }
        if (relationships) {
          setRelationships(relationships);
        }
        if (restrictions) {
          setRestrictions(restrictions);
        }
      }
    }
  }, [
    creatingMode,
    language,
    abstractSyntax,
    concreteSyntax,
    isCreatingLanguage,
    setElements,
    setRelationships,
    setRestrictions,
  ]);

  const handleServiceCallback = ({ messageError }) => {
    setShowSpinner(false);
    setDisableSaveButton(false);

    if (messageError) {
      setShowErrorMessage(true);
      setErrorMessage(messageError);
      return;
    }

    alertify.success("Language saved successfuly.");
    setShowErrorMessage(false);    
    setErrorMessage("");
    setEditLanguage(false);
  };

  const handleNameChange = (event) => {
    const currentName = event.target.value;
    setLanguageName(currentName);
  };

  const handleLanguageTypeChange = (event) => {
    const currentType = event.target.value;
    setLanguageType(currentType);
  };

  const handleSaveLanguage = () => {
    let abstractSyntaxtoSave = abstractSyntax;
    let concreteSyntaxtoSave = concreteSyntax;

    if (creatingMode === config.modeGraphicalLabel) {
      const { abstractSyntax, concreteSyntax } = graphicalToTextual(
        elements,
        relationships,
        restrictions
      );
      abstractSyntaxtoSave = abstractSyntax;
      concreteSyntaxtoSave = concreteSyntax;
    }
    const service = new ProjectService();
    const currentLanguage: Language = {
      ...(isCreatingLanguage ? {} : { id: language?.id }),
      name: languageName,
      type: languageType.toUpperCase(),
      ...(isCreatingLanguage
        ? { stateAccept: DEFAULT_STATE_ACCEPT }
        : { stateAccept: language?.stateAccept }),
      abstractSyntax: abstractSyntaxtoSave,
      concreteSyntax: concreteSyntaxtoSave,
      semantics,
    };

    try {
      isCreatingLanguage
        ? service.createLanguage(handleServiceCallback, currentLanguage)
        : service.updateLanguage(
          handleServiceCallback,
          currentLanguage,
          String(language.id)
        );

      setShowSpinner(true);
      setDisableSaveButton(true);
    } catch (e) {
      setErrorMessage((e as Error).message);
      setShowErrorMessage(true);
      setShowSpinner(false);
    }
  };

  const handleCancel = () => {
    setEditLanguage(false);
  };

  const handleModeClick = (mode: CreatingMode) => {
    setCreatingMode(mode);
  };

  const confirmSave = () => {
    setConfirmModalState({
      ...confirmationModalDefaultProps,
      show: true,
      message: "Are you sure you want to save the language?",
      onConfirm: () => {
        setConfirmModalState((currentState) => ({...currentState, show: false, }));
        handleSaveLanguage();
      },
      onCancel: () => setConfirmModalState((currentState) => ({...currentState, show: false})),
    });
  }

  const confirmCancel = () => {
    setConfirmModalState({
      ...confirmationModalDefaultProps,
      show: true,
      message: "All the changes will be lost. Are you sure you want to cancel?",
      onConfirm: () => {
        setConfirmModalState((currentState) => ({...currentState, show: false, }));
        handleCancel();
      },
      confirmButtonVariant: "danger",
      onCancel: () => setConfirmModalState((currentState) => ({...currentState, show: false, }))
    });
  }

  if (!language && !isCreatingLanguage) {
    return (
      <Alert variant="primary" className="mb-3 mt-3">
        Please select a language from the left menu or select on "Create
        language" to create a new one.
      </Alert>
    );
  }

  return (
    <>
      <br />
      <div className='d-flex gap-1'>
        <Button
          variant="secondary"
          onClick={confirmCancel}
          disabled={disableSaveButton}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={confirmSave}
          disabled={disableSaveButton}
        >
          Save
        </Button>
      </div>
      <br />
      <Container>
        <Row>
          {showSpinner && (
            <Container className="mb-3 mt-3 center">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Container>
          )}
          {showErrorMessage && (
            <Alert variant="danger" className="mb-3 mt-3">
              {errorMessage}
            </Alert>
          )}
        </Row>
      </Container>
      <Tabs defaultActiveKey="information" id="uncontrolled-tab">
        <Tab eventKey="information" title="Information">
          <InputGroup className="mb-3 mt-3">
            <InputGroup.Text id="inputGroup-sizing-default">Name</InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              value={languageName}
              onChange={handleNameChange}
            />
            <Form.Select
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              value={languageType}
              onChange={handleLanguageTypeChange}
            >
              <option>Domain</option>
              <option>Application</option>
              <option>Adaptation</option>
            </Form.Select>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">Status</InputGroup.Text>
            <Form.Select
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            >
              <option>Pending</option>
              <option>Approved</option>
            </Form.Select>
          </InputGroup>
        </Tab>
        <Tab eventKey="syntax" title="Syntax">
          <br />
          <CreationModeButton handleModeClick={handleModeClick} />
          <br />
          {creatingMode === config.modeTextualLabel && <TextualMode />}
          {creatingMode === config.modeGraphicalLabel && <GraphicalMode />}
        </Tab>
        <Tab eventKey="semantics" title="Semantics" id="uncontrolled-tab" className="my-3">
          <Semantics />
        </Tab>
        <Tab eventKey="comments" title="Comments">
          {/* Add Comment */}
          <Form className="mb-3">
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>New comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={
                  !review ? "Create a new review in order to enable comments" : ""
                }
                disabled={!review}
                value={commentContent}
                onChange={(event) => {
                  setCommentContent(event.target.value);
                }}
              />
            </Form.Group>
            <Button
              variant="primary"
              disabled={!commentContent}
              onClick={() => {
                const comment: CommentType = {
                  content: commentContent,
                  date: getFormattedDate(),
                  status: COMMENT_STATUS_OPEN,
                  authorName: "Julian Murillo",
                  languageReview: review.id,
                };
                setCommentContent(String());
                saveComment(comment);
              }}
            >
              Add Comment
            </Button>
          </Form>

          {/* List Comments */}
          <ListGroup>
            {review &&
              review.comments &&
              review.comments.length &&
              review.comments
                .map((comment, index) => {
                  return (
                    <ListGroup.Item key={index}>
                      <Comment comment={comment} />
                    </ListGroup.Item>
                  );
                })
                .reverse()}

            {!review || !review?.comments || !review?.comments.length ? (
              <Alert variant="secondary" className="mb-3 mt-3">
                There are no comments available.
              </Alert>
            ) : (
              false
            )}
          </ListGroup>
        </Tab>
      </Tabs>
      <ConfirmationModal {...confirmModalState} />
    </>
  );
}
