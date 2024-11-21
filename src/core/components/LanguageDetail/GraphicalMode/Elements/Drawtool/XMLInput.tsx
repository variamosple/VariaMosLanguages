import React from "react";
import { Form, Row, Col } from "react-bootstrap";

interface XMLInputProps {
  xml: string;
  onXmlChange: (xml: string, icon?: string) => void;
}

export default function XMLInput({ xml, onXmlChange }: XMLInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    onXmlChange(value);
  };

  return (
    <Form.Group as={Row} className="mb-3">
      <Col>
        <Form.Control
          as="textarea"
          rows={15} // Increased the number of rows to increase the height
          value={xml}
          onChange={handleChange}
        />
      </Col>
    </Form.Group>
  );
}
