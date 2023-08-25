import React, { useContext } from "react";
import ElementForm from "./ElementForm";
import { LanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";
import ItemTab from "../Utils/ItemTab";

export default function ElementTab() {
  const { elements, setElements } = useContext(LanguageContext);
  const newElement = {
    name: `Element ${elements.length + 1}`,
    label: "",
    draw: "",
    icon: "",
    height: "",
    width: "",
    properties: [],
    label_property:""
  };

  return (
    <ItemTab
      items={elements}
      setItems={setElements}
      newItem={newElement}
      label="element"
      FormComponent={ElementForm} 
      withProperties={true}
      withLabels={false}
      withStyles={false}/>
  );
}
