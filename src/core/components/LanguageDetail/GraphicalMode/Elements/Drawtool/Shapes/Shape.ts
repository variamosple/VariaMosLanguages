export abstract class Shape {
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor: string;
    lineColor: string;
    lineStyle: number[];
    isSelected: boolean;
    lineWidth: number;
  
    constructor(
      x: number, 
      y: number, 
      width?: number, 
      height?: number, 
      fillColor: string = "#ffffff",
      lineColor: string = "#000000",
      lineStyle: number[] = []
    ) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.fillColor = fillColor;
      this.lineColor = lineColor;
      this.lineStyle = lineStyle;
      this.isSelected = false;
      this.lineWidth = 2;
    }
  
    protected abstract drawShape(ctx: CanvasRenderingContext2D): void;

    // Método concreto para dibujar
    draw(ctx: CanvasRenderingContext2D): void {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
      ctx.setLineDash(this.lineStyle);
      this.drawShape(ctx);
      
      ctx.restore();
    }

    // Método para dibujar los handles de redimensionamiento
    drawResizeHandles(ctx: CanvasRenderingContext2D): void {
      const resizeHandles = this.getResizeHandles();
      // const centerX = this.x + this.width / 2;
      // const centerY = this.y + this.height / 2;
    
      resizeHandles.forEach(handle => {
        ctx.fillStyle = '#00BFFF';
        ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
      });
    }

    contains(x: number, y: number): boolean {
      return (
        x >= this.x &&
        x <= this.x + this.width &&
        y >= this.y &&
        y <= this.y + this.height
      );
    }

    getType(): string {
      return 'shape';
    }

    // Método para obtener los "handles" de redimensionamiento
    getResizeHandles(): { x: number, y: number }[] {
      return [
        { x: this.x, y: this.y },  // Top-left
        { x: this.x + this.width, y: this.y },  // Top-right
        { x: this.x, y: this.y + this.height },  // Bottom-left
        { x: this.x + this.width, y: this.y + this.height }  // Bottom-right
      ];
    }

    // Método para verificar si el mouse está sobre un "handle"
    isOverHandle(mouseX: number, mouseY: number): boolean {
      const handles = this.getResizeHandles();
      
      return handles.some(handle => 
        mouseX >= handle.x - 5 && mouseX <= handle.x + 5 &&
        mouseY >= handle.y - 5 && mouseY <= handle.y + 5
      );
    }

    setFillColor(color: string): void {
      this.fillColor = color;
    }

    setLineColor(color: string): void {
      this.lineColor = color;
    }

    setLineStyle(style: string | number[]) {
      if (typeof style === "string") {
        switch (style) {
          case "dashed":
            this.lineStyle = [5, 5];
            break;
          case "dotted":
            this.lineStyle = [2, 2];
            break;
          case "longDashed":
            this.lineStyle = [10, 10];
            break;
          default:
            this.lineStyle = [];
            break;
        }
      } else if (Array.isArray(style)) {
        this.lineStyle = style;
      }
    }

    getLineStyle(): string {
      if (Array.isArray(this.lineStyle)) {
          const styleStr = JSON.stringify(this.lineStyle);
          if (styleStr === JSON.stringify([5, 5])) return "dashed";
          if (styleStr === JSON.stringify([2, 2])) return "dotted";
          if (styleStr === JSON.stringify([10, 10])) return "longDashed";
          return this.lineStyle.length === 0 ? "solid" : "custom";
      }
      return "solid";
  }  

    setLineWidth(width: number): void {
      this.lineWidth = width;
    }
}