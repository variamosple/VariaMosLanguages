import { useEffect, useState } from "react";
import { Modal, Button, Form, Col, Row} from "react-bootstrap";
import "../../GraphicalMode.css";
import { propertyType } from "../../../index.types";


export default function StyleForm({
  show,
  handleClose,
  selectedStyle,
  setSelectedStyle,
  properties,
  styles,
  setStyles
}) {
  const [formValues, setFormValues] = useState(selectedStyle);
  const [linkedProperty, setLinkedProperty] = useState<propertyType>();

  useEffect(() => {
    setFormValues(selectedStyle);
  }, [selectedStyle]);

  useEffect(()=>{
    setLinkedProperty(properties.find((property)=>property.name === formValues.linked_property));
  }, [formValues.linked_property, properties]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  
//A MODIFIER
  const handleUpdateStyles = (updatedStyle) => {
    const index = styles.findIndex((item) => item === selectedStyle);

    if (index !== -1) {
      const updatedStyles = [...styles];
      updatedStyles[index] = updatedStyle;
      setStyles(updatedStyles);
    }
  };



  const handleFormSubmit = () => {
    handleUpdateStyles(formValues);
    setSelectedStyle(formValues);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Style
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                name="style"
                value={formValues.style}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
                Linked property
            </Form.Label>
            <Col sm={10}>
                <Form.Select
                name="linked_property"
                value={formValues.linked_property}
                onChange={handleChange}
                aria-label="Select a property"
                >
                <option value="" className="text-muted">Select a property</option>
                {(properties||[]).map((property, index) => (
                    <option key={index} value={property.name}>
                    {property.name}
                    </option>
                ))} 
                </Form.Select>
            </Col>
          </Form.Group>
          {linkedProperty && (         
          <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                    Linked value
                </Form.Label>
                <Col sm={10}>
                    <Form.Select
                    name="linked_value"
                    value={formValues.linked_value}
                    onChange={handleChange}
                    aria-label="Select a value"
                    >
                    <option value="" className="text-muted">Select a value</option>
                    {(linkedProperty.possibleValues||[]).map((value,index) => (
                        <option key={index} value={value}>
                        {value}
                        </option>
                    ))}
                    </Form.Select>
                </Col>
            </Form.Group>
          )}

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
