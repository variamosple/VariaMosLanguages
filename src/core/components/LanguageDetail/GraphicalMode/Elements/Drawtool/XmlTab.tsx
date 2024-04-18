import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import XMLInput from './XMLInput';
import ShapeRenderer from './ShapeRenderer';
import SvgToXmlService from '../../../../../../DataProvider/Services/svgToXmlService';
import GenericFileUploadButton from '../../Utils/FormUtils/UploadButton';


export default function XmlTab({ previewXml, setPreviewXml, xml, onXmlChange }) {
  const svgToXmlService = new SvgToXmlService();

  // Este efecto se ejecutará cada vez que el estado "data" cambie
  useEffect(() => {
    setPreviewXml(xml);
  }, [xml]);

  useEffect(() => {
    setPreviewXml(xml);
  }, [previewXml]);

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

  const XMLInput_onXmlChange = (xml) => {
    onXmlChange(xml);
    return;
  };



  return (
    <Row className="mb-5">
      <Col sm={6}>
        <XMLInput xml={xml} onXmlChange={XMLInput_onXmlChange} />
        <GenericFileUploadButton onFileChange={handleFileChange} fileExtensionAccepted={".svg"} /> 
      </Col>
      <Col sm={6}>
        <ShapeRenderer shapeXml={previewXml} />
      </Col>
    </Row>
  );
};

