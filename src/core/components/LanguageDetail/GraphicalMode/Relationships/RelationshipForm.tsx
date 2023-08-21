import { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import "../GraphicalMode.css";
import ItemList from "../Utils/ItemList";
import PropertyForm from "../Utils/PropertyForm";
import Select from "react-select";
import { LanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";
import StyleForm from "./StyleForm";
import LabelForm from "./LabelForm";

export default function RelationshipForm({
  show,
  handleClose,
  selectedRelationship,
  handleUpdateRelationships,
}) {
  const {elements} = useContext(LanguageContext);
  const [formValues, setFormValues] = useState(selectedRelationship);
  const [properties, setProperties] = useState(formValues.properties || []);
  const [selectedProperty, setSelectedProperty] = useState({});
  const [styles, setStyles] = useState(formValues.styles|| []);
  const [selectedStyle, setSelectedStyle] = useState({});
  const [labels, setLabels] = useState(formValues.styles|| []);
  const [selectedLabel, setSelectedLabel] = useState({});

  useEffect(() => {
    setFormValues(selectedRelationship);
    setProperties(selectedRelationship.properties || []);
    setStyles(selectedRelationship.styles || []);
    setLabels(selectedRelationship.labels || []);
  }, [selectedRelationship]);

  const elementOptions = (elements).map((element) => element.name);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {
    // Update the selectedRelationship with the new formValues and properties
    const updatedRelationship = { ...formValues, properties, styles, labels };
    handleUpdateRelationships(updatedRelationship);

    // Close the modal after form submission
    handleClose();
  };

  const handleAddProperty = () => {
    const newProperty = {
      name: `Property ${properties.length + 1}`,
      type: "",
      possible_values: [],
      linked_property: "",
      linked_value: "",
    };
    setProperties([...properties, newProperty]);
  };

  const handleAddStyle = () => {
    const newStyle = {
      style: "",
      lindked_property:"",
      linked_value:""
    };
    setStyles([...styles, newStyle]);
  };

  const handleAddLabel = () => {
    const newLabel = {
      align: "",
      style:"",
      offset_x:"",
      offset_y:"",
      label_property:[],
      label_separator:""
    };
    setLabels([...labels, newLabel]);
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{selectedRelationship?.name}</Modal.Title>
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
                Min
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="min"
                  value={formValues.min || ""}
                  onChange={handleChange}
                  type="number"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Max
              </Form.Label>
              <Col sm={10}>
                <Form.Control 
                name ="max"
                value={formValues.max || ""}
                onChange={handleChange}
                type="number"/>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                    Source
                </Form.Label>
                <Col sm={10}>
                    <Form.Select
                    name="source"
                    value={formValues.source || ""}
                    onChange={handleChange}
                    aria-label="Select an element"
                    >
                    <option value="" className="text-muted">Select an element</option>
                    {elements.map((element,index) => (
                        <option key={index} value={element.name}>
                        {element.name}
                        </option>
                    ))}
                    </Form.Select>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                Target
                </Form.Label>
                <Col sm={10}>
                <Select
                    options={elementOptions.map((element) => ({
                      value: element,
                      label: element,
                    }))}
                    value={(formValues.target || []).map((element) => ({
                      value: element,
                      label: element,
                    }))}
                    onChange={(selectedOptions) => {

                      setFormValues((prevFormValues) => ({
                        ...prevFormValues,
                        target: selectedOptions.map((option) => option.value),
                      }));
                    }}
                    isMulti
                    closeMenuOnSelect={false}
                    placeholder="Select element(s)"
                  />
                </Col>
            </Form.Group>
          </Form>

          <h2 style={{
            marginTop: 30,
            marginBottom: 0,
            marginLeft: 5,
            fontSize: 12
          }}>Properties</h2>
          <hr style={{
            marginTop: 0
          }} />

          <ItemList
            items={properties}
            onAdd={handleAddProperty}
            setItems={setProperties}
            label={"property"}
            selectedItem={selectedProperty}
            setSelectedItem={setSelectedProperty}
            renderModal={({ show, onClose }) => (
                  <PropertyForm
                    show={show} 
                    handleClose={onClose}
                    selectedProperty={selectedProperty}
                    setSelectedProperty={setSelectedProperty}
                    properties={properties}
                    setProperties={setProperties}
                  />          
            )}/>

          <h2 style={{
            marginTop: 30,
            marginBottom: 0,
            marginLeft: 5,
            fontSize: 12
          }}>Styles</h2>
          <hr style={{
            marginTop: 0
          }} />
          <ItemList
            items={styles}
            onAdd={handleAddStyle}
            setItems={setStyles}
            label={"style"}
            selectedItem={selectedStyle}
            setSelectedItem={setSelectedStyle}
            renderModal={({ show, onClose }) => (
                  <StyleForm
                    show={show} 
                    handleClose={onClose}
                    selectedStyle={selectedStyle}
                    setSelectedStyle={setSelectedStyle}
                    properties={properties}
                    styles={styles}
                    setStyles={setStyles}
                  />          
            )}/>

          <h2 style={{
            marginTop: 30,
            marginBottom: 0,
            marginLeft: 5,
            fontSize: 12
          }}>Labels</h2>
          <hr style={{
            marginTop: 0
          }} />
          <ItemList
            items={labels}
            onAdd={handleAddLabel}
            setItems={setLabels}
            label={"label"}
            selectedItem={selectedLabel}
            setSelectedItem={setSelectedLabel}
            renderModal={({ show, onClose }) => (
                  <LabelForm
                    show={show} 
                    handleClose={onClose}
                    selectedLabel={selectedLabel}
                    setSelectedLabel={setSelectedLabel}
                    properties={properties}
                    labels={labels}
                    setLabels={setLabels}
                  />          
            )}/>
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