import React, { useEffect, useState } from 'react';
import { Button, Row, Col, DropdownButton, Dropdown  } from 'react-bootstrap';
import XMLInput from './XMLInput';
import Canvas from './Canvas';
import SvgToXmlService from '../../../../../../DataProvider/Services/svgToXmlService';
import GenericFileUploadButton from '../../Utils/FormUtils/UploadButton';
import ShapeRenderer from "./ShapeRenderer";


export default function XmlTab({ previewXml, setPreviewXml, xml, onXmlChange }) {
  const svgToXmlService = new SvgToXmlService();

  const [viewMode, setViewMode] = useState<'canvas' | 'xml'>('canvas');

  // Manejar el cambio de modo de vista
  const handleSwitchToCanvas = () => setViewMode('canvas');
  const handleSwitchToXml = () => setViewMode('xml');

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
    {/* Dropdown para elegir entre Canvas o XML */}
    <DropdownButton size="sm" title="Mode" variant="primary" id="modeDropdown" className="mb-3">
      <Dropdown.Item onClick={handleSwitchToCanvas}>
        Editor Canvas
      </Dropdown.Item>
      <Dropdown.Item onClick={handleSwitchToXml}>
        Ver XML
      </Dropdown.Item>
    </DropdownButton>

    {/* Renderizar dinámicamente el Canvas o el XML */}
    {viewMode === 'canvas' ? (
      <div>
        <Canvas onXmlChange={XMLInput_onXmlChange} />
      </div>
    ) : (
      <Row>
        <Col md={6}>
          <XMLInput xml={xml} onXmlChange={XMLInput_onXmlChange} />
          <GenericFileUploadButton onFileChange={handleFileChange} fileExtensionAccepted={".svg"} />
        </Col>
        <Col md={6}>
          <ShapeRenderer shapeXml={xml} />
        </Col>
      </Row>
    )}
  </Row>
  );
};

