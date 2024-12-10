import { Line } from "./Line";
import { Rectangle } from "./Rectangle";
import { Ellipse } from "./Ellipse";
import { Triangle } from "./Triangle";
import { Shape } from "./Shape";
import { Polygon } from "./Polygon";

export class ShapeCollection {
    shapes: Shape[] = [];
    private otherElements: string[] = [];
    shapeAttributes: Record<string, string>;
    connectionsXML: string = "";

    addShape(shape: Shape) {
        this.shapes.push(shape);
    }

    deleteShape(shape: Shape){
        this.shapes = this.shapes.filter(s => s !== shape);
        return this;
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

    getArea(): { x: number, y: number, width: number, height: number } {
        // Inicializamos las variables para encontrar el bounding box de todas las figuras
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
        // Primero, recorremos todas las figuras para calcular el bounding box global
        this.shapes.forEach(shape => {
            switch (shape.getType()) {
                case 'rectangle':
                case 'ellipse':
                    minX = Math.min(minX, shape.x);
                    minY = Math.min(minY, shape.y);
                    maxX = Math.max(maxX, shape.x + shape.width);
                    maxY = Math.max(maxY, shape.y + shape.height);
                    break;
                case 'line':
                    const line = shape as Line;
                    minX = Math.min(minX, line.x, line.x2);
                    minY = Math.min(minY, line.y, line.y2);
                    maxX = Math.max(maxX, line.x, line.x2);
                    maxY = Math.max(maxY, line.y, line.y2);
                    break;
                case 'triangle':
                    const triangle = shape as Triangle;
                    minX = Math.min(minX, triangle.x, triangle.x + triangle.width / 2, triangle.x + triangle.width);
                    minY = Math.min(minY, triangle.y, triangle.y + triangle.height);
                    maxX = Math.max(maxX, triangle.x, triangle.x + triangle.width / 2, triangle.x + triangle.width);
                    maxY = Math.max(maxY, triangle.y, triangle.y + triangle.height);
                    break;
                case 'polygon':
                    const polygon = shape as Polygon;
                    polygon.points.forEach(point => {
                        minX = Math.min(minX, point.x);
                        minY = Math.min(minY, point.y);
                        maxX = Math.max(maxX, point.x);
                        maxY = Math.max(maxY, point.y);
                    });
                    break;
            }
        });
        
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }

    toXML(): string {
        // Inicializamos las variables para encontrar el bounding box de todas las figuras
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
        // Primero, recorremos todas las figuras para calcular el bounding box global
        this.shapes.forEach(shape => {
            switch (shape.getType()) {
                case 'rectangle':
                case 'ellipse':
                    minX = Math.min(minX, shape.x);
                    minY = Math.min(minY, shape.y);
                    maxX = Math.max(maxX, shape.x + shape.width);
                    maxY = Math.max(maxY, shape.y + shape.height);
                    break;
                case 'line':
                    const line = shape as Line;
                    minX = Math.min(minX, line.x, line.x2);
                    minY = Math.min(minY, line.y, line.y2);
                    maxX = Math.max(maxX, line.x, line.x2);
                    maxY = Math.max(maxY, line.y, line.y2);
                    break;
                case 'triangle':
                    const triangle = shape as Triangle;
                    minX = Math.min(minX, triangle.x, triangle.x + triangle.width / 2, triangle.x + triangle.width);
                    minY = Math.min(minY, triangle.y, triangle.y + triangle.height);
                    maxX = Math.max(maxX, triangle.x, triangle.x + triangle.width / 2, triangle.x + triangle.width);
                    maxY = Math.max(maxY, triangle.y, triangle.y + triangle.height);
                    break;
                case 'polygon':
                    const polygon = shape as Polygon;
                    polygon.points.forEach(point => {
                        minX = Math.min(minX, point.x);
                        minY = Math.min(minY, point.y);
                        maxX = Math.max(maxX, point.x);
                        maxY = Math.max(maxY, point.y);
                    });
                    break;
            }
        });
    
        // Calculamos el tamaño del bounding box
        const boundingBoxWidth = maxX - minX;
        const boundingBoxHeight = maxY - minY;
    
        // Factor de escala para ajustar las figuras dentro del cuadro de 100x100
        const scale = 100 / Math.max(boundingBoxWidth, boundingBoxHeight);
    
        // Preparar los atributos
        if (!this.shapeAttributes["name"]) this.shapeAttributes["name"] = "compositeShape";
        if (!this.shapeAttributes["aspect"]) this.shapeAttributes["aspect"] = "variable";
        if (!this.shapeAttributes["strokewidth"]) this.shapeAttributes["strokewidth"] = "inherit";

        let shapeAttrString = "";
        for (const [key, value] of Object.entries(this.shapeAttributes)) {
            shapeAttrString += ` ${key}="${value}"`;
        }

        // Generamos el XML escalando las coordenadas
        let xml = 
        `<shape ${shapeAttrString}>\n ${this.connectionsXML}\n  <background>\n`;
    
        this.shapes.forEach(shape => {
            const strokeColor = shape.lineColor || "#333333";
            const fillColor = shape.fillColor || "#ffffff";
            const lineStyle = shape.lineStyle || [];
            const lineWidth = shape.lineWidth || 1;
            const dashed = lineStyle.length > 0 ? 1 : 0;
            const dashpattern = lineStyle.length > 0 ? lineStyle.join(" ") : "";
    
            switch (shape.getType()) {
                case 'rectangle':
                    xml += `
            <strokecolor color="${strokeColor}"/>
            <fillcolor color="${fillColor}"/>
            <strokewidth width="${lineWidth}"/>
            <dashed dashed="${dashed}"/>
            ${dashed ? `<dashpattern pattern="${dashpattern}"/>` : ""}
            <rect x="${(shape.x - minX) * scale}" y="${(shape.y - minY) * scale}" w="${shape.width * scale}" h="${shape.height * scale}" />
            <fillstroke/>\n`;
                    break;
                case 'ellipse':
                    xml += `
            <strokecolor color="${strokeColor}"/>
            <fillcolor color="${fillColor}"/>
            <strokewidth width="${lineWidth}"/>
            <dashed dashed="${dashed}"/>
            ${dashed ? `<dashpattern pattern="${dashpattern}"/>` : ""}
            <ellipse x="${(shape.x - minX) * scale}" y="${(shape.y - minY) * scale}" w="${shape.width * scale}" h="${shape.height * scale}" />
            <fillstroke/>\n`;
                    break;
                case 'line':
                    const line = shape as Line;
                    xml += `
            <strokecolor color="${strokeColor}"/>
            <strokewidth width="${lineWidth}"/>
            <dashed dashed="${dashed}"/>
            ${dashed ? `<dashpattern pattern="${dashpattern}"/>` : ""}
            <path>
                <move x="${(line.x - minX) * scale}" y="${(line.y - minY) * scale}"/>
                <line x="${(line.x2 - minX) * scale}" y="${(line.y2 - minY) * scale}"/>
            </path>
            <stroke/>\n`;
                    break;
                case 'triangle':
                    const triangle = shape as Triangle;
                    const x1 = (triangle.x - minX) * scale;
                    const y1 = (triangle.y + triangle.height - minY) * scale;
                    const x2 = (triangle.x + triangle.width / 2 - minX) * scale;
                    const y2 = (triangle.y - minY) * scale;
                    const x3 = (triangle.x + triangle.width - minX) * scale;
                    const y3 = (triangle.y + triangle.height - minY) * scale;
    
                    xml += `
            <strokecolor color="${strokeColor}"/>
            <fillcolor color="${fillColor}"/>
            <strokewidth width="${lineWidth}"/>
            <dashed dashed="${dashed}"/>
            ${dashed ? `<dashpattern pattern="${dashpattern}"/>` : ""}
            <path>
                <move x="${x1}" y="${y1}"/>
                <line x="${x2}" y="${y2}"/>
                <line x="${x3}" y="${y3}"/>
                <close/>
            </path>
            <fillstroke/>\n`;
                    break;
                case 'polygon':
                    const polygon = shape as Polygon;
                    xml += `
            <strokecolor color="${strokeColor}"/>
            <fillcolor color="${fillColor}"/>
            <strokewidth width="${lineWidth}"/>
            <dashed dashed="${dashed}"/>
            ${dashed ? `<dashpattern pattern="${dashpattern}"/>` : ""}
            <path>\n`;
    
                    // Movemos el lápiz al primer punto del polígono
                    xml += `            <move x="${(polygon.points[0].x - minX) * scale}" y="${(polygon.points[0].y - minY) * scale}"/>\n`;
    
                    // Dibujamos las líneas entre los puntos
                    for (let i = 1; i < polygon.points.length; i++) {
                        const point = polygon.points[i];
                        xml += `            <line x="${(point.x - minX) * scale}" y="${(point.y - minY) * scale}"/>\n`;
                    }
    
                    if (polygon.isClosed) {
                        xml += `            <close/>\n`;
                    }
    
                    xml += `        </path>\n        <fillstroke/>\n`;
                    break;
            }
        });
        
        xml += `</background>
        <foreground>
            <fillstroke/>`;

        // Añadir las etiquetas de texto al XML
        this.otherElements.forEach(element => xml += `          ${element}\n`);

        xml += `
        </foreground>
        </shape>`;
        return xml;
    }

    // Método para obtener y crear figuras a partir de un XML
    fromXML(xml: string): void {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
    
        // Obtener la etiqueta shape
        const shapeNode = xmlDoc.getElementsByTagName("shape")[0];

        if (shapeNode) {

            // Extraer y almacenar conexiones
            const connectionsNode = shapeNode.getElementsByTagName("connections")[0];
            if (connectionsNode) {
                this.connectionsXML = new XMLSerializer().serializeToString(connectionsNode);
            }

            // Extraer y almacenar atributos de la etiqueta <shape>
            this.shapeAttributes = {};
            for (let i = 0; i < shapeNode.attributes.length; i++) {
                const attr = shapeNode.attributes[i];
                this.shapeAttributes[attr.name] = attr.value;
            }

            const foreground = shapeNode.getElementsByTagName("foreground")[0];
            const background = shapeNode.getElementsByTagName("background")[0];

            if (background) {
                this.parseShapes(background);
            }

            if (foreground) {
                this.parseShapes(foreground);
            }
        }
    }
    
    parseShapes(foreground: Element): void {
        const shapes = foreground.children;
    
        // Variables para almacenar temporalmente los estilos
        let fillColor = "#FFFFFF";
        let strokeColor = "#000000";
        let strokeWidth = 2;
        let lineStyle = [];
    
        for (let shape of Array.from(shapes)) {
            // Detectar si es un elemento de estilo
            switch (shape.tagName) {
                case 'strokecolor':
                    strokeColor = shape.getAttribute('color') || "#000000";
                    break;
                case 'fillcolor':
                    fillColor = shape.getAttribute('color') || "#FFFFFF";
                    break;
                case 'strokewidth':
                    strokeWidth = parseFloat(shape.getAttribute('width') || "2");
                    break;
                case 'dashed':
                    if (shape.getAttribute('dashed') === "1") {
                        lineStyle = lineStyle.length ? lineStyle : [3, 3];
                    }
                    break;
                case 'dashpattern':
                    lineStyle = shape.getAttribute('pattern')?.split(" ").map(Number) || [3, 3];
                    break;
                case 'fillstroke': 
                    // Ignorar
                    break;
    
                // Detectar si es una figura
                case 'rect':
                    this.createRectangle(shape, fillColor, strokeColor, strokeWidth, lineStyle);
                    lineStyle = [];
                    break;
                case 'ellipse':
                    this.createEllipse(shape, fillColor, strokeColor, strokeWidth, lineStyle);
                    lineStyle = [];
                    break;
                case 'path':
                    this.parsePathElement(shape, fillColor, strokeColor, strokeWidth, lineStyle);
                    lineStyle = [];
                    break;

                // Detectar si es texto u otra etiqueta
                default:
                    this.processElement(shape);
                    break;
            }
        }
    }

    parsePathElement(pathNode: Element, fillColor: string, strokeColor: string, strokeWidth: number, lineStyle: number[]): void {
        let points = [];

        for (let child of Array.from(pathNode.children)) {
            const x = parseFloat(child.getAttribute('x') || "0") * 2 + 50;
            const y = parseFloat(child.getAttribute('y') || "0") * 2 + 50;

            switch (child.tagName) {
                case 'ellipse':
                    this.createEllipse(child, fillColor, strokeColor, strokeWidth, lineStyle);
                    break;
                case 'rect':
                    this.createRectangle(child, fillColor, strokeColor, strokeWidth, lineStyle);
                    break;
                case 'move':
                    // Reiniciar puntos al iniciar una nueva figura
                    if (points.length > 0) {
                        this.createAndAddPolygon(points, fillColor, strokeColor, strokeWidth, lineStyle);
                        points = [];
                    }
                    points.push({ x, y });
                    break;

                case 'line':
                    points.push({ x, y });
                    break;

                case 'close':
                    break;
            }
        }

        // Añadir la figura final, evitando duplicación
        if (points.length === 2) {
            const line = new Line(points[0].x, points[0].y, points[1].x, points[1].y, strokeColor);
            line.setLineStyle(this.parseLineStyle(lineStyle));
            line.setLineWidth(strokeWidth);
            this.addShape(line);
        } else if (points.length > 2) {
            this.createAndAddPolygon(points, fillColor, strokeColor, strokeWidth, lineStyle);
        }
    }
    
    // Función para procesar el rectángulo
    createRectangle(shapeNode: Element, fillColor: string, lineColor: string, strokeWidth: number,  lineStyle: number[]): void {
        const scaleFactor = 2;
        const offsetX = 50;
        const offsetY = 50;
        
        const x = (parseFloat(shapeNode.getAttribute('x') || "0") * scaleFactor) + offsetX;
        const y = (parseFloat(shapeNode.getAttribute('y') || "0") * scaleFactor) + offsetY;
        const width = parseFloat(shapeNode.getAttribute('w') || "0") * scaleFactor;
        const height = parseFloat(shapeNode.getAttribute('h') || "0") * scaleFactor;
    
        const rectangle = new Rectangle(x, y, width, height, fillColor, lineColor);
        rectangle.setLineStyle(this.parseLineStyle(lineStyle));
        rectangle.setLineWidth(strokeWidth);
        this.addShape(rectangle);
    }
    
    // Función para procesar la elipse
    createEllipse(shapeNode: Element, fillColor: string, lineColor: string, strokeWidth: number, lineStyle: number[]): void {
        const scaleFactor = 2;
        const offsetX = 50;
        const offsetY = 50;

        const x = (parseFloat(shapeNode.getAttribute('x') || "0") * scaleFactor) + offsetX;
        const y = (parseFloat(shapeNode.getAttribute('y') || "0") * scaleFactor) + offsetY;
        const width = parseFloat(shapeNode.getAttribute('w') || "0")  * scaleFactor;
        const height = parseFloat(shapeNode.getAttribute('h') || "0") * scaleFactor;
    
        const ellipse = new Ellipse(x, y, width, height, fillColor, lineColor);
        ellipse.setLineStyle(this.parseLineStyle(lineStyle));
        ellipse.setLineWidth(strokeWidth);
        this.addShape(ellipse);
    }
    
    // Función auxiliar para crear y añadir un polígono cerrado
    createAndAddPolygon(points: {x: number, y: number}[], fillColor: string, lineColor: string, strokeWidth: number, lineStyle: number[]): void {
        const polygon = new Polygon(points[0].x, points[0].y, fillColor, lineColor);
        polygon.points = points;
        polygon.isClosed = true;
        polygon.setLineStyle(this.parseLineStyle(lineStyle));
        polygon.setLineWidth(strokeWidth);
        this.addShape(polygon);
    }
    
    // Función para convertir el estilo de línea a un formato que el canvas entienda
    parseLineStyle(lineStyle: number[]): string | number[] {
        if (lineStyle.length === 0) return 'solid';
        if (lineStyle[0] === 5 && lineStyle[1] === 5) return 'dashed';
        if (lineStyle[0] === 2 && lineStyle[1] === 2) return 'dotted';
        if (lineStyle[0] === 10 && lineStyle[1] === 10) return 'longDashed';
        return lineStyle;
    }

    // Método para procesar las etiquetas de texto
    processElement(textNode: Element): void {
        // Serializa o almacena el texto de la etiqueta
        this.otherElements.push(textNode.outerHTML);
    }

}
