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
      width: number, 
      height: number, 
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
}