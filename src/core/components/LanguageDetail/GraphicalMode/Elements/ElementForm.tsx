import {useState} from "react";
import {Button, Form, Col, Row } from "react-bootstrap";
import "../GraphicalMode.css";
import DrawTool from "./Drawtool/DrawTool";
import UploadButton from "../Utils/FormUtils/UploadButton";
import { useItemEditorContext } from "../../../../context/LanguageContext/ItemEditorContextProvider";

export default function ElementForm() {

  const {formValues, handleChange} = useItemEditorContext()
  const [showDrawTool, setShowDrawTool] = useState(false);
  const [xml, setXml] = useState("<shape></shape>");
  
  const handleXmlChange = (xml: string) => {
    setXml(xml);
    handleChange({target:{name : "draw", value : btoa(xml)}});
  };

  const handleOpenDrawtool =() => {
    if(formValues.draw) {
      try {setXml(atob(formValues.draw))}
      catch (e) {}}
    setShowDrawTool(true);
  }

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Extract the base64 string without the prefix
        const base64WithoutPrefix = base64String.split(",")[1];
        handleChange({ target: { name: "icon", value: base64WithoutPrefix } });
      };
      reader.readAsDataURL(file);
  } 

  return (
    <div>
        <div>
          <h5 className="center-text">{formValues.name}</h5>
          <hr></hr>
        </div>
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
          <Col sm={6} >
            <Form.Control 
            name ="icon"
            value={formValues.icon || ""}
            onChange={handleChange}/>
          </Col>
          <Col sm={4} className="d-flex align-items-stretch">
           <UploadButton onFileChange={onFileChange} fileExtensionAccepted={".png"}/>
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
              {(formValues.properties||[]).map((property,index) => (
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
