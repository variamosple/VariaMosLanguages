import React, { useCallback, useEffect, useState } from "react";
import ItemList from "./ItemList";
import ItemForm from "./ItemForm";

export default function ItemTab({
  items,
  setItems,
  newItem,
  label,
  FormComponent,
  withProperties,
  withLabels,
  withStyles
}) {
  const [selectedItem, setSelectedItem] = useState({});
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = useCallback(() => {
  if (Object.keys(selectedItem).length !== 0) {
    setShowForm(true);
  }
}, [selectedItem]);

  useEffect(() => handleOpenForm(),[selectedItem, handleOpenForm])


  const handleCloseForm = () => {
    setShowForm(false);
  }

  const handleUpdateItem = (updatedItem) => {
    const index = items.findIndex((item) => item === selectedItem);

    if (index !== -1) {
      const updatedItems = [...items];
      updatedItems[index] = updatedItem;
      setItems(updatedItems);
    }
  };

  return (
    <div>
      {(showForm && selectedItem )? (
        <ItemForm
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          handleUpdateItem={handleUpdateItem}
          handleClose={handleCloseForm}
          FormComponent={FormComponent}
          withProperties={withProperties}
          withLabels={withLabels}
          withStyles={withStyles} />
          
      ) : (
        <ItemList
          items={items}
          setItems={setItems}
          newItem={newItem}
          label={label}
          setSelectedItem={setSelectedItem}
        />
      )}
    </div>
  );
}
