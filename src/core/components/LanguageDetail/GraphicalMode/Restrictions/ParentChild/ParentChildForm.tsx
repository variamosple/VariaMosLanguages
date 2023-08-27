import { useEffect, useState } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { useLanguageContext } from "../../../../../context/LanguageContext/LanguageContextProvider";

export default function ParentChildForm ({
  show,
  handleClose,
  selectedRestriction,
  handleUpdateRestriction
}) {
  const {elements} = useLanguageContext();
  const [formValues, setFormValues] = useState(selectedRestriction);
  const [selectedElements, setSelectedElements] = useState(selectedRestriction.parentElement);


  useEffect(() => {
    setFormValues(selectedRestriction);
    setSelectedElements(selectedRestriction.parentElement);
  }, [selectedRestriction]);

  const elementOptions = elements.map((element) => element.name);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {
    handleUpdateRestriction(formValues)
    handleClose();
  };


  return (
    <div>
      <Modal show={show} onHide={handleClose} backdrop="static">

        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Parents
              </Form.Label>
              <Col sm={10}>
                <Select
                  options={elementOptions.map((element) => ({
                    value: element,
                    label: element,
                  }))}
                  value={(selectedElements || []).map((element) => ({
                    value: element,
                    label: element,
                  }))}
                  onChange={(selectedOptions) => {
                    setSelectedElements(
                      selectedOptions.map((option) => option.value)
                    );
                    setFormValues((prevFormValues) => ({
                      ...prevFormValues,
                      parentElement: selectedOptions.map((option) => option.value),
                    }));
                  }}
                  isMulti
                  closeMenuOnSelect={false}
                  placeholder="Select element(s)"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Child
              </Form.Label>
              <Col sm={10}>
                <Form.Select
                  name="childElement"
                  value={formValues.childElement ||""}
                  onChange={handleChange}
                >
                  <option value="" className="text-muted">Select element</option>
                  {elements.map((element) => (
                    <option key={element.id} value={element.id}>
                      {element.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleFormSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
