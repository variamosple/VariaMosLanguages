import { Tab, Tabs } from "react-bootstrap";
import "../GraphicalMode.css"
import ParentChildTab from "./ParentChild/ParentChildTab";
import QuantityElementTab from "./QuantityElement/QuantityElementTab";
import UniqueNameForm from "./UniqueName/UniqueNameForm";

export default function RestrictionTab() {

  return (
    <div className="nested-tabs">
      <Tabs defaultActiveKey="parent_child" className="nested-tab mb-3" justify>
        <Tab eventKey="parent_child" title="Parent Child">
            <ParentChildTab/>
        </Tab>
        <Tab eventKey="relationships" title="Quantity Element">
            <QuantityElementTab/>
        </Tab>
        <Tab eventKey="unique_name" title="Unique name">
          <UniqueNameForm/>
        </Tab>
      </Tabs>
    </div>
    
  );
}
