import React, { useEffect, useRef, useState } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { MdOutlineRectangle } from "react-icons/md";
import { IoEllipseOutline, IoTriangleOutline, IoColorFill, IoColorPaletteOutline  } from "react-icons/io5";
import { FaMinus } from "react-icons/fa6";
import { TbPolygon, TbBorderStyle2  } from "react-icons/tb";
import { SketchPicker } from 'react-color';

interface ToolBarProps {
  onSelectTool: (tool: string) => void;
  onDelete: () => void;
  hasSelectedShape: boolean;
  onFillColorChange: (color: string) => void;
  onLineColorChange: (color: string) => void;
  onLineStyleChange: (style: string) => void;
}

export default function ToolBar({
  onSelectTool,
  onDelete,
  hasSelectedShape,
  onFillColorChange,
  onLineColorChange,
  onLineStyleChange
}: ToolBarProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [fillColor, setFillColor] = useState<string>('#000000');
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [lineStyle, setLineStyle] = useState<string>('solid');
  const [showFillColorPicker, setShowFillColorPicker] = useState<boolean>(false);
  const [showLineColorPicker, setShowLineColorPicker] = useState<boolean>(false);

  const fillColorPickerRef = useRef<HTMLDivElement | null>(null);
  const lineColorPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (fillColorPickerRef.current && !fillColorPickerRef.current.contains(event.target as Node)) ||
        (lineColorPickerRef.current && !lineColorPickerRef.current.contains(event.target as Node))
      ) {
        setShowFillColorPicker(false);
        setShowLineColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToolClick = (tool: string) => {
    setSelectedTool(tool);
    onSelectTool(tool);
  };

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

  const toggleFillColorPicker = () => {
    setShowFillColorPicker((prevShowFillColorPicker) => {
      if (prevShowFillColorPicker) {
        return false;
      }
      setShowLineColorPicker(false);
      return true;
    });
  };

  const toggleLineColorPicker = () => {
    setShowLineColorPicker((prevShowLineColorPicker) => {
      if (prevShowLineColorPicker) {
        return false;
      }
      setShowFillColorPicker(false);
      return true;
    });
  };
  

  return (
    <div className="mb-3">
      {/* Primera fila: herramientas de formas */}
      <ButtonGroup aria-label="Shape tools">
        <Button
          variant={selectedTool === 'select' ? 'primary' : 'secondary'}
          onClick={() => handleToolClick('select')}
        >
          Select
        </Button>
        <Button
          variant={selectedTool === 'rectangle' ? 'primary' : 'secondary'}
          onClick={() => handleToolClick('rectangle')}
        >
          <MdOutlineRectangle />
        </Button>
        <Button
          variant={selectedTool === 'ellipse' ? 'primary' : 'secondary'}
          onClick={() => handleToolClick('ellipse')}
        >
          <IoEllipseOutline />
        </Button>
        <Button
          variant={selectedTool === 'triangle' ? 'primary' : 'secondary'}
          onClick={() => handleToolClick('triangle')}
        >
          <IoTriangleOutline />
        </Button>
        <Button
          variant={selectedTool === 'line' ? 'primary' : 'secondary'}
          onClick={() => handleToolClick('line')}
        >
          <FaMinus />
        </Button>
        <Button
          variant={selectedTool === 'polygon' ? 'primary' : 'secondary'}
          onClick={() => handleToolClick('polygon')}
        >
          <TbPolygon />
        </Button>
        <Button
          variant={hasSelectedShape ? 'danger' : 'secondary'}
          onClick={onDelete}
          disabled={!hasSelectedShape}
        >
          Delete
        </Button>
      </ButtonGroup>

      {/* Segunda fila: opciones de edición */}
      <div className="d-flex mt-3 align-items-center">
        {/* Botón y picker de color de relleno */}
        <ButtonGroup>
          <Button
            variant={showFillColorPicker ? 'primary' : 'secondary'}
            onClick={toggleFillColorPicker}
          >
            <IoColorFill />
          </Button>
          {showFillColorPicker && (
            <div ref={fillColorPickerRef} style={{ marginTop: '80px', position: 'absolute', zIndex: 1000 }}>
              <SketchPicker color={fillColor} onChangeComplete={handleFillColorChange} />
            </div>
          )}
          {/* Botón y picker de color de borde */}
          <Button
            variant={showLineColorPicker ? 'primary' : 'secondary'}
            onClick={toggleLineColorPicker}
          >
            <IoColorPaletteOutline  />
          </Button>
          {showLineColorPicker && (
            <div ref={lineColorPickerRef} style={{ marginTop: '80px', position: 'absolute', zIndex: 1000 }}>
              <SketchPicker color={lineColor} onChangeComplete={handleLineColorChange} />
            </div>
          )}
        </ButtonGroup>

        {/* Dropdown de estilo de línea */}
        <div className="ms-3">
          <TbBorderStyle2 size={24} />
          <select
            className="form-select d-inline-block ms-2"
            style={{ width: '120px' }}
            value={lineStyle}
            onChange={handleLineStyleChange}
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>
      </div>
    </div>
  );
}