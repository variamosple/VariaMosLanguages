import React, { useState } from "react";
import { Form, Button, ListGroup, Col, Row } from "react-bootstrap";
import "../../GraphicalMode.css";
import { Trash } from "react-bootstrap-icons";


export default function MultiValueForm ({selectedItems, setSelectedItems}) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddItem = () => {
    if (inputValue.trim() !== "" && !selectedItems.includes(inputValue)) {
      setSelectedItems([...selectedItems, inputValue]);
      setInputValue("");
    }
  };

  const handleRemoveItem = (item: string) => {
    const updatedItems = selectedItems.filter((selectedItem) => selectedItem !== item);
    setSelectedItems(updatedItems);
  };

  return (
    <div>
      <Form.Group as={Row}>
        <Col sm={2}>
          <Button className="secondary-btn" onClick={handleAddItem} variant="outline-secondary">Add</Button>
        </Col>
        <Col sm={10}>
        <Form.Control
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter value"
          />
        </Col>
      </Form.Group>
      <Row>
        <Col sm={2}></Col>
        <Col sm={10}>
          <ListGroup>
            {selectedItems.map((item, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between">
                {item}{" "}
                <Button
                variant="outline-secondary"
                onClick={() => handleRemoveItem(item)}
                className="flex-grow-0 trash-btn btn-sm"
              >
                <Trash className="trash" />
              </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>  
      </Row>
    </div>
  );
};

