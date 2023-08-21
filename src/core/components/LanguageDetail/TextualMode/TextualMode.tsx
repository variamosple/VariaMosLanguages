import { Tab, Tabs } from "react-bootstrap";
import SourceCode from "./SourceCode/SourceCode";
import { LanguageContext } from "../../../context/LanguageContext/LanguageContextProvider";
import { useContext } from "react";


export default function TextualMode() {
    const {abstractSyntax, setAbstractSyntax, concreteSyntax, setConcreteSyntax, semantics, setSemantics} = useContext(LanguageContext)

    return(
    <Tabs
        defaultActiveKey="abstract-syntax"
        id="uncontrolled-tab"
        className="mb-3"
      >
        <Tab eventKey="abstract-syntax" title="Abstract Syntax">
          <SourceCode code={abstractSyntax} dispatcher={setAbstractSyntax} />
        </Tab>
        <Tab eventKey="concrete-syntax" title="Concrete Syntax">
          <SourceCode code={concreteSyntax} dispatcher={setConcreteSyntax} />
        </Tab>
        <Tab eventKey="semantics" title="Semantics">
          <SourceCode code={semantics} dispatcher={setSemantics} />
        </Tab>
      </Tabs>
    )
}

    