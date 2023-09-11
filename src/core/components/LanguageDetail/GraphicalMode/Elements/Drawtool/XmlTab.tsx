import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import XMLInput from './XMLInput';
import ShapeRenderer from './ShapeRenderer';
import SvgToXmlService from '../../../../../../DataProvider/Services/svgToXmlService';
import GenericFileUploadButton from '../../Utils/FormUtils/UploadButton';


export default function XmlTab({previewXml, setPreviewXml, xml, onXmlChange }) {
  const svgToXmlService = new SvgToXmlService();

  const handleFileChange = async (file) => {
    if (file) {

      try {
        const xmlResult = await svgToXmlService.convertSvgFileToXml(file);
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



  return (
        <Row className="mb-5">
          <Col sm={6}>
            <XMLInput xml={xml} onXmlChange={onXmlChange} />
            <Button variant="secondary" onClick={handlePreview}>
              Preview
            </Button>
          </Col>
          <Col sm={6}>
            <ShapeRenderer shapeXml={previewXml} />
            <GenericFileUploadButton onFileChange={handleFileChange} fileExtensionAccepted={".svg"} />
          </Col>
        </Row>
  );
};

