import { Button } from "react-bootstrap";
import { useItemEditorContext } from "../../../../../../context/LanguageContext/ItemEditorContextProvider";

export default function ItemSaveButton() {
  const {items, setItems, selectedItem, setSelectedItem, formValues } = useItemEditorContext()

  const handleUpdateItem = (updatedItem) => {
    const index = items.findIndex((item) => item === selectedItem);
    if (index !== -1) {
      const updatedItems = [...items];
      updatedItems[index] = updatedItem;
      setItems(updatedItems);
    }
  };
 
  const handleFormSubmit = () => {
      handleUpdateItem(formValues);
      setSelectedItem({});
    };
    
    return(
      <div className="d-flex justify-content-end gap-1">
        <Button variant='secondary' onClick={() => setSelectedItem({})}>Cancel</Button>
        <Button variant="primary" onClick={handleFormSubmit}>
          Apply
        </Button>
      </div>
    )
}