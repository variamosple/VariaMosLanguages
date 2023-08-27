import ElementForm from "./ElementForm";
import { useLanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";
import ItemListWithForm from "../Utils/ItemListWithForm";

export default function ElementTab() {
  const { elements, setElements } = useLanguageContext();
  const defaultNewElement = {
    name: `Element ${elements.length + 1}`,
    label: "",
    draw: "",
    icon: "",
    height: "",
    width: "",
    label_property:"",
    properties: []
  };

  return (
    <ItemListWithForm
      items={elements}
      setItems={setElements}
      defaultNewItem={defaultNewElement}
      itemLabel="element"
      FormComponent={ElementForm} />
  );
}
