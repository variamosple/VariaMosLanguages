import { useEffect, useState } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import "../GraphicalMode.css";
import Select from "react-select";


export default function LabelForm({
  show,
  handleClose,
  selectedLabel,
  setSelectedLabel,
  properties,
  labels,
  setLabels
}) {
  const [formValues, setFormValues] = useState(selectedLabel);

  useEffect(() => {
    setFormValues(selectedLabel);
  }, [selectedLabel]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  
//A MODIFIER
  const handleUpdateLabels = (updatedLabel) => {
    const index = labels.findIndex((label) => label.name === updatedLabel.name);

    if (index !== -1) {
      const updatedLabels = [...labels];
      updatedLabels[index] = updatedLabel;
      setLabels(updatedLabels);
    }
  };



  const handleFormSubmit = () => {
    handleUpdateLabels(formValues);
    setSelectedLabel(formValues);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                  Align
              </Form.Label>
              <Col sm={10}>
              <Form.Select
              name="align"
              value={formValues.align}
              onChange={handleChange}
              aria-label=""
              >
              <option value="" className="text-muted"></option>
              <option value="left">left</option>
              <option value="right">right</option>
              </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Style
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                name="align"
                value={formValues.style}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Offset x
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="offset_x"
                  value={formValues.offset_x}
                  onChange={handleChange}
                  type="number"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Offset y
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="offset_y"
                  value={formValues.offset_y}
                  onChange={handleChange}
                  type="number"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
                Label property
            </Form.Label>
            <Col sm={10}>
            <Select
            options={properties.map((property) => ({
                value: property.name,
                label: property.name,
            }))}
            value={(formValues.label_property || []).map((property) => ({
                value: property,
                label: property,
            }))}
            onChange={(selectedOptions) => {
                const selectedValues = selectedOptions.map((option) => option.value);
                setFormValues((prevFormValues) => ({
                ...prevFormValues,
                label_property: selectedValues,
                }));
            }}
            isMulti
            closeMenuOnSelect={false}
            placeholder="Select element(s)"
            />

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
  );
};
