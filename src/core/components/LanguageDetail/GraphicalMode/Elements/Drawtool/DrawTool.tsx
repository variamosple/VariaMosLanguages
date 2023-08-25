import React, { useState } from 'react';
import { Modal, Button, Col, Row } from 'react-bootstrap';
import XMLInput from './XMLInput';
import ShapeRenderer from './ShapeRenderer';
import SvgToXmlService from '../../../../../../DataProvider/Services/svgToXmlService';

interface DrawToolProps {
  show: boolean;
  handleClose: () => void;
  xml: string;
  onXmlChange: (xml: string) => void;
}

const DrawTool: React.FC<DrawToolProps> = ({ show, handleClose, xml, onXmlChange }) => {
  const [previewXml, setPreviewXml] = useState<string | null>(null);
  const svgToXmlService = new SvgToXmlService();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {

      try {
        const xmlResult = await svgToXmlService.convertSvgFileToXml(selectedFile);
        setPreviewXml(xmlResult);
        onXmlChange(xmlResult); // Update XML input value
      } catch (error) {
        console.error('Error converting SVG to XML: ', error);
      }
    }
  };

  const handlePreview = () => {
    setPreviewXml(xml);
  };

  const handleFormSubmit = () => {
    onXmlChange(previewXml!);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" dialogClassName="draw-tool-modal">
      <Modal.Header closeButton>
        <Modal.Title>Draw Tool</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col sm={6}>
            <XMLInput xml={previewXml || xml} onXmlChange={onXmlChange} />
            <Button variant="secondary" onClick={handlePreview}>
              Preview
            </Button>
          </Col>
          <Col sm={6}>
            <ShapeRenderer shapeXml={previewXml} />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-start"> {/* Align Upload Button to the Left */}
          <div>
            <input type="file" accept=".svg" onChange={handleFileChange} />
          </div>
        </div>
        <div className="d-flex justify-content-end"> {/* Align Save Button to the Right */}
          <Button variant="primary" onClick={handleFormSubmit}>
            Save
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DrawTool;
