import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function CustomPatternModal({ show, onSave, onCancel }) {
    const [pattern, setPattern] = useState("5 5");

    const handleSave = () => {
        // Verificación y conversión del patrón a array de números
        const isValidPattern = pattern.match(/^(\d+\s?)+$/);
        if (!isValidPattern) {
          alert("Please enter a valid pattern of numbers separated by spaces (e.g., '5 3 2 6').");
          return;
        }
    
        const patternArray = pattern.split(" ").map(Number);  // Convertir a array de números
        onSave(patternArray);  // Pasar el array al callback
      };

    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Custom Dash Pattern</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Enter dash pattern (e.g., 5 3 2 6)</Form.Label>
                    <Form.Control
                        type="text"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        placeholder="Enter pattern"
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}