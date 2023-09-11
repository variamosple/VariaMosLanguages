import { Tabs, Tab, Modal, Button } from "react-bootstrap";
import XmlTab from "./XmlTab";
import { useState } from "react";

export default function Drawtool({ show, handleClose, xml, onXmlChange }) {
  const [previewXml, setPreviewXml] = useState<string | null>(null);

  const handleFormSubmit = () => {
    onXmlChange(xml);
    handleClose();
  };
  return(
    <Modal show={show} onHide={handleClose} size={"xl"}>
      <Modal.Header closeButton>
        <Modal.Title>Draw Tool</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Tabs defaultActiveKey="xml" id="uncontrolled-tab" justify className="mb-3">
        <Tab eventKey="draw" title="Draw SVG">
        </Tab>
        <Tab eventKey="xml" title="XML">
          <XmlTab previewXml={previewXml} setPreviewXml={setPreviewXml} xml={xml} onXmlChange={onXmlChange}/>
        </Tab>
      </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-end"> {/* Align Save Button to the Right */}
          <Button variant="primary" onClick={handleFormSubmit}>
            Save
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}