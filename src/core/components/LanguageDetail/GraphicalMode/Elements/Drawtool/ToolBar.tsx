import React, {useState} from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

interface ToolBarProps {
  onSelectTool: (tool: string) => void;
  onDelete: () => void;
  hasSelectedShape: boolean;
}

export default function ToolBar({ onSelectTool,  onDelete, hasSelectedShape }: ToolBarProps) {

  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleToolClick = (tool: string) => {
    setSelectedTool(tool);
    onSelectTool(tool);
  };

  return (
    <div className="mb-3">
      <ButtonGroup aria-label="Basic example">
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
          Rectangle
        </Button>
        <Button
          variant={selectedTool === 'ellipse' ? 'primary' : 'secondary'}
          onClick={() => handleToolClick('ellipse')}
        >
          Ellipse
        </Button>
        <Button
          variant={selectedTool === 'triangle' ? 'primary' : 'secondary'}
          onClick={() => handleToolClick('triangle')}
        >
          Triangle
        </Button>
        <Button
          variant={selectedTool === 'line' ? 'primary' : 'secondary'}
          onClick={() => handleToolClick('line')}
        >
          Line
        </Button>
        <Button
          variant={selectedTool === 'polygon' ? 'primary' : 'secondary'}
          onClick={() => handleToolClick('polygon')}
        >
          Polygon
        </Button>
        <Button
          variant={hasSelectedShape ? 'danger' : 'secondary'}
          onClick={onDelete}
          disabled={!hasSelectedShape}
        >
          Delete
        </Button>
      </ButtonGroup>
    </div>
  );
}