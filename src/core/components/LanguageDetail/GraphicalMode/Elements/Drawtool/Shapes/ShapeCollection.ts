import { Line } from "./Line";
import { BezierCurve } from "./BezierCurve";
import { Rectangle } from "./Rectangle";
import { Ellipse } from "./Ellipse";
import { Triangle } from "./Triangle";
import { Shape } from "./Shape";
import { Polygon } from "./Polygon";
import { TextElement } from "./TextElement";

export class ShapeCollection {
    shapes: Shape[] = [];
    private otherElements: string[] = [];
    shapeAttributes: Record<string, string>;
    connectionsXML: string = "";
    connectorsCount: number = 0;
    scale: number;

    constructor(scale: number = 1) {
        this.scale = scale;
    }

    getScaleFactor(): number {
        return this.scale;
    }

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
                case 'curve':
                    const curve = shape as BezierCurve;
                
                    // Puntos iniciales y finales
                    const points = [
                        { x: curve.x, y: curve.y },
                        { x: curve.x2, y: curve.y2 }
                    ];
                
                    // Derivada para X e Y
                    const getBezierDerivativeRoots = (p0: number, p1: number, p2: number, p3: number): number[] => {
                        const a = -3 * p0 + 9 * p1 - 9 * p2 + 3 * p3;
                        const b = 6 * p0 - 12 * p1 + 6 * p2;
                        const c = -3 * p0 + 3 * p1;
                
                        const roots = [];
                        if (a === 0) { // Ecuación cuadrática (si 'a' es cero)
                            if (b !== 0) {
                                roots.push(-c / b);
                            }
                        } else { // Ecuación cuadrática normal
                            const discriminant = b * b - 4 * a * c;
                            if (discriminant >= 0) {
                                const sqrtDisc = Math.sqrt(discriminant);
                                roots.push((-b + sqrtDisc) / (2 * a));
                                roots.push((-b - sqrtDisc) / (2 * a));
                            }
                        }
                
                        return roots.filter(t => t >= 0 && t <= 1); // Solo valores entre 0 y 1
                    };
                
                    // Calcular raíces para X e Y
                    const rootsX = getBezierDerivativeRoots(curve.x, curve.controlPoint1.x, curve.controlPoint2.x, curve.x2);
                    const rootsY = getBezierDerivativeRoots(curve.y, curve.controlPoint1.y, curve.controlPoint2.y, curve.y2);
                
                    // Evaluar puntos críticos en la curva
                    const evaluateBezier = (t: number, p0: number, p1: number, p2: number, p3: number): number => {
                        return Math.pow(1 - t, 3) * p0 +
                                3 * Math.pow(1 - t, 2) * t * p1 +
                                3 * (1 - t) * Math.pow(t, 2) * p2 +
                                Math.pow(t, 3) * p3;
                    };
                
                    rootsX.forEach(t => {
                        points.push({ 
                            x: evaluateBezier(t, curve.x, curve.controlPoint1.x, curve.controlPoint2.x, curve.x2),
                            y: evaluateBezier(t, curve.y, curve.controlPoint1.y, curve.controlPoint2.y, curve.y2)
                        });
                    });
                
                    rootsY.forEach(t => {
                        points.push({ 
                            x: evaluateBezier(t, curve.x, curve.controlPoint1.x, curve.controlPoint2.x, curve.x2),
                            y: evaluateBezier(t, curve.y, curve.controlPoint1.y, curve.controlPoint2.y, curve.y2)
                        });
                    });
                
