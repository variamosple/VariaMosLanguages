import { Shape } from './Shape';

export class Ellipse extends Shape {
  protected drawShape(ctx: CanvasRenderingContext2D): void {
    // Guardar el contexto para no afectar otros dibujos
    ctx.save();

    // Iniciar un nuevo trazado
    ctx.beginPath();
    ctx.ellipse(
      this.x + this.width / 2,    // Centro en X
      this.y + this.height / 2,   // Centro en Y
      Math.abs(this.width) / 2,   // Radio en X
      Math.abs(this.height) / 2,  // Radio en Y
      0,                          // Rotación (sin rotación en este caso)
      0,
      2 * Math.PI                 // Ángulo total de 360 grados
    );

    // Rellenar la elipse
    ctx.fillStyle = this.fillColor;
    ctx.fill();

    // Dibujar el borde
    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cerrar el trazado y restaurar el contexto
    ctx.closePath();
    ctx.restore();
  }

  getType(): string {
    return 'ellipse';
  }
}
