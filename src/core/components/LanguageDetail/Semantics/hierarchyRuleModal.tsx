import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import MultiValueForm from '../GraphicalMode/Utils/FormUtils/MultiValueForm';

// Interfaces
interface HierarchyTranslationRule {
    nodeRule?: {
        param: string[];
        paramMapping: {
            incoming: boolean;
            var: string;
            node: string;
        };
        constraint: string;
    };
    leafRule?: {
        param: string;
        constraint: string;
    };
}

interface HierarchyRuleModalProps {
    show: boolean;
    hierarchyType: string;
    rule: HierarchyTranslationRule;
    elements: { name: string }[]; // Para selección de elementos
    onSave: (hierarchyType: string, rule: HierarchyTranslationRule) => void;
    onClose: () => void;
}

export default function HierarchyRuleModal({
    show,
    hierarchyType,
    rule,
    elements,
    onSave,
    onClose
}: HierarchyRuleModalProps) {
    // Estado local para manejar la regla
    const [localRule, setLocalRule] = useState<HierarchyTranslationRule>({
        nodeRule: {
            param: [],
            paramMapping: {
                incoming: false,
                var: '',
                node: ''
            },
            constraint: ''
        },
        leafRule: {
            param: '',
            constraint: ''
        }
    });

    // Estado para manejo de validaciones
    //const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Efecto para actualizar estado local cuando cambia la regla externa
    useEffect(() => {
        // Asegurarse de tener valores por defecto
        setLocalRule({
            nodeRule: rule.nodeRule || {
                param: [],
                paramMapping: {
                    incoming: false,
                    var: '',
                    node: ''
                },
                constraint: ''
            },
            leafRule: rule.leafRule || {
                param: '',
                constraint: ''
            }
        });
    }, [rule, show]);

    // Validación de reglas
    // const validateRules = (): boolean => {
    //     const errors: string[] = [];

    //     // Validaciones para nodeRule
    //     if (localRule.nodeRule) {
    //         if (localRule.nodeRule.param.length === 0) {
    //             errors.push("Node Rule: Debe tener al menos un parámetro");
    //         }
    //         if (!localRule.nodeRule.paramMapping.var) {
    //             errors.push("Node Rule: Debe definir un nombre de variable");
    //         }
    //         if (!localRule.nodeRule.paramMapping.node) {
    //             errors.push("Node Rule: Debe definir un nombre de nodo");
    //         }
    //         if (!localRule.nodeRule.constraint.trim()) {
    //             errors.push("Node Rule: La restricción no puede estar vacía");
    //         }
    //     }

    //     // Validaciones para leafRule
    //     if (localRule.leafRule) {
    //         if (!localRule.leafRule.param) {
    //             errors.push("Leaf Rule: Debe tener un parámetro");
    //         }
    //         if (!localRule.leafRule.constraint.trim()) {
    //             errors.push("Leaf Rule: La restricción no puede estar vacía");
    //         }
    //     }

    //     setValidationErrors(errors);
    //     return errors.length === 0;
    // };

    // Manejadores para cambios en NodeRule
    const handleNodeRuleParamChange = (params: string[]) => {
        setLocalRule(prev => ({
            ...prev,
            nodeRule: {
                ...prev.nodeRule!,
                param: params
            }
        }));
    };

    const handleNodeRuleMappingChange = (
        field: keyof HierarchyTranslationRule['nodeRule']['paramMapping'], 
        value: string | boolean
    ) => {
        setLocalRule(prev => ({
            ...prev,
            nodeRule: {
                ...prev.nodeRule!,
                paramMapping: {
                    ...prev.nodeRule!.paramMapping,
                    [field]: value
                }
            }
        }));
    };

    const handleNodeRuleConstraintChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalRule(prev => ({
            ...prev,
            nodeRule: {
                ...prev.nodeRule!,
                constraint: event.target.value
            }
        }));
    };

    // Manejadores para cambios en LeafRule
    const handleLeafRuleParamChange = (value: string) => {
        setLocalRule(prev => ({
            ...prev,
            leafRule: {
                ...prev.leafRule!,
                param: value
            }
        }));
    };

    const handleLeafRuleConstraintChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalRule(prev => ({
            ...prev,
            leafRule: {
                ...prev.leafRule!,
                constraint: event.target.value
            }
        }));
    };

    // Manejador de envío
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSave(hierarchyType, localRule);

        // if (validateRules()) {
        //     onSave(hierarchyType, localRule);
        // }
    };

    return (
        <Modal show={show} onHide={onClose} size="xl">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Hierarchy Translation Rule: {hierarchyType}</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {/* {validationErrors.length > 0 && (
                        <Alert variant="danger">
                            <ul>
                                {validationErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </Alert>
                    )} */}

                    {/* Sección de Node Rule */}
                    <fieldset className="border p-3 mb-3">
                        <legend>Node Rule (Internal Nodes)</legend>
                        
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Parameters</Form.Label>
                            <Col sm={9}>
                                <MultiValueForm
                                    selectedItems={localRule.nodeRule?.param || []}
                                    setSelectedItems={handleNodeRuleParamChange}
                                />
                                <Form.Text className="text-muted">
                                    Select parameters for node translation (first for node ID, second for related nodes)
                                </Form.Text>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Parameter Mapping</Form.Label>
                            <Col sm={9}>
                                <Row>
                                    <Col>
                                        <Form.Check 
                                            type="switch"
                                            label="Incoming Hierarchy"
                                            checked={localRule.nodeRule?.paramMapping.incoming || false}
                                            onChange={(e) => handleNodeRuleMappingChange('incoming', e.target.checked)}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Variable Name"
                                            value={localRule.nodeRule?.paramMapping.var || ''}
                                            onChange={(e) => handleNodeRuleMappingChange('var', e.target.value)}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Node Parameter Name"
                                            value={localRule.nodeRule?.paramMapping.node || ''}
                                            onChange={(e) => handleNodeRuleMappingChange('node', e.target.value)}
                                        />
                                    </Col>
                                </Row>
                                <Form.Text className="text-muted">
                                    Configure how hierarchy and node parameters are mapped
                                </Form.Text>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Node Constraint</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={localRule.nodeRule?.constraint || ''}
                                    onChange={handleNodeRuleConstraintChange}
                                    placeholder="Enter node constraint (e.g., using sum(), len() expansions)"
                                />
                                <Form.Text className="text-muted">
                                    Define constraint for internal nodes. Use expansions like sum(Xs)/len(Xs)
                                </Form.Text>
                            </Col>
                        </Form.Group>
                    </fieldset>

                    {/* Sección de Leaf Rule */}
                    <fieldset className="border p-3">
                        <legend>Leaf Rule</legend>
                        
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Parameter</Form.Label>
                            <Col sm={9}>
                                {/* <Form.Select
                                    value={localRule.leafRule?.param || ''}
                                    onChange={handleLeafRuleParamChange}
                                >
                                    <option value="">Select Parameter</option>
                                    {elements.map(element => (
                                        <option key={element.name} value={element.name}>
                                            {element.name}
                                        </option>
                                    ))}
                                </Form.Select> */}
                                <Form.Control
                                    type="text"
                                    placeholder="Enter parameter for leaf node"
                                    value={localRule.leafRule?.param || ''}
                                    onChange={(e) => handleLeafRuleParamChange(e.target.value)}
                                />
                                <Form.Text className="text-muted">
                                    Select the parameter for leaf node translation
                                </Form.Text>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Leaf Constraint</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={localRule.leafRule?.constraint || ''}
                                    onChange={handleLeafRuleConstraintChange}
                                    placeholder="Enter leaf node constraint"
                                />
                                <Form.Text className="text-muted">
                                    Define constraint specifically for leaf nodes
                                </Form.Text>
                            </Col>
                        </Form.Group>
                    </fieldset>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        type="submit"
                    >
                        Save Hierarchy Rule
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}