import { Shape } from './Shape';

export class Triangle extends Shape {
  protected drawShape(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.strokeStyle = this.lineColor;
    ctx.stroke();
  }

  getType(): string {
    return 'triangle';
  }
}