                    // Calcular límites
                    points.forEach(point => {
                        minX = Math.min(minX, point.x);
                        minY = Math.min(minY, point.y);
                        maxX = Math.max(maxX, point.x);
                        maxY = Math.max(maxY, point.y);
                    });
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
                default:
                    minX = minY = maxX = maxY = 0
                    break;
            }
        });
        
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }

    toXML(): string {
        // Inicializamos la variable de escalado y el desplazamiento y los textos
        const scale = 1/3;
        this.scale = scale;
        const offset = 100;
        let textElements: TextElement[] = [];

        this.shapeAttributes = this.shapeAttributes || {};
        // Preparar los atributos
        if (!this.shapeAttributes["name"]) this.shapeAttributes["name"] = "compositeShape";
        if (!this.shapeAttributes["aspect"]) this.shapeAttributes["aspect"] = "variable";
        if (!this.shapeAttributes["strokewidth"]) this.shapeAttributes["strokewidth"] = "inherit";

        let shapeAttrString = "";
        for (const [key, value] of Object.entries(this.shapeAttributes)) {
            shapeAttrString += ` ${key}="${value}"`;
        }

        // Generamos el XML escalando las coordenadas y ajustando el desplazamiento
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
            <rect x="${(shape.x - offset) * scale}" y="${(shape.y - offset) * scale}" w="${shape.width * scale}" h="${shape.height * scale}" />
            <fillstroke/>\n`;
                    break;
                case 'ellipse':
                    xml += `
            <strokecolor color="${strokeColor}"/>
            <fillcolor color="${fillColor}"/>
            <strokewidth width="${lineWidth}"/>
            <dashed dashed="${dashed}"/>
            ${dashed ? `<dashpattern pattern="${dashpattern}"/>` : ""}
            <ellipse x="${(shape.x - offset) * scale}" y="${(shape.y - offset) * scale}" w="${shape.width * scale}" h="${shape.height * scale}" />
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
                <move x="${(line.x - offset) * scale}" y="${(line.y - offset) * scale}"/>
                <line x="${(line.x2 - offset) * scale}" y="${(line.y2 - offset) * scale}"/>
            </path>
            <stroke/>\n`;
                    break;
                case 'curve':
                    const curve = shape as BezierCurve;
                    xml += `
            <strokecolor color="${strokeColor}"/>
            <strokewidth width="${lineWidth}"/>
            <dashed dashed="${dashed}"/>
            ${dashed ? `<dashpattern pattern="${dashpattern}"/>` : ""}
            <path>
                <move x="${(curve.x - offset) * scale}" y="${(curve.y - offset) * scale}"/>
                <curve x1="${(curve.controlPoint1.x - offset) * scale}" y1="${(curve.controlPoint1.y - offset) * scale}" x2="${(curve.controlPoint2.x - offset) * scale}" y2="${(curve.controlPoint2.y - offset) * scale}" x3="${(curve.x2 - offset) * scale}" y3="${(curve.y2 - offset) * scale}"/>
            </path>
            <stroke/>\n`;
                    break;
                case 'triangle':
                    const triangle = shape as Triangle;
                    const x1 = (triangle.x - offset) * scale;
                    const y1 = (triangle.y + triangle.height - offset) * scale;
                    const x2 = (triangle.x + triangle.width / 2 - offset) * scale;
                    const y2 = (triangle.y - offset) * scale;
                    const x3 = (triangle.x + triangle.width - offset) * scale;
                    const y3 = (triangle.y + triangle.height - offset) * scale;
    
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
                    xml += `            <move x="${(polygon.points[0].x - offset) * scale}" y="${(polygon.points[0].y - offset) * scale}"/>\n`;
    
                    // Dibujamos las líneas entre los puntos
                    for (let i = 1; i < polygon.points.length; i++) {
                        const point = polygon.points[i];
                        xml += `            <line x="${(point.x - offset) * scale}" y="${(point.y - offset) * scale}"/>\n`;
                    }
    
                    if (polygon.isClosed) {
                        xml += `            <close/>\n`;
                    }
    
                    xml += `        </path>\n        <fillstroke/>\n`;
                    break;
                case 'text':
                    textElements.push(shape as TextElement);
                    break;
            }
        });
        
        xml += `</background>
        <foreground>
            <fillstroke/>`;

        // Añadir las etiquetas de texto
        let previousFontSize = 0;
        textElements.forEach(textElement => {
            const scaledFontSize = textElement.fontSize * scale;

            // Comparar si el tamaño de la fuente es el mismo que el anterior
            if (scaledFontSize !== previousFontSize) {
                previousFontSize = scaledFontSize;
                xml += `
                <fontsize size="${scaledFontSize}"/>\n`;
            }
            xml += `
            <text str="${textElement.content}" x="${(textElement.x - offset) * scale}" y="${(textElement.y - offset - textElement.fontSize) * scale}"/>\n
            `;
        });
        // Añadir las otras etiquetas que no tengan soporte
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
                
                // Contar el número de conectores
                const constraintNodes = connectionsNode.getElementsByTagName("constraint");
                this.countConnectors(constraintNodes);
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

        let fontSize = 16;
    
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

                case 'fontsize':
                    fontSize = parseFloat(shape.getAttribute('size') || "16");
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
                case 'text':
                    this.createText(shape, fontSize);
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
        const scaleFactor = 3;
        const offsetX = 100;
        const offsetY = 100;

        let currentPoint: { x: number, y: number } | null = null; // Punto actual de la curva

        for (let child of Array.from(pathNode.children)) {
            const x = parseFloat(child.getAttribute('x') || "0") * scaleFactor + offsetX;
            const y = parseFloat(child.getAttribute('y') || "0") * scaleFactor + offsetY;

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
                    currentPoint = { x, y };
                    break;

                case 'line':
                    points.push({ x, y });
                    break;
                
                case 'curve':
                    const x1 = parseFloat(child.getAttribute('x1') || "0") * scaleFactor + offsetX;
                    const y1 = parseFloat(child.getAttribute('y1') || "0") * scaleFactor + offsetY;
                    const x2 = parseFloat(child.getAttribute('x2') || "0") * scaleFactor + offsetX;
                    const y2 = parseFloat(child.getAttribute('y2') || "0") * scaleFactor + offsetY;
                    const x3 = parseFloat(child.getAttribute('x3') || "0") * scaleFactor + offsetX;
                    const y3 = parseFloat(child.getAttribute('y3') || "0") * scaleFactor + offsetY;
                    
                    // Crear la curva de Bezier
                    const curve = new BezierCurve(
                        currentPoint.x, 
                        currentPoint.y, 
                        x3, 
                        y3, 
                        strokeColor, 
                        { x: x1, y: y1 }, 
                        { x: x2, y: y2 }
                    );
                    curve.setLineStyle(this.parseLineStyle(lineStyle));
                    curve.setLineWidth(strokeWidth);
                    this.addShape(curve);

                    // Actualizar el punto actual al punto final de la curva
                    currentPoint = { x: x3, y: y3 };
                    break;

                case 'close':
                    currentPoint = null;
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
        const scaleFactor = 3;
        const offsetX = 100;
        const offsetY = 100;
        
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
        const scaleFactor = 3;
        const offsetX = 100;
        const offsetY = 100;

        const x = (parseFloat(shapeNode.getAttribute('x') || "0") * scaleFactor) + offsetX;
        const y = (parseFloat(shapeNode.getAttribute('y') || "0") * scaleFactor) + offsetY;
        const width = parseFloat(shapeNode.getAttribute('w') || "0")  * scaleFactor;
        const height = parseFloat(shapeNode.getAttribute('h') || "0") * scaleFactor;
    
        const ellipse = new Ellipse(x, y, width, height, fillColor, lineColor);
        ellipse.setLineStyle(this.parseLineStyle(lineStyle));
        ellipse.setLineWidth(strokeWidth);
        this.addShape(ellipse);
    }

    // Función para crear textos
    createText(textElement: Element, fontSize: number): void {
        // Escalar y desplazar el texto
        const scaleFactor = 3;
        const offsetX = 100;
        const offsetY = 100;

        // Recuperar el contenido del texto y otras propiedades
        const content = textElement.getAttribute('str') || "";
        const fontFamily = textElement.getAttribute('fontfamily') || "Arial";
        fontSize = fontSize * scaleFactor;       

        const x = (parseFloat(textElement.getAttribute('x') || "0") * scaleFactor) + offsetX;
        const y = (parseFloat(textElement.getAttribute('y') || "0") * scaleFactor) + offsetY + fontSize;

        // Crear el elemento de texto
        const text = new TextElement(x, y, content, fontSize, fontFamily);
        this.addShape(text);
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

    countConnectors(constraintNodes: HTMLCollectionOf<Element>): void {
        // Inicializar el contador de conectores
        this.connectorsCount = 0;

        // Retornar si no hay nodos de conexión
        if (constraintNodes.length === 0) {
            this.connectorsCount = 0;
            return;
        };

        // Contar el número de conectores
        for (let i = 0; i < constraintNodes.length; i++) {
            const constraint = constraintNodes[i];
            const x = constraint.getAttribute("x");
            const y = constraint.getAttribute("y");

            // Verifica si los valores de x e y son 0, 0.5, o 1
            if (["0", "0.25", "0.5", "0.75", "1"].includes(x) && ["0", "0.25", "0.5", "0.75", "1"].includes(y)) {
                this.connectorsCount++;
            }
        }
    }

    changeConnections(newConnections: number): void {
        // Verificar si el número de conectores no cambió
        if (newConnections === this.connectorsCount) return;

        if (!this.connectionsXML.includes('<connections>')) {
            this.connectionsXML += '\n<connections>\n</connections>';
        }
    
        // Función para verificar si una constraint ya existe en connectionsXML
        const constraintExists = (x: string, y: string): boolean => {
            const regex = new RegExp(`<constraint x="${x}" y="${y}" perimeter="0"/>`);
            return regex.test(this.connectionsXML);
        };
    
        // Función para agregar una nueva constraint si no existe
        const addConstraint = (x: string, y: string): void => {
            if (!constraintExists(x, y)) {
                const newConstraint = `<constraint x="${x}" y="${y}" perimeter="0"/>`;
                const closingTag = '</connections>';
                // Insertar antes del cierre de la etiqueta <connections>
                this.connectionsXML = this.connectionsXML.replace(closingTag, `    ${newConstraint}\n${closingTag}`);
            }
        };
    
        // Función para eliminar todas las constraints que coincidan con los valores predeterminados
        const removeDefaultConstraints = (defaultConstraints: Array<{ x: string; y: string }>): void => {
            // Crear un Set con las constraints predeterminadas (para comparación rápida)
            const defaultSet = new Set(
                defaultConstraints.map(({ x, y }) => `<constraint x="${x}" y="${y}" perimeter="0"/>`)
            );
        
            // Extraer solo las constraints personalizadas (no en el set predeterminado)
            const connectionsMatch = this.connectionsXML.match(/<connections>([\s\S]*?)<\/connections>/);
            if (connectionsMatch) {
                const allConstraints = connectionsMatch[1]
                    .trim()
                    .split(/\n/)
                    .filter((line) => line.trim() !== "");
        
                const customConstraints = allConstraints.filter((line) => !defaultSet.has(line.trim()));
        
                // Si hay constraints personalizadas, reconstruir la etiqueta <connections>
                if (customConstraints.length > 0) {
                    const newConnections = `<connections>\n    ${customConstraints.join("\n    ")}\n</connections>`;
                    this.connectionsXML = this.connectionsXML.replace(/<connections>[\s\S]*?<\/connections>/, newConnections);
                } else {
                    // Si no hay constraints personalizadas, eliminar toda la etiqueta <connections>
                    this.connectionsXML = this.connectionsXML.replace(/<connections>[\s\S]*?<\/connections>/, "");
                }
            }
        };          
    
        // Casos para agregar más conectores
        if (newConnections > this.connectorsCount) {
            switch (newConnections) {
                case 4:
                    // Agregar los conectores centrales
                    [
                        { x: "0.5", y: "0" },
                        { x: "0.5", y: "1" },
                        { x: "0", y: "0.5" },
                        { x: "1", y: "0.5" }
                    ].forEach(({ x, y }) => addConstraint(x, y));
                    break;
                case 8:
                    // Agregar los conectores centrales y las esquinas
                    [
                        { x: "0.5", y: "0" },
                        { x: "0.5", y: "1" },
                        { x: "0", y: "0.5" },
                        { x: "1", y: "0.5" },
                        { x: "0", y: "0" },
                        { x: "1", y: "0" },
                        { x: "1", y: "1" },
                        { x: "0", y: "1" }
                    ].forEach(({ x, y }) => addConstraint(x, y));
                    break;
                case 16:
                    // Agregar todos los conectores
                    [
                        { x: "0.5", y: "0" },
                        { x: "0.5", y: "1" },
                        { x: "0", y: "0.5" },
                        { x: "1", y: "0.5" },
                        { x: "0", y: "0" },
                        { x: "1", y: "0" },
                        { x: "1", y: "1" },
                        { x: "0", y: "1" },
                        { x: "0.25", y: "0.25" },
                        { x: "0.75", y: "0.25" },
                        { x: "0.25", y: "0.75" },
                        { x: "0.75", y: "0.75" },
                        { x: "0", y: "0.25" },
                        { x: "1", y: "0.25" },
                        { x: "1", y: "0.75" },
                        { x: "0", y: "0.75" }
                    ].forEach(({ x, y }) => addConstraint(x, y));
                    break;
            }
        }
    
        // Casos para eliminar conectores
        if (newConnections < this.connectorsCount) {
            switch (newConnections) {
                case 0:
                    // Eliminar todas las constraints predeterminadas, conservar las personalizadas
                    const defaultConstraints = [
                        { x: "0.5", y: "0" },
                        { x: "0.5", y: "1" },
                        { x: "0", y: "0.5" },
                        { x: "1", y: "0.5" },
                        { x: "0", y: "0" },
                        { x: "1", y: "0" },
                        { x: "1", y: "1" },
                        { x: "0", y: "1" },
                        { x: "0.25", y: "0.25" },
                        { x: "0.75", y: "0.25" },
                        { x: "0.25", y: "0.75" },
                        { x: "0.75", y: "0.75" },
                        { x: "0", y: "0.25" },
                        { x: "1", y: "0.25" },
                        { x: "1", y: "0.75" },
                        { x: "0", y: "0.75" }
                    ];
                    removeDefaultConstraints(defaultConstraints);
                    break;
                case 4:
                    // Eliminar las esquinas, conservar los puntos centrales y las personalizadas
                    const cornerConstraints = [
                        { x: "0", y: "0" },
                        { x: "1", y: "0" },
                        { x: "1", y: "1" },
                        { x: "0", y: "1" }
                    ];
                    removeDefaultConstraints(cornerConstraints);
                    break;
                case 8:
                    // Eliminar los conectores del 25% y 75%, conservar los puntos centrales y las personalizadas
                    const quarterConstraints = [
                        { x: "0.25", y: "0.25" },
                        { x: "0.75", y: "0.25" },
                        { x: "0.25", y: "0.75" },
                        { x: "0.75", y: "0.75" }
                    ];
                    removeDefaultConstraints(quarterConstraints);
                    break;
            }
        }
    
        // Actualizar el número de conectores
        this.connectorsCount = newConnections;
    }

}
