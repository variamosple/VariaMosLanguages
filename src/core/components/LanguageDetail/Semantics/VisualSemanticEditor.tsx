import { useEffect, useState } from 'react';
import { useLanguageContext } from '../../../context/LanguageContext/LanguageContextProvider';
import { Form, Col, Row, Button } from 'react-bootstrap';
import Select from "react-select";
import TranslationRuleModal from './TranslationRule';

interface TranslationRule {
    param: string;
    constraint: string;
    selectedConstraint: string;
    deselectedConstraint: string;
}

export default function VisualSemanticEditor() {

    // Importar todo lo necesario de useLanguageContext
    const { semantics, setSemantics } = useLanguageContext();
    const { elements } = useLanguageContext();
    const { relationships, setRelationships } = useLanguageContext();
    const { restrictions, setRestrictions } = useLanguageContext();

    const [selectedElements, setSelectedElements] = useState<string[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [selectedRuleElement, setSelectedRuleElement] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);


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
            updateElementTypes(selectedElements);
        }
    }, [selectedElements, isInitialLoad]);


    // Actualizar la semántica del JSON
    const updateSemanticJSON = (key: string, value: any) => {
        try {
            const newSemantics = semantics ? JSON.parse(semantics) : {};
            newSemantics[key] = value;
            setSemantics(JSON.stringify(newSemantics, null, 2));
        } catch (e) {
            console.error(`Error updating the ${key} property in semantics:`, e);
        }
    };

    // Actualizar la propiedad elementTypes de la semántica
    const updateElementTypes = (elements: string[]) => {
        setSelectedElements(elements);
        updateSemanticJSON("elementTypes", elements);
    };

    // Guarda la regla en el JSON de semantics
    const saveTranslationRule  = (elementName: string, rule: TranslationRule) => {
        try {
            const parsedSemantics = semantics ? JSON.parse(semantics) : {};
            const updatedRules = {
                ...parsedSemantics.elementTranslationRules,
                [elementName]: rule,
            };
            updateSemanticJSON("elementTranslationRules", updatedRules);
            setShowModal(false);
        } catch (e) {
            console.error("Error updating elementTranslationRules:", e);
        }
    };

    const handleOpenModal = (elementName: string) => {
        setSelectedRuleElement(elementName);
        setShowModal(true);
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

            {/* Section for Element Translation Rules */}
            {selectedElements.length > 0 && (
            <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column sm={2}>Element Translation Rules</Form.Label>
                <Col sm={10}>
                    <div className="d-flex flex-wrap gap-2">
                        {selectedElements.map((element) => (
                            <Button
                                key={element}
                                variant="outline-primary"
                                onClick={() => handleOpenModal(element)}
                            >
                                {element}
                            </Button>
                        ))}
                    </div>
                </Col>
            </Form.Group>
            )}
        </Form>

        {/* Modal for Editing Translation Rules */}
        {selectedRuleElement && (
            <TranslationRuleModal
                show={showModal}
                elementName={selectedRuleElement}
                rule={
                    JSON.parse(semantics).elementTranslationRules?.[selectedRuleElement] || {
                        param: '',
                        constraint: '',
                        selectedConstraint: '',
                        deselectedConstraint: '',
                    }
                }
                onSave={(updatedRule) => saveTranslationRule(selectedRuleElement as string, updatedRule)}
                onClose={() => setShowModal(false)}
            />
        )}
        </>
    );
}