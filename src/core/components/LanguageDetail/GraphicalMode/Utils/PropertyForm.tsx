import { useEffect, useState } from "react";
import { Modal, Button, Form, Col, Row, FormLabel } from "react-bootstrap";
import MultiValueForm from "./MultiValueForm";
import "../GraphicalMode.css";
import { propertyType } from "../../index.types";

export default function PropertyForm({
  show,
  handleClose,
  selectedProperty,
  setSelectedProperty,
  properties,
  setProperties
}) {
  const [formValues, setFormValues] = useState<propertyType>(selectedProperty);
  const [linkedProperty, setLinkedProperty] = useState<propertyType>();
  // const [isRangeSelected, setIsRangeSelected] = useState(false);

  useEffect(() => {
    setFormValues(selectedProperty);
  }, [selectedProperty]);

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

  const handlePossibleValuesChange = (selectedItems: string[]) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      possibleValues: selectedItems,
    }));
  };

  const handleUpdateProperties = (updatedProperty) => {
    const index = properties.findIndex((item) => item === selectedProperty);

    if (index !== -1) {
      const updatedProperties = [...properties];
      updatedProperties[index] = updatedProperty;
      setProperties(updatedProperties);
    }
  };



  const handleFormSubmit = () => {
    // Update the selectedProperty with the new formValues
    handleUpdateProperties(formValues);
    setSelectedProperty({});
    // Close the modal after form submission
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>{formValues.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Name
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                name="name"
                value={formValues.name || ""}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
                Type
            </Form.Label>
            <Col sm={10}>
                <Form.Select
                name="type"
                value={formValues.type ||""}
                onChange={handleChange}
                aria-label="Select a type"
                >
                <option value="" className="text-muted">Select a type</option>
                {["String","Integer","Boolean"].map((type, index) => (
                    <option key={index} value={type}>
                    {type}
                    </option>
                ))} 
                </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3"  >
            <FormLabel column sm={2}>
              Possible Values
            </FormLabel>
            <Col sm={10}>
              <MultiValueForm
              selectedItems={formValues.possibleValues || []}
              setSelectedItems={handlePossibleValuesChange}/>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Comment
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                name="comment"
                value={formValues.comment || ""}
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
                value={formValues.linked_property ||""}
                onChange={handleChange}
                aria-label="Select a property"
                >
                <option value="" className="text-muted">Select a property</option>
                {properties.filter((property) => property.name !== selectedProperty?.name).map((property, index) => (
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
                    value={formValues.linked_value ||""}
                    onChange={handleChange}
                    aria-label="Select a value"
                    >
                    <option value="" className="text-muted">Select a value</option>
                    {linkedProperty.possibleValues.map((value,index) => (
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
