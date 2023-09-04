import { createContext, useContext } from "react";

export const ItemEditorContext = createContext(null)

export function useItemEditorContext() {
  const context = useContext(ItemEditorContext);
  if (!context) {
    throw new Error("useItemEditorContext must be used within a ItemEditorContextProvider");
  }
  return context;
}

