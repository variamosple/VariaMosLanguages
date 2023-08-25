import {useRef, useState} from "react";
import {Button, Form, Col, Row } from "react-bootstrap";
import "../GraphicalMode.css";
import DrawTool from "./Drawtool/DrawTool";

export default function ElementForm({
    formValues,
    handleChange,
    properties
}) {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showDrawTool, setShowDrawTool] = useState(false);
  const [xml, setXml] = useState("<shape></shape>");

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
        handleChange({ target: { name: "icon", value: base64WithoutPrefix } });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleXmlChange = (xml) => {
    setXml(xml);
    handleChange({ target: { name: "draw", value: btoa(xml) } });
  };

  const handleOpenDrawtool =() => {
    if(formValues.draw) {
      try {setXml(atob(formValues.draw))}
      catch (e) {}}
    setShowDrawTool(true);
  }

  return (
    <div>
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
              onClick={handleOpenDrawtool} >
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
            <Button onClick={handleUpload} variant="outline-secondary" className="secondary-btn input-btn btn-sm flex-grow-1">
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
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
              Label Property
          </Form.Label>
          <Col sm={10}>
              <Form.Select
              name="label_property"
              value={formValues.label_property || ""}
              onChange={handleChange}
              aria-label="Select a property"
              >
              <option value="" className="text-muted">Select a property</option>
              <option value="None" >None</option>
              {properties.map((property,index) => (
                  <option key={index} value={property.name}>
                  {property.name}
                  </option>
              ))}
              </Form.Select>
          </Col>
        </Form.Group>
      </Form>

      <DrawTool
      show={showDrawTool}
      handleClose={() => setShowDrawTool(false)}
      xml={xml} 
      onXmlChange={handleXmlChange}
      />
    </div>
  );
}
