import {Form, Col, Row } from "react-bootstrap";
import "../GraphicalMode.css";
import Select from "react-select";
import { useLanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";
import { useItemEditorContext } from "../../../../context/LanguageContext/ItemEditorContextProvider";


export default function RelationshipForm() {
  const {elements} = useLanguageContext();
  const elementOptions = (elements).map((element) => element.name);
  const {formValues,handleChange} = useItemEditorContext();

  return (
    <div>
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="name"
                  value={formValues.name || ""}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Min
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="min"
                  value={formValues.min}
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
                value={formValues.max}
                onChange={handleChange}
                type="number"/>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                    Source
                </Form.Label>
                <Col sm={10}>
                    <Form.Select
                    name="source"
                    value={formValues.source || ""}
                    onChange={handleChange}
                    aria-label="Select an element"
                    >
                    <option value="" className="text-muted">Select an element</option>
                    {elements.map((element,index) => (
                        <option key={index} value={element.name}>
                        {element.name}
                        </option>
                    ))}
                    </Form.Select>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                Target
                </Form.Label>
                <Col sm={10}>
                <Select
                    options={elementOptions.map((element) => ({
                      value: element,
                      label: element,
                    }))}
                    value={(formValues.target || []).map((element) => ({
                      value: element,
                      label: element,
                    }))}
                    onChange={(selectedOptions) => {
                      const updatedOptions = selectedOptions.map((option) => option.value);
                      handleChange({
                        target: {
                          name: "target",
                          value: updatedOptions,
                        },
                      });
                    }}
                    isMulti
                    closeMenuOnSelect={false}
                    placeholder="Select element(s)"
                  />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
              Label Property
          </Form.Label>
          <Col sm={10}>
              <Form.Select
              name="label_property"
              value={formValues.label_property || ""}
              onChange={handleChange}
              aria-label="Select a property"
              >
              <option value="" className="text-muted">Select a property</option>
              <option value="None" >None</option>
              {formValues.properties.map((property,index) => (
                  <option key={index} value={property.name}>
                  {property.name}
                  </option>
              ))}
              </Form.Select>
          </Col>
        </Form.Group>
          </Form>
    </div>
  );
}