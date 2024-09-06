export class Shape {
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor: string;
    lineColor: string;
  
    constructor(
      x: number, 
      y: number, 
      width?: number, 
      height?: number, 
      fillColor: string = "#ffffff",
      lineColor: string = "000000"
    ) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.fillColor = fillColor;
      this.lineColor = lineColor;
    }
  
    draw(ctx: CanvasRenderingContext2D): void {}

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

    // Agregar un nuevo método para obtener los "handles" de redimensionamiento
  getResizeHandles(): { x: number, y: number }[] {
    return [
      { x: this.x, y: this.y },  // Top-left
      { x: this.x + this.width, y: this.y },  // Top-right
      { x: this.x, y: this.y + this.height },  // Bottom-left
      { x: this.x + this.width, y: this.y + this.height }  // Bottom-right
    ];
  }

  // Agregar un método para verificar si el mouse está sobre un "handle"
  isOverHandle(mouseX: number, mouseY: number): boolean {
    const handles = this.getResizeHandles();
    return handles.some(handle => 
      mouseX >= handle.x - 5 && mouseX <= handle.x + 5 && 
      mouseY >= handle.y - 5 && mouseY <= handle.y + 5
    );
  }
}