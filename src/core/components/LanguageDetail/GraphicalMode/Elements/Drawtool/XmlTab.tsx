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

  const handleRectangleShape = (e) => {
    let xml = `<shape aspect="variable" strokewidth="inherit">
    <background>
      <strokecolor color="#333333"/>
      <fillcolor color="#ffffff"/>
      <strokewidth width="3" fixed="1"/>
      <path>
              <move x="0" y="0"/>
              <line x="100" y="0"/>
              <line x="100" y="100"/>
              <line x="0" y="100"/>
              <line x="0" y="0"/>
              <close/> 
          </path>	 
    </background>
    <foreground>
      <fillstroke/>
    </foreground>
  </shape>`;
    onXmlChange(xml);
    return;
  };

  const handleCircleShape = (e) => {
    let xml = `<shape aspect="variable" strokewidth="inherit" >
        <background>
          <strokecolor color="#333333"/>
          <fillcolor color="#ffffff"/>
          <strokewidth width="3" fixed="1"/>
          <ellipse x="0" y="0" w="100" h="100" />	
          <fillstroke/>
        </background>
        <foreground>
          <fillstroke/>
        </foreground>
      </shape>`;
    onXmlChange(xml);
    return;
  };



  return (
    <Row className="mb-5">
      <Col sm={6}>
        <XMLInput xml={xml} onXmlChange={XMLInput_onXmlChange} />
        <GenericFileUploadButton onFileChange={handleFileChange} fileExtensionAccepted={".svg"} />
        <br />
        <div> {/* Align Save Button to the Right */}
          <Button variant="secondary" onClick={handleRectangleShape} size='sm'>
            Rectangle
          </Button>
          {" "}
          <Button variant="secondary" onClick={handleCircleShape} size='sm'>
            Circle
          </Button>
        </div>
      </Col>
      <Col sm={6}>
        <ShapeRenderer shapeXml={previewXml} />
      </Col>
    </Row>
  );
};

