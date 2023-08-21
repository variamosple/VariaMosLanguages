import { useContext, useEffect, useState } from "react";
import { Form, Row, Col, Modal, Button } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import Select from "react-select";
import "../../GraphicalMode.css";
import { LanguageContext } from "../../../../../context/LanguageContext/LanguageContextProvider";

export default function UniqueNameForm({
  show,
  handleClose,
}) {
  const {restrictions, setRestrictions, elements} = useContext(LanguageContext);
  const uniqueNameRestriction = restrictions.unique_name.elements;
  const [selectedSets, setSelectedSets] = useState([[]]);
  const elementOptions = elements.map((element) => element.name);

  useEffect(() => {
    setSelectedSets(uniqueNameRestriction);
  }, [uniqueNameRestriction]);

  const updateElementsInRestrictions = (newElements) => {
    setRestrictions((prevRestrictions) => ({
      ...prevRestrictions,
      unique_name: {
        ...prevRestrictions.unique_name,
        elements: newElements,
      },
    }));
  }

  const handleFormSubmit = () => {
    updateElementsInRestrictions(selectedSets)
    handleClose();
  };

  const handleAddSet = () => {
    setSelectedSets((prevSets) => [...prevSets, []]);
  };

  const handleRemoveSet = (index) => {
    setSelectedSets((prevSets) => prevSets.filter((_, i) => i !== index));
  };

  const handleSelectChange = (index, selectedOptions) => {
    setSelectedSets((prevSets) =>
      prevSets.map((set, i) => (i === index ? selectedOptions.map((option) => option.value) : set))
    );
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Body>
        <Form>
          {selectedSets.map((set, index) => (
            <Form.Group as={Row} className="mb-3" key={index}>
              <Form.Label column sm={2}>
                Elements
              </Form.Label>
              <Col sm={8}>
                <Select
                  options={elementOptions.map((element) => ({
                    value: element,
                    label: element,
                  }))}
                  value={set.map((element) => ({ value: element, label: element }))}
                  onChange={(selectedOptions) => handleSelectChange(index, selectedOptions)}
                  isMulti
                  closeMenuOnSelect={false}
                  placeholder="Select element(s)"
                />
              </Col>
              <Col sm={2}>
              <Button
                variant="outline-secondary"
                onClick={() => handleRemoveSet(index)}
                className="flex-grow-1 trash-btn btn-sm h-100"
              >
                <Trash className="trash" />
              </Button>
              </Col>
            </Form.Group>
          ))}
          <Button 
            variant="outline-secondary" 
            className="secondary-btn btn-sm flex-grow-1"
          onClick={handleAddSet}>Add Set</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleFormSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
