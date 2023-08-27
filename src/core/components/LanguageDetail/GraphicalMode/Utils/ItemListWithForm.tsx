import { useState } from "react";
import ItemList from "./ItemList";
import ItemForm from "./ItemForm";

// interface ItemListWithFormProps {
//   items: any[]; // Update with your item type
//   setItems: (items: any[]) => void;
//   defaultNewItem: any; // Update with your item type
//   itemLabel: string;
//   FormComponent: React.Component; // Specify the type of FormComponentProps
// }

// interface FormComponentProps {
//   selectedItem: any;
//   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

export default function ItemListWithForm ({
  items,
  setItems,
  defaultNewItem,
  itemLabel,
  FormComponent
}) {
  const [selectedItem, setSelectedItem] = useState({});
  const [showForm, setShowForm] = useState(false);

  const handleUpdateItem = (updatedItem) => {
    const index = items.findIndex((item) => item === selectedItem);

    if (index !== -1) {
      const updatedItems = [...items];
      updatedItems[index] = updatedItem;
      setItems(updatedItems);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedItem({});
  };

  return (
    <div>
      <ItemList
        items={items}
        setItems={setItems}
        defaultNewItem={defaultNewItem}
        itemLabel={itemLabel}
        setSelectedItem={setSelectedItem}
      />
      
      {showForm && (
        <ItemForm
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          handleUpdateItem={handleUpdateItem}
          handleClose={handleCloseForm}
          FormComponent={FormComponent}
        />
      )}
    </div>
  );
}