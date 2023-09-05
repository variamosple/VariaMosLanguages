import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, FormCheck, Row } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import "../../../GraphicalMode.css";

export default function StyleEditor({ style, setStyle }) {
  const [styleOptions, setStyleOptions] = useState({
    strokeColor: "",
    shape: "",
    strokeWidth: "",
    startSize: "",
    endSize: "",
    sourcePerimeterSpacing: "",
    targetPerimeterSpacing: "",
    opacity: "",
    shadow: false,
    edgeStyle: "",
    startFill: true,
    endFill: true,
    sourcePortConstraint: "",
    targetPortConstraint: "",
    arcSize:"",
    startArrow:"",
    endArrow:"",
    dashed:false,
    dashSize:"",
    dashSpacing:""
  });

  function formatStyleString(styleOptions) {
    let styleString = "";

    for (const key in styleOptions) {
      let value = styleOptions[key];

      if (value === true) {
        value = 1;
      }
      if (value === false) {
        value = 0;
      }

      if (value !== "") {
        styleString += `${key}=${value};`;
      }
    }
      if (styleOptions.dashSize && styleOptions.dashSpacing) {
        styleString += `dashPattern=${styleOptions.dashSize} ${styleOptions.dashSpacing};`;
      }


    return styleString;
  }

  const formatStyle = useCallback(() => {
    setStyle(formatStyleString(styleOptions));
  }, [styleOptions, setStyle]);
  
  useEffect(() => {
    formatStyle();
  }, [formatStyle]);

  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setStyleOptions((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorChange = (color) => {
    setStyleOptions((prev) => ({
      ...prev,
      strokeColor: color.hex,
    }));
  };
  

  return (
    <Form>
      <Row className="mb-3">
        <Col xs={2}>
          <Form.Label>Stroke color</Form.Label>
        </Col>
        <Col>
          <div>
            <Button className="secondary-btn" variant="outline-secondary" type="button" onClick={toggleColorPicker}>
              Color picker
            </Button>
            {showColorPicker && (
              <SketchPicker
                color={styleOptions.strokeColor}
                onChangeComplete={handleColorChange}
              />
            )}
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
      <Col >
          <Form.Label>Start arrow</Form.Label>
        </Col>
        <Col xs={4}>
          <Form.Select
          name="startArrow"
          onChange={handleChange}
          value={styleOptions.startArrow}>
          {["classic","classicThin","open","openThin","block","blockThin","oval","diamond","diamondThin"].map((arrow,index)=>
          <option key={index} value={arrow}>{arrow}</option>)}
          </Form.Select>
        </Col>
        <Col >
          <Form.Label>End arrow</Form.Label>
        </Col>
        <Col xs={4}>
          <Form.Select
          name="endArrow"
          onChange={handleChange}
          value={styleOptions.endArrow}>
          {["classic","classicThin","open","openThin","block","blockThin","oval","diamond","diamondThin"].map((arrow,index)=>
          <option key={index} value={arrow}>{arrow}</option>)}
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Label>Shape</Form.Label>
        </Col>
        <Col xs={4}>
          <Form.Select
            name="shape"
            onChange={handleChange}
            value={styleOptions.shape}
          >
            <option value={""}> default </option>
            <option value={"arrow"}> arrow </option>
          </Form.Select>
        </Col>
        <Col >
          <Form.Label>Edge Style</Form.Label>
        </Col>
        <Col xs={4}>
          <Form.Select
            name="edgeStyle"
            onChange={handleChange}
            value={styleOptions.edgeStyle}
          >
            <option value={""}> default </option>
            <option value={"orthogonalEdgeStyle"}> Orthogonal </option>
            <option value={"elbowEdgeStyle"}> Elbow </option>
            <option value={"elbowEdgeStyle;elbow=vertical"}> Elbow vertical </option>
            <option value={"orthogonalEdgeStyle;elbow=vertical;curved=1;rounded=0"}> Curved </option>
            <option value={"orthogonalEdgeStyle;elbow=vertical;curved=0;rounded=1"}> Rounded </option>
            <option value={"entityRelationEdgeStyle;elbow=vertical;rounded=0"}> Entity Relation </option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col >
          <Form.Label>Stroke width</Form.Label>
        </Col>
        <Col >
          <Form.Control
            name="strokeWidth"
            type="number"
            value={styleOptions.strokeWidth}
            onChange={handleChange}
          />
        </Col>
        <Col >
          <Form.Label>Start Size</Form.Label>
        </Col>
        <Col >
          <Form.Control
            name="startSize"
            type="number"
            value={styleOptions.startSize}
            onChange={handleChange}
          />
        </Col>

        <Col >
          <Form.Label>End Size</Form.Label>
        </Col>
        <Col >
          <Form.Control
            name="endSize"
            type="number"
            value={styleOptions.endSize}
            onChange={handleChange}
          />
        </Col>
        </Row>

      <Row className="mb-3">
      <Col >
          <Form.Label>Source Perimeter Spacing</Form.Label>
        </Col>
        <Col >
          <Form.Control
            name="sourcePerimeterSpacing"
            type="number"
            value={styleOptions.sourcePerimeterSpacing}
            onChange={handleChange}
          />
        </Col>
        <Col >
          <Form.Label>Target Perimeter Spacing</Form.Label>
        </Col>
        <Col >
          <Form.Control
            name="targetPerimeterSpacing"
            type="number"
            value={styleOptions.targetPerimeterSpacing}
            onChange={handleChange}
          />
        </Col>
        <Col >
          <Form.Label>Opacity (%)</Form.Label>
        </Col>
        <Col >
          <Form.Control
            name="opacity"
            type="number"
            min="0"
            max="100"
            step="10"
            value={styleOptions.opacity}
            onChange={handleChange}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xs={2}>
          <Form.Label>Dashed</Form.Label>
        </Col>
        <Col xs={2}>
          <FormCheck
            name="dashed"
            type="checkbox"
            checked={styleOptions.dashed}
            onChange={handleChange}
          />
        </Col>
        <Col xs={2}>
          <Form.Label>Dash Size</Form.Label>
        </Col>
        <Col xs={2}>
          <Form.Control
            name="dashSize"
            type="number"
            value={styleOptions.dashSize}
            onChange={handleChange}
          />
        </Col>
        <Col xs={2}>
          <Form.Label>Dash Spacing</Form.Label>
        </Col>
        <Col xs={2}>
          <Form.Control
            name="dashSpacing"
            type="number"
            value={styleOptions.dashSpacing}
            onChange={handleChange}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col >
          <Form.Label>Shadow</Form.Label>
        </Col>
        <Col >
          <FormCheck
            name="shadow"
            type="checkbox"
            checked={styleOptions.shadow}
            onChange={handleChange}
          />
        </Col>
        <Col >
          <Form.Label>Start Fill</Form.Label>
        </Col>
        <Col >
          <FormCheck
            name="startFill"
            type="checkbox"
            checked={styleOptions.startFill}
            onChange={handleChange}
          />
        </Col>

        <Col >
          <Form.Label>End Fill</Form.Label>
        </Col>
        <Col >
          <FormCheck
            name="endFill"
            type="checkbox"
            checked={styleOptions.endFill}
            onChange={handleChange}
          />
        </Col>
    </Row>
    <Row className="mb-3">
        <Col xs={3}>
          <Form.Label>Source port constraint</Form.Label>
        </Col>
        <Col xs={3}>
          <Form.Select
            name="sourcePortConstraint"
            onChange={handleChange}
            value={styleOptions.sourcePortConstraint}
          >
            <option value={""}> None </option>
            <option value={"north"}> North </option>
            <option value={"east"}> East </option>
            <option value={"south"}> South </option>
            <option value={"west"}> West </option>
          </Form.Select>
        </Col>

        <Col xs={3}>
          <Form.Label>Target port constraint</Form.Label>
        </Col>
        <Col xs={3}>
          <Form.Select
            name="targetPortConstraint"
            onChange={handleChange}
            value={styleOptions.targetPortConstraint}
          >
            <option value={""}> None </option>
            <option value={"north"}> North </option>
            <option value={"east"}> East </option>
            <option value={"south"}> South </option>
            <option value={"west"}> West </option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
      <Col xs={2}>
          <Form.Label>Arc Size</Form.Label>
        </Col>
        <Col xs={2} >
          <Form.Control
            name="arcSize"
            type="number"
            value={styleOptions.arcSize}
            onChange={handleChange}
          />
        </Col>
      </Row>
    </Form>
  );
}
