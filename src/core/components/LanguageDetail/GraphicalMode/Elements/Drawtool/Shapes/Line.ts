
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
    // Implementar lógica simple para detectar clics cercanos a la línea (opcional).
    const distance = Math.abs((y - this.y) * (this.x2 - this.x) - (x - this.x) * (this.y2 - this.y)) / Math.sqrt(Math.pow(this.x2 - this.x, 2) + Math.pow(this.y2 - this.y, 2));
    return distance < 5; // margen de 5 píxeles
  }

  getType(): string {
    return 'line';
  }
}