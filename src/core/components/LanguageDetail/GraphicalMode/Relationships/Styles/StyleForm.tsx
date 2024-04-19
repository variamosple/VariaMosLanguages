import { useEffect, useState } from "react";
import { Modal, Form, Col, Row, Button} from "react-bootstrap";
import "../../GraphicalMode.css";
import { propertyType } from "../../Utils/PropertyForm";
import { useItemEditorContext } from "../../../../../context/LanguageContext/ItemEditorContextProvider";
import ItemSaveButton from "../../Utils/ItemUtils/ItemEditor/ItemSaveButton";
import StyleTool from "./StyleTool/StyleTool";


export default function StyleForm({
  show,
  properties
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {formValues, setFormValues, handleChange} = useItemEditorContext();
  const [linkedProperty, setLinkedProperty] = useState<propertyType>();
  const [showStyleTool, setShowStyleTool] = useState(false);
  // const setStyle = (newStyle) => {
  //   setFormValues((prev) => ({
  //     ...prev,
  //     style: newStyle,
  //   }));
  // };
  

  useEffect(()=>{
    if (properties) {
      setLinkedProperty(properties.find((property)=>property.name === formValues.linked_property));
    }
  }, [formValues.linked_property, properties]);

  const handleOpenStyleTool=() => {setShowStyleTool(true)};

  return (
    <Modal show={show}>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Style
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                name="style"
                value={formValues.style}
                onChange={handleChange}
              />
            </Col>
            <Col sm={4} className="d-flex align-items-stretch">
              <Button 
                variant="outline-secondary" 
                className="secondary-btn btn-sm flex-grow-1"
                onClick={handleOpenStyleTool} >
                Style tool
              </Button>
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
        <ItemSaveButton/>
      </Modal.Footer>
      <StyleTool show={showStyleTool} handleClose={()=>setShowStyleTool(false)} />
    </Modal>
  );
};
