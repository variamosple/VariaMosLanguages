import { useEffect, useState } from "react";
import { Modal, Form, Col, Row, FormLabel, FormCheck } from "react-bootstrap";
import MultiValueForm from "./FormUtils/MultiValueForm";
import "../GraphicalMode.css";
import { useItemEditorContext } from "../../../../context/LanguageContext/ItemEditorContextProvider";
import ItemSaveButton from "./ItemUtils/ItemEditor/ItemSaveButton";
import useFirstRender from "../../../../hooks/useFirstRender";
export type propertyType = {
  name: string;
  type: string;
  possibleValues: string[];
  comment: string;
  linked_property: string;
  linked_value: string;
}
export default function PropertyForm({ show }) {
  const [linkedProperty, setLinkedProperty] = useState<propertyType>();
  const { formValues, setFormValues, handleChange, selectedItem: selectedProperty, items: properties } = useItemEditorContext()
  const [Range, setRange] = useState({ isRangeSelected: false, min: "", max: "" })
  const isFirstRender = useFirstRender();

  useEffect(() => {
    if (isFirstRender) {
      const possibleValues = formValues.possibleValues;
      if (possibleValues.length === 1) {
        const rangeMatch = possibleValues[0].match(/^(\d+)\.\.(\d+)$/);
        if (rangeMatch) {
          const min = rangeMatch[1];
          const max = rangeMatch[2];
          setRange({
            isRangeSelected: true,
            min: min,
            max: max,
          });
        }
      }
    }
  }, [isFirstRender, formValues]);

  useEffect(() => {
    if (Range.isRangeSelected && Range.min && Range.max) {
      setFormValues((prev) => ({
        ...prev,
        possibleValues: [`${Range.min}..${Range.max}`]
      }))
    }
  }, [Range, setFormValues])

  useEffect(() => {
    setLinkedProperty(properties.find((property) => property.name === formValues.linked_property));
  }, [formValues.linked_property, properties]);

  const handleChangeRange = (e) => {
    const { name, value } = e.target;
    setRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeIsRangeSelected = (event) => {
    const { checked } = event.target;
    setRange((prev) => ({
      ...prev,
      isRangeSelected: checked
    }));
  }

  const handlePossibleValuesChange = (selectedItems: string[]) => {
    handleChange({ target: { name: "possibleValues", value: selectedItems } });
  };

  return (
    <Modal show={show} centered size="lg">
      <Modal.Header>
        <Modal.Title>{formValues.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Name
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                name="name"
                value={formValues.name || ""}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Type
            </Form.Label>
            <Col sm={9}>
              <Form.Select
                name="type"
                value={formValues.type || ""}
                onChange={handleChange}
                aria-label="Select a type"
              >
                <option value="" className="text-muted">Select a type</option>
                {["String", "Integer", "Boolean"].map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3"  >
            {Range.isRangeSelected ?
              (<Row className="mb-3">
                <Form.Label column sm={3}>Min</Form.Label>
                <Col>
                  <Form.Control type="number" name="min" value={Range.min} onChange={handleChangeRange}></Form.Control>
                </Col>
                <Form.Label column sm={3} className="text-end">Max</Form.Label>
                <Col>
                  <Form.Control type="number" name="max" value={Range.max} onChange={handleChangeRange}></Form.Control>
                </Col>
              </Row>)
              :
              (<Row>
                <FormLabel column sm={3}>
                  Possible Values
                </FormLabel>
                <Col sm={9}>
                  <MultiValueForm
                    selectedItems={formValues.possibleValues || []}
                    setSelectedItems={handlePossibleValuesChange} />
                </Col>
              </Row>
              )}
            <Row className="mb-3 align-items-start" >
              <Col sm={3}>
                <Form.Label>Range</Form.Label>
              </Col>
              <Col className="justify-content-start" >
                <FormCheck
                  name="range"
                  type="checkbox"
                  checked={Range.isRangeSelected}
                  onChange={handleChangeIsRangeSelected}
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Comment
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                name="comment"
                value={formValues.comment || ""}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Linked property
            </Form.Label>
            <Col sm={9}>
              <Form.Select
                name="linked_property"
                value={formValues.linked_property || ""}
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
              <Form.Label column sm={3}>
                Linked value
              </Form.Label>
              <Col sm={9}>
                <Form.Select
                  name="linked_value"
                  value={formValues.linked_value || ""}
                  onChange={handleChange}
                  aria-label="Select a value"
                >
                  <option value="" className="text-muted">Select a value</option>
                  {linkedProperty.possibleValues.map((value, index) => (
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
        <ItemSaveButton />
      </Modal.Footer>
    </Modal>
  );
}
