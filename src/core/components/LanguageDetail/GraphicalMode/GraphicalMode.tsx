import { Tab, Tabs } from "react-bootstrap";
import ElementTab from "./Elements/ElementTab";
import RelationshipTab from "./Relationships/RelationshipTab";
import "./GraphicalMode.css"
import RestrictionTab from "./Restrictions/RestrictionTab";


export default function GraphicalMode() {

  return (
      <Tabs defaultActiveKey="elements" id="uncontrolled-tab" justify className="mb-3">
        <Tab eventKey="elements" title="Syntax Elements/Entities">
          <ElementTab/>
        </Tab>
        <Tab eventKey="relationships" title="Syntax Relationships">
          <RelationshipTab/>
        </Tab>
        <Tab eventKey="restrictions" title="Syntax Constraints">
          <RestrictionTab/>
        </Tab>
        <Tab eventKey="semantics" title="Semantics">
        </Tab>
      </Tabs>
  );
}
