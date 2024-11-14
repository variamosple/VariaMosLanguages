import { useEffect, useState } from 'react';
import { useLanguageContext } from '../../../context/LanguageContext/LanguageContextProvider';
import { Form, Col, Row } from 'react-bootstrap';
import Select from "react-select";

export default function VisualSemanticEditor() {

    // Importar todo lo necesario de useLanguageContext
    const { semantics, setSemantics } = useLanguageContext();
    const { elements } = useLanguageContext();
    const { relationships, setRelationships } = useLanguageContext();
    const { restrictions, setRestrictions } = useLanguageContext();

    const [selectedElements, setSelectedElements] = useState<string[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);


    useEffect(() => {
        // Parsear semantics al cargar la vista
        if (isInitialLoad && semantics) {
            try {
                const parsedSemantics = JSON.parse(semantics);
                setSelectedElements(parsedSemantics.elementTypes || []);
                setIsInitialLoad(false);
            } catch (e) {
                console.error("Error al parsear JSON de semantics:", e);
            }
        }
    }, [semantics, isInitialLoad]);

    useEffect(() => {
        if (!isInitialLoad) {
            updateSemanticProperty();
        }
    }, [selectedElements, isInitialLoad]);

    // Actualizar la propiedad elementTypes de la semántica
    const updateSemanticProperty = () => {
        try {
            const newSemantics = semantics ? JSON.parse(semantics) : {};
            newSemantics.elementTypes = selectedElements;
            setSemantics(JSON.stringify(newSemantics, null, 2));
        } catch (e) {
            console.error("Error actualizando la propiedad elementTypes:", e);
        }
    };

    return(
        <>
        <Form>
            <Form.Group as={Row} className="mb-3">
                {/* Primer elemento, ElementTypes */}
                <Form.Label column sm={2}>Element Types</Form.Label>
                <Col sm={10}>
                    <Select
                        options={elements.map((element) => ({
                            value: element.name,
                            label: element.name,
                        }))}
                        value={selectedElements.map((element) => ({
                            value: element,
                            label: element,
                        }))}
                        onChange={(selectedOptions) => {
                            const updatedElements = selectedOptions.map((option) => option.value);
                            setSelectedElements(updatedElements);
                        }}
                        isMulti
                        closeMenuOnSelect={false}
                        placeholder="Select element type(s)"
                    />
                </Col>
            </Form.Group>
        </Form>

        </>
    );
}