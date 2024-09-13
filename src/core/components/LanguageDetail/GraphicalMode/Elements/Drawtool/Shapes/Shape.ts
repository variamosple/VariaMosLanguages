export abstract class Shape {
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor: string;
    lineColor: string;
    rotation: number;
  
    constructor(
      x: number, 
      y: number, 
      width?: number, 
      height?: number, 
      fillColor: string = "#ffffff",
      lineColor: string = "000000",
      rotation: number = 0
    ) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.fillColor = fillColor;
      this.lineColor = lineColor;
      this.rotation = rotation;
    }
  
    protected abstract drawShape(ctx: CanvasRenderingContext2D): void;

    // Método concreto para dibujar con rotación
    draw(ctx: CanvasRenderingContext2D): void {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.rotation);
      ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
      
      this.drawShape(ctx);
      
      ctx.restore();
    }

    // Método para dibujar la selección alrededor de la figura
    drawSelection(ctx: CanvasRenderingContext2D): void {
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00BFFF';
      this.draw(ctx);
      ctx.stroke();
      ctx.restore();
    }

    // Método para dibujar los handles de redimensionamiento
    drawResizeHandles(ctx: CanvasRenderingContext2D): void {
      this.getResizeHandles().forEach(handle => {
        ctx.fillStyle = '#00BFFF';
        ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
      });
    }

    // Método para dibujar el handle de rotación
    drawRotationHandle(ctx: CanvasRenderingContext2D): void {
      const handle = this.getRotationHandle();
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#00BFFF';
      ctx.fill();
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

    getRotationHandle(): { x: number, y: number } {
      return { x: this.x + this.width / 2, y: this.y - 20 };
    }
  
    isOverRotationHandle(mouseX: number, mouseY: number): boolean {
      const handle = this.getRotationHandle();
      return Math.sqrt((mouseX - handle.x)**2 + (mouseY - handle.y)**2) <= 5;
    }
}