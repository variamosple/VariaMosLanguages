import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import StyleEditor from "./StyleEditor";
import StylePreview from "./StylePreview";
import { useState } from "react";
import "../../../GraphicalMode.css"
import { useItemEditorContext } from "../../../../../../context/LanguageContext/ItemEditorContextProvider";

export default function StyleTool({show, handleClose}) {
    const [style,setStyle] = useState("");
    const {formValues, setFormValues} = useItemEditorContext()
    const handleFormSubmit=()=> {
        setFormValues((prev) => ({
            ...prev,
            style: style,
          }));
        handleClose()
    }
    return(
        <Modal show={show} onHide={handleClose}  size="xl">
            <Modal.Header>
                <Modal.Title>Style edition</Modal.Title>
            </Modal.Header>
            <Row>
                <Col sm={8} >
                    <div className="item-form">
                    <StyleEditor style={style} setStyle={setStyle}/>
                    </div>
                </Col>
                <Col sm={4}>
                    <div className="item-form">
                    <StylePreview style={style}/>
                    </div>
                </Col>
            </Row>
                
        <Modal.Footer>
            <Button onClick={handleFormSubmit}>
                Save
            </Button>
        </Modal.Footer>

        </Modal>
        
    )
}