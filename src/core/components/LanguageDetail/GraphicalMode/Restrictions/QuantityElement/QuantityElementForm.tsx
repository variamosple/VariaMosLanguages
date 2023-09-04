import { Col, Form, Modal, Row } from "react-bootstrap"
import { useLanguageContext } from "../../../../../context/LanguageContext/LanguageContextProvider";
import { useItemEditorContext } from "../../../../../context/LanguageContext/ItemEditorContextProvider";
import ItemSaveButton from "../../Utils/ItemUtils/ItemEditor/ItemSaveButton";

export default function QuantityElementForm ({show}) {
    const {elements} = useLanguageContext();
    const {formValues, handleChange} = useItemEditorContext()
    


    return(
        <Modal show={show} centered size="lg" backdrop="static">
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
                <ItemSaveButton/>
            </Modal.Footer>
        </Modal>
    )
}