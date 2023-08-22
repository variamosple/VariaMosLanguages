import { useEffect, useRef, useState} from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import "../GraphicalMode.css";
import DrawTool from "./Drawtool/DrawTool";
import ItemList from "../Utils/ItemList";
import PropertyForm from "../Utils/PropertyForm";

export default function ElementForm({
  show,
  handleClose,
  selectedElement,
  handleUpdateElements
}) {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [formValues, setFormValues] = useState(selectedElement);
  const [showDrawTool, setShowDrawTool] = useState(false);
  const [xml, setXml] = useState("<shape>...</shape>");
  const [properties, setProperties] = useState(formValues.properties || []);
  const [selectedProperty, setSelectedProperty] = useState({});

  useEffect(() => {
    setFormValues(selectedElement);
    setProperties(selectedElement.properties || []);
    if(formValues.draw) {setXml(atob(formValues.draw))}
  }, [selectedElement, setXml,formValues.draw]);


  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleDisplayFileDetails = async () => {
    if (inputRef.current?.files) {
      const file = inputRef.current.files[0];
      setUploadedFileName(file.name);
  
      // Read the file as a data URL (base64)
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Extract the base64 string without the prefix
        const base64WithoutPrefix = base64String.split(",")[1];
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          icon: base64WithoutPrefix, // Set the icon field with the base64 representation
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {
    // Update the selectedElement with the new formValues and properties
    const updatedElement = { ...formValues, properties };
    handleUpdateElements(updatedElement);
    // Close the modal after form submission
    handleClose();
  };

  const handleOpenDrawTool = () => {
    setShowDrawTool(true);
  };

  const handleCloseDrawTool = () => {
    setShowDrawTool(false);
  };

  const handleXmlChange = (xml) => {
    // Set the xml value in the formValues state when the XML is changed in DrawTool
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      draw: btoa(xml), // Update the 'draw' property with the new XML
    }));
    setXml(xml); // Update the local xml state in ElementForm if needed
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
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
            <Modal.Title>{selectedElement?.name}</Modal.Title>
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
                Label
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="label"
                  value={formValues.label || ""}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Draw
              </Form.Label>
              <Col sm={6}>
                <Form.Control 
                name ="draw"
                value={formValues.draw || ""}
                onChange={handleChange}/>
              </Col>
              <Col sm={4} className="d-flex align-items-stretch">
                <Button 
                  variant="outline-secondary" 
                  className="secondary-btn btn-sm flex-grow-1"
                  onClick={handleOpenDrawTool} >
                  Draw tool
                </Button>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Icon
              </Form.Label>
              <Col sm={6}>
                <Form.Control 
                name ="icon"
                value={formValues.icon || ""}
                onChange={handleChange}/>
              </Col>
              <Col sm={4} className="d-flex align-items-stretch flex-grow-1 ">
                <input ref={inputRef} onChange={handleDisplayFileDetails} className="d-none" type="file" />
                <Button onClick={handleUpload} variant="outline-secondary" className="secondary-btn btn-sm flex-grow-1">
                  {uploadedFileName ? uploadedFileName : "Upload file"}
                </Button>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Height
              </Form.Label>
              <Col sm={10}>
                <Form.Control 
                name ="height"
                value={formValues.height || ""}
                type = "number"
                onChange={handleChange}/>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Width
              </Form.Label>
              <Col sm={10}>
                <Form.Control 
                name ="width"
                value={formValues.width || ""}
                type="number"
                onChange={handleChange}/>
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


        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleFormSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <DrawTool
      show={showDrawTool}
      handleClose={handleCloseDrawTool}
      xml={xml} 
      onXmlChange={handleXmlChange}
      />
    </div>
    
  );
}
