import { Modal, Button } from "react-bootstrap";
import XmlTab from "./XmlTab";
import { useEffect, useState } from "react";

export default function Drawtool({ show, handleClose, xml, onXmlChange }) {
  const [previewXml, setPreviewXml] = useState<string | null>(null);
  const [editedXml, setEditedXml] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);

  const handleFormSubmit = () => {
    onXmlChange(editedXml, icon);
    handleClose();
  };

  const onCancel = () => {
    setEditedXml(xml);
    handleClose();
  }

  useEffect(() => {
    setEditedXml(xml);
  }, [xml]);

  const xmlTab_onXmlChange =(xml: string, icon?: string) => {
    setEditedXml(xml);
    setIcon(icon);
  }


  return (
    <Modal show={show} onHide={handleClose} size={"xl"} enforceFocus={false}>
      <Modal.Header closeButton>
        <Modal.Title>Draw Tool</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <XmlTab previewXml={previewXml} setPreviewXml={setPreviewXml} xml={editedXml} onXmlChange={xmlTab_onXmlChange} />
        {/* <Tabs defaultActiveKey="xml" id="uncontrolled-tab" justify className="mb-3">
          <Tab eventKey="xml" title="XML">
            <XmlTab previewXml={previewXml} setPreviewXml={setPreviewXml} xml={xml} onXmlChange={onXmlChange} />
          </Tab>
          {<Tab eventKey="draw" title="Draw SVG">
          </Tab>}
        </Tabs> */}
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-end gap-1"> {/* Align Save Button to the Right */}
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Apply
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}