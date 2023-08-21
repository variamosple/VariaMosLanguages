import { useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import XMLInput from "./XMLInput";
import ShapeRenderer from "./ShapeRenderer"; 
import axios from "axios";


interface DrawToolProps {
  show: boolean;
  handleClose: () => void;
  xml: string;
  onXmlChange: (xml: string) => void;
}

export default function DrawTool({ show, handleClose, xml, onXmlChange }: DrawToolProps) {
  const [previewXml, setPreviewXml] = useState<string | null>(null);

  const handlePreview = () => {
    setPreviewXml(xml);
  };

  const handleFormSubmit = () => {
    onXmlChange(previewXml!);
    handleClose();
  };

  // const [file, setFile] = useState(null);
  // const [xmlResult, setXmlResult] = useState('');

  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0]);
  // };

  // const handleConvertClick = async () => {
  //   if (!file) {
  //     console.log('No file selected.');
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append('svgFile', file);

  //     const response = await axios.post('/api/convert', formData, {
  //       baseURL: 'http://localhost:8080',  // L'URL de votre application Spring Boot
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });

  //     setXmlResult(response.data);
  //   } catch (error) {
  //     console.error('Error converting SVG to XML:', error);
  //   }
  // };

  return (
    <Modal show={show} onHide={handleClose} size="lg" dialogClassName="draw-tool-modal">
      <Modal.Header closeButton>
        <Modal.Title>Draw Tool</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col sm={6}>
            <XMLInput xml={xml} onXmlChange={onXmlChange} />
            <Button variant="secondary" onClick={handlePreview}>
              Preview
            </Button>
          </Col>
          <Col sm={6}>
            <ShapeRenderer shapeXml={previewXml}/>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleFormSubmit}>
          Save
        </Button>
        {/* <div>
        <input type="file" accept=".svg" onChange={handleFileChange} />
        <button onClick={handleConvertClick}>Convert SVG</button>

        <div>
          <h2>Converted XML:</h2>
          <pre>{xmlResult}</pre>
        </div>
        </div> */}
      </Modal.Footer>
    </Modal>
  );
}
