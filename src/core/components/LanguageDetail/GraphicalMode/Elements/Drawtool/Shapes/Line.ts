
import { Shape } from './Shape';

export class Line extends Shape {
  constructor(x: number, y: number, public x2: number, public y2: number, lineColor: string = '#000000') {
    super(x, y, undefined, undefined, undefined, lineColor);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save(); // Guardar el contexto actual
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y2);
    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  contains(x: number, y: number): boolean {
    const distance = Math.abs((y - this.y) * (this.x2 - this.x) - (x - this.x) * (this.y2 - this.y)) / Math.sqrt(Math.pow(this.x2 - this.x, 2) + Math.pow(this.y2 - this.y, 2));
    return distance < 5;
  }

  getType(): string {
    return 'line';
  }

  // Sobreescribir el método para obtener "handles" específicos de una línea
  getResizeHandles(): { x: number, y: number }[] {
    return [
      { x: this.x, y: this.y },
      { x: this.x2, y: this.y2 }
    ];
  }

  // Sobreescribir el método para verificar si el mouse está sobre un "handle" de la línea
  isOverHandle(mouseX: number, mouseY: number): boolean {
    const handles = this.getResizeHandles();
    return handles.some(handle =>
      Math.abs(mouseX - handle.x) <= 5 && Math.abs(mouseY - handle.y) <= 5
    );
  }
}