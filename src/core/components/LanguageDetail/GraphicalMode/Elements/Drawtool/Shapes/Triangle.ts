import { Shape } from './Shape';

export class Triangle extends Shape {
  protected drawShape(ctx: CanvasRenderingContext2D): void {
    // Guardar el contexto antes de cualquier operación
    ctx.save();

    // Iniciar un nuevo trazado
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);

    // Cerrar el camino del triángulo
    ctx.closePath();

    // Rellenar el triángulo
    ctx.fillStyle = this.fillColor;
    ctx.fill();

    // Dibujar el borde
    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Restaurar el contexto
    ctx.restore();
  }

  getType(): string {
    return 'triangle';
  }
}