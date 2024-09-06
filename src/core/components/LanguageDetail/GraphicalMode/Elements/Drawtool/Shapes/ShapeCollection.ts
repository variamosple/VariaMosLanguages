import { Line } from "./Line";
import { Triangle } from "./Triangle";
import { Shape } from "./Shape";

export class ShapeCollection {
    shapes: Shape[] = [];

    addShape(shape: Shape) {
        this.shapes.push(shape);
    }

    toJSON(): any {
        return this.shapes.map(shape => ({
            type: shape.getType(),
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
            fillColor: shape.fillColor
        }));
    }

    toXML(): string {
        let xml = `<shape name="compositeShape" aspect="variable" strokewidth="inherit">\n  <foreground>\n`;

        this.shapes.forEach(shape => {
            switch (shape.getType()) {
                case 'rectangle':
                    xml += `   
        <strokecolor color="#333333"/>
        <fillcolor color="#ffffff"/>
        <rect x="${shape.x}" y="${shape.y}" w="${shape.width}" h="${shape.height}" />
        <fillstroke/>\n
        `;
                    break;
                case 'ellipse':
                    xml += `   
        <strokecolor color="#333333"/>
        <fillcolor color="#ffffff"/>
        <ellipse x="${shape.x}" y="${shape.y}" w="${shape.width}" h="${shape.height}" />
        <fillstroke/>\n
        `;
                    break;
                case 'line':
                    const line = shape as Line; // Asegurarse de que es una instancia de Line
                    xml += `   
        <strokecolor color="${line.lineColor}"/>
        <path>
            <move x="${line.x}" y="${line.y}"/>
            <line x="${line.x2}" y="${line.y2}"/>
        </path>
        <stroke/>\n
        `;
                    break;
                case 'triangle':
                    const triangle = shape as Triangle;
                    const x1 = triangle.x;
                    const y1 = triangle.y + triangle.height;
                    const x2 = triangle.x + triangle.width / 2;
                    const y2 = triangle.y;
                    const x3 = triangle.x + triangle.width;
                    const y3 = triangle.y + triangle.height;

                    xml += `
                        <strokecolor color="#333333"/>
                        <fillcolor color="#ffffff"/>
                        <path>
                            <move x="${x1}" y="${y1}"/>
                            <line x="${x2}" y="${y2}"/>
                            <line x="${x3}" y="${y3}"/>
                            <close/>
                        </path>
                        <fillstroke/>
                    `;
                    break;
            }
        });

        xml += `  </foreground>\n</shape>`;
        return xml;
    }
}
