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
                    xml +=`   
        <strokecolor color="#333333"/>
        <fillcolor color="#ffffff"/>
        <rect x="${shape.x}" y="${shape.y}" w="${shape.width}" h="${shape.height}" />\n
        <fillstroke/>
        `;
                    break;
                case 'ellipse':
                    xml += 
                    `   <strokecolor color="#333333"/>
                        <fillcolor color="#ffffff"/>
                        <ellipse x="${shape.x}" y="${shape.y}" w="${shape.width}" h="${shape.height}" />\n
                        <fillstroke/>`;
                    break;
            }
        });

        xml += `  </foreground>\n</shape>`;
        return xml;
    }
}
