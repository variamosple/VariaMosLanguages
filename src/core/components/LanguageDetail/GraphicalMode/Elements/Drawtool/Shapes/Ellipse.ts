import { Shape } from './Shape';

export class Ellipse extends Shape {
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.ellipse(
      this.x + this.width / 2,
      this.y + this.height / 2,
      Math.abs(this.width) / 2,
      Math.abs(this.height) / 2,
      0,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.stroke();
  }

  getType(): string {
    return 'ellipse';
  }
}
