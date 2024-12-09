import { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { BiTrash, BiPlus } from "react-icons/bi";

interface RelationReificationTranslationRule {
    param: string[];
    paramMapping: {
        inboundEdges: {
            unique: boolean;
            var: string;
        };
        outboundEdges: {
            unique: boolean;
            var: string;
        };
    };
    constraint: {
        [key: string]: string;
    };
}

interface RelationReificationTranslationRuleModalProps {
    show: boolean;
    relationReificationType: string;
    rule: RelationReificationTranslationRule;
    onSave: (updatedRule: RelationReificationTranslationRule) => void;
    onClose: () => void;
}

export default function RelationReificationTranslationRuleModal({
    show,
    relationReificationType,
    rule,
    onSave,
    onClose
}: RelationReificationTranslationRuleModalProps) {
    const [localRule, setLocalRule] = useState<RelationReificationTranslationRule>(rule);

    const [newConstraintKey, setNewConstraintKey] = useState('');
    const [newConstraintValue, setNewConstraintValue] = useState('');

    useEffect(() => {
        setLocalRule(rule);
    }, [rule]);

    const updateParam = (index: number, value: string) => {
        const newParams = [...localRule.param];
        newParams[index] = value;
        setLocalRule({ ...localRule, param: newParams });
    };

    const addParam = () => {
        setLocalRule({ 
            ...localRule, 
            param: [...localRule.param, ''] 
        });
    };

    const removeParam = (index: number) => {
        const newParams = localRule.param.filter((_, i) => i !== index);
        setLocalRule({ ...localRule, param: newParams });
    };

    const updateConstraint = (key: string, value: string) => {
        setLocalRule({ 
            ...localRule, 
            constraint: { 
                ...localRule.constraint, 
                [key]: value 
            } 
        });
    };

    const addConstraint = () => {
        const newKey = newConstraintKey.trim();
        const newValue = newConstraintValue.trim();

        if (newKey && newValue) {
            setLocalRule({ 
                ...localRule, 
                constraint: { 
                    ...localRule.constraint, 
                    [newKey]: newValue 
                } 
            });

            setNewConstraintKey('');
            setNewConstraintValue('');
        }
    };

    const removeConstraint = (key: string) => {
        const newConstraints = { ...localRule.constraint };
        delete newConstraints[key];
        setLocalRule({ ...localRule, constraint: newConstraints });
    };

    const handleSave = () => {
        let finalRule = { ...localRule };

        if (newConstraintKey.trim() && newConstraintValue.trim()) {
            finalRule = {
                ...finalRule,
                constraint: {
                    ...finalRule.constraint,
                    [newConstraintKey.trim()]: newConstraintValue.trim()
                }
            };
        }

        onSave(finalRule);

        setNewConstraintKey('');
        setNewConstraintValue('');
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Relation Reification Translation Rules for {relationReificationType}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Parameters Section */}
                    <Form.Group className="mb-3">
                        <Form.Label>Parameters</Form.Label>
                        {localRule.param.map((param, index) => (
                            <Row key={index} className="mb-2 align-items-center">
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder={`Parameter ${index + 1}`}
                                        value={param}
                                        onChange={(e) => updateParam(index, e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm" 
                                        onClick={() => removeParam(index)}
                                    >
                                        <BiTrash />
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={addParam}
                        >
                            <BiPlus /> Add Parameter
                        </Button>
                    </Form.Group>

                    {/* Parameter Mapping Section */}
                    <Form.Group className="mb-3">
                        <Form.Label>Inbound Edges Mapping</Form.Label>
                        <Row>
                            <Col>
                                <Form.Check 
                                    type="checkbox"
                                    label="Unique"
                                    checked={localRule.paramMapping.inboundEdges.unique}
                                    onChange={(e) => setLocalRule({
                                        ...localRule,
                                        paramMapping: {
                                            ...localRule.paramMapping,
                                            inboundEdges: {
                                                ...localRule.paramMapping.inboundEdges,
                                                unique: e.target.checked
                                            }
                                        }
                                    })}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Variable Name"
                                    value={localRule.paramMapping.inboundEdges.var}
                                    onChange={(e) => setLocalRule({
                                        ...localRule,
                                        paramMapping: {
                                            ...localRule.paramMapping,
                                            inboundEdges: {
                                                ...localRule.paramMapping.inboundEdges,
                                                var: e.target.value
                                            }
                                        }
                                    })}
                                />
                            </Col>
                        </Row>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Outbound Edges Mapping</Form.Label>
                        <Row>
                            <Col>
                                <Form.Check 
                                    type="checkbox"
                                    label="Unique"
                                    checked={localRule.paramMapping.outboundEdges.unique}
                                    onChange={(e) => setLocalRule({
                                        ...localRule,
                                        paramMapping: {
                                            ...localRule.paramMapping,
                                            outboundEdges: {
                                                ...localRule.paramMapping.outboundEdges,
                                                unique: e.target.checked
                                            }
                                        }
                                    })}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Variable Name"
                                    value={localRule.paramMapping.outboundEdges.var}
                                    onChange={(e) => setLocalRule({
                                        ...localRule,
                                        paramMapping: {
                                            ...localRule.paramMapping,
                                            outboundEdges: {
                                                ...localRule.paramMapping.outboundEdges,
                                                var: e.target.value
                                            }
                                        }
                                    })}
                                />
                            </Col>
                        </Row>
                    </Form.Group>

                    {/* Constraints Section */}
                    <Form.Group>
                        <Form.Label>Constraints</Form.Label>
                        {Object.entries(localRule.constraint).map(([key, value]) => (
                            <Row key={key} className="mb-2 align-items-center">
                                <Col>
                                    <Form.Control
                                        type="text"
                                        value={key}
                                        readOnly
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Constraint formula"
                                        value={value}
                                        onChange={(e) => updateConstraint(key, e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm" 
                                        onClick={() => removeConstraint(key)}
                                    >
                                        <BiTrash />
                                    </Button>
                                </Col>
                            </Row>
                        ))}

                        {/* New row added at the end */}
                        <Row className="mt-3">
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Constraint Name"
                                    value={newConstraintKey}
                                    onChange={(e) => setNewConstraintKey(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Constraint Formula"
                                    value={newConstraintValue}
                                    onChange={(e) => setNewConstraintValue(e.target.value)}
                                />
                            </Col>
                            <Col xs="auto" className="d-flex align-items-end">
                                <Button 
                                    variant="outline-primary" 
                                    onClick={addConstraint}
                                    disabled={!newConstraintKey.trim() || !newConstraintValue.trim()}
                                >
                                    <BiPlus /> Add Constraint
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Apply</Button>
            </Modal.Footer>
        </Modal>
    );
}