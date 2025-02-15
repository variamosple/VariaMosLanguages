import { Modal, Button, DropdownButton, Dropdown } from "react-bootstrap";
import XmlTab from "./XmlTab";
import { useEffect, useState } from "react";

export default function Drawtool({ show, handleClose, xml, overlays, onXmlChange }) {
  const [previewXml, setPreviewXml] = useState<string | null>(null);
  const [editedXml, setEditedXml] = useState<string | null>(null);
  const [editedOverlays, setEditedOverlays] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'canvas' | 'xml'>('canvas');

  const handleFormSubmit = () => {
    onXmlChange(editedXml, icon, editedOverlays);
    handleClose();
  };

  const onCancel = () => {
    setEditedXml(xml);
    setEditedOverlays(overlays);
    handleClose();
  }

  useEffect(() => {
    setEditedXml(xml);
    setEditedOverlays(overlays);
  }, [xml, overlays]);

  const xmlTab_onXmlChange =(xml: string, icon?: string, overlays?: string) => {
    setEditedXml(xml);
    setIcon(icon);
    setEditedOverlays(overlays);
  }


  return (
    <Modal show={show} onHide={handleClose} size={"xl"} enforceFocus={false}>
      <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
        <Modal.Title className="flex-grow-1">Draw Tool</Modal.Title>

        <DropdownButton size="sm" title="Mode" variant="primary" id="modeDropdown" className="me-3">
          <Dropdown.Item onClick={() => setViewMode('canvas')}>
            Canvas Editor
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setViewMode('xml')}>
            XML Textual Editor
          </Dropdown.Item>
        </DropdownButton>
      </Modal.Header>

      <Modal.Body>
        <XmlTab 
          previewXml={previewXml} 
          setPreviewXml={setPreviewXml} 
          xml={editedXml} 
          overlays={editedOverlays}
          onXmlChange={xmlTab_onXmlChange} 
          viewMode={viewMode} 
        />
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