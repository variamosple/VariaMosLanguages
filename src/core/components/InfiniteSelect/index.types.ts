export type SelectOptionProps = {
  label: string;
  value: string;
};

export type SelectProps = {
  options: SelectOptionProps[];
  selected?: SelectOptionProps;
  handleSelect: (option: SelectOptionProps) => void;
  placeholder?: string;
  isFetchingOptions?: boolean;
  isSearchable?: boolean;
  searchInput?: string;
  lastOptionRef?: (node: Element | null) => void;
  setSearchInput?: (search: string) => void;
};
