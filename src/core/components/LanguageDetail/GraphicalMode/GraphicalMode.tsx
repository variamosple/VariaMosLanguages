import { Tab, Tabs } from "react-bootstrap";
import ElementTab from "./Elements/ElementTab";
import RelationshipTab from "./Relationships/RelationshipTab";
import "./GraphicalMode.css"
import RestrictionTab from "./Restrictions/RestrictionTab";


export default function GraphicalMode() {

  return (
      <Tabs defaultActiveKey="elements" id="uncontrolled-tab" justify className="mb-3">
        <Tab eventKey="elements" title="Elements">
          <ElementTab/>
        </Tab>
        <Tab eventKey="relationships" title="Relationships">
          <RelationshipTab/>
        </Tab>
        <Tab eventKey="restrictions" title="Restrictions">
          <RestrictionTab/>
        </Tab>
        <Tab eventKey="semantics" title="Semantics">
        </Tab>
      </Tabs>
  );
}
