import { useState, useEffect, useContext } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import { LanguageContext } from "../../../../../context/LanguageContext/LanguageContextProvider";

export default function QuantityElementForm ({
    show,
    handleClose,
    selectedRestriction,
    handleUpdateRestriction}) {
    const {elements} = useContext(LanguageContext);
    const [formValues, setFormValues] = useState(selectedRestriction);
    
    useEffect(() => {
        setFormValues(selectedRestriction);
      }, [selectedRestriction]);

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [name]: value,
    }));
    };

    const handleFormSubmit = () => {
        handleUpdateRestriction(formValues)
        handleClose();
    };

    return(
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Body>
            <Form>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                    Element
                </Form.Label>
                <Col sm={10}>
                    <Form.Select
                    name="element"
                    value={formValues.element ||""}
                    onChange={handleChange}
                    >
                    <option value="" className="text-muted">Select element</option>
                    {elements.map((element, index) => (
                        <option key={index} value={element.name}>
                        {element.name}
                        </option>
                    ))}
                    </Form.Select>

                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Min
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="min"
                  value={formValues.min ||""}
                  onChange={handleChange}
                  type="number"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Max
              </Form.Label>
              <Col sm={10}>
                <Form.Control 
                name ="max"
                value={formValues.max || ""}
                onChange={handleChange}
                type="number"/>
              </Col>
            </Form.Group>

        </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleFormSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}