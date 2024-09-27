import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { Form, Button } from 'react-bootstrap';

interface EditionToolbarProps {
  onFillColorChange: (color: string) => void;
  onLineColorChange: (color: string) => void;
  onLineStyleChange: (style: string) => void;
}

export default function EditionToolbar({
  onFillColorChange,
  onLineColorChange,
  onLineStyleChange,
}: EditionToolbarProps) {
  const [fillColor, setFillColor] = useState<string>('#000000');
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [lineStyle, setLineStyle] = useState<string>('solid');

  // Control para mostrar el color picker
  const [showFillColorPicker, setShowFillColorPicker] = useState<boolean>(false);
  const [showLineColorPicker, setShowLineColorPicker] = useState<boolean>(false);

  const handleFillColorChange = (color: any) => {
    setFillColor(color.hex);
    onFillColorChange(color.hex);
  };

  const handleLineColorChange = (color: any) => {
    setLineColor(color.hex);
    onLineColorChange(color.hex);
  };

  const handleLineStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLineStyle(event.target.value);
    onLineStyleChange(event.target.value);
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', position: 'relative' }}>
      <h5>Style Options</h5>

      {/* Botón y selector de color de relleno */}
      <div className="mb-3">
        <Button onClick={() => setShowFillColorPicker(!showFillColorPicker)}>
          {showFillColorPicker ? 'Hide Fill Color' : 'Fill Color'}
        </Button>
        {showFillColorPicker && (
          <div style={{ marginTop: '10px', position: 'absolute', zIndex: 1000, top: '120px', left: '10px' }}>
            <SketchPicker color={fillColor} onChangeComplete={handleFillColorChange} />
          </div>
        )}
      </div>

      {/* Botón y selector de color del borde */}
      <div className="mb-3">
        <Button onClick={() => setShowLineColorPicker(!showLineColorPicker)}>
          {showLineColorPicker ? 'Hide Line Color' : 'Line Color'}
        </Button>
        {showLineColorPicker && (
          <div style={{ marginTop: '10px', position: 'absolute', zIndex: 1000, top: '180px', left: '10px' }}>
            <SketchPicker color={lineColor} onChangeComplete={handleLineColorChange} />
          </div>
        )}
      </div>

      {/* Dropdown para estilo de la línea */}
      <div className="mb-3">
        <label>Line Style:</label>
        <Form.Select value={lineStyle} onChange={handleLineStyleChange}>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </Form.Select>
      </div>
    </div>
  );
}