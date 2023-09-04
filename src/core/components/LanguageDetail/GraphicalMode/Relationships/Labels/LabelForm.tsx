import { Modal, Form, Col, Row } from "react-bootstrap";
import "../../GraphicalMode.css";
import Select from "react-select";
import { useItemEditorContext } from "../../../../../context/LanguageContext/ItemEditorContextProvider";
import ItemSaveButton from "../../Utils/ItemUtils/ItemEditor/ItemSaveButton";


export default function LabelForm({
  show,
  properties,
}) {
  const {formValues, setFormValues, handleChange} = useItemEditorContext()
  console.log(formValues);

  return (
    <Modal show={show} centered size="lg">
      <Modal.Body>
        <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                  Align
              </Form.Label>
              <Col sm={10}>
              <Form.Select
              name="align"
              value={formValues.align}
              onChange={handleChange}
              aria-label=""
              >
              <option value="" className="text-muted"></option>
              <option value="left">left</option>
              <option value="right">right</option>
              </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Style
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                name="style"
                value={formValues.style}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Offset x
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="offset_x"
                  value={formValues.offset_x}
                  onChange={handleChange}
                  type="number"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Offset y
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="offset_y"
                  value={formValues.offset_y}
                  onChange={handleChange}
                  type="number"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
                Label property
            </Form.Label>
            <Col sm={10}>
            <Select
            options={properties.map((property) => ({
                value: property.name,
                label: property.name,
            }))}
            value={(formValues.label_property || []).map((property) => ({
                value: property,
                label: property,
            }))}
            onChange={(selectedOptions) => {
                const selectedValues = selectedOptions.map((option) => option.value);
                setFormValues((prevFormValues) => ({
                ...prevFormValues,
                label_property: selectedValues,
                }));
            }}
            isMulti
            closeMenuOnSelect={false}
            placeholder="Select element(s)"
            />

            </Col>
          </Form.Group>
          
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <ItemSaveButton/>
      </Modal.Footer>
    </Modal>
  );
};
