import { useCallback, useEffect, useState } from 'react';
import { ResponseModel } from '../../../../Domain/Core/Entity/ResponseModel';
import { useLanguageContext } from '../../../context/LanguageContext/LanguageContextProvider';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import Select from '../../InfiniteSelect';
import { SelectOptionProps } from '../../InfiniteSelect/index.types';
import { getServiceUrl } from '../../LanguageManager/index.utils';
import SourceCode from '../TextualMode/SourceCode/SourceCode';
import { formatCode } from '../index.utils';
import VisualSemanticEditor from './VisualSemanticEditor';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const LIMIT = 20;

export default function Sematics() {
  const { semantics, setSemantics } = useLanguageContext();

  const [semanticsMap, setSemanticsMap] = useState<Map<number, string>>(
    new Map()
  );
  const [selectedOption, setSelectedOption] = useState<SelectOptionProps>({
    label: '',
    value: '',
  });

  // TODO: Refactor: move search input logic to a custom hook or a Higher Order Component
  const [searchInput, setSearchInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchInput, setDebouncedSearchInput] = useState('');
  const [semanticOptions, setSemanticOptions] = useState<SelectOptionProps[]>(
    []
  );
  const [isFetchingSemantics, setIsFetchingSemantics] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const [viewMode, setViewMode] = useState<'form' | 'json'>('form');

  // Manejar el cambio de modo de vista
  const handleSwitchToForm = () => setViewMode('form');
  const handleSwitchToJson = () => setViewMode('json');


  const handleSelect = (option: SelectOptionProps) => {
    const selectedSemantics =
      semanticsMap.get(parseInt(option.value) || 0) || {};

    setSemantics(formatCode(selectedSemantics as any));
    setSelectedOption(option);
    setSearchInput(option.label);
    setSearchValue('');
  };

  const transformToSelectOptions = (
    semantics: { id: number; name: string; type: string }[]
  ): SelectOptionProps[] => {
    if (!semantics) return [];

    return semantics?.map(({ id, name, type }) => {
      return {
        label: `${name}: [${type}]`,
        value: `${id}`,
      } as SelectOptionProps;
    });
  };

  const { lastEntryRef, setHasMore, page } =
    useIntersectionObserver(isFetchingSemantics);

  //Todo: move this to a service file
  const fetchAndSetSemantics = useCallback(async () => {
    const route = getServiceUrl('v2', 'languages', 'semantics');
    try {
      setIsFetchingSemantics(true);
      const url = new URL(route);
      const params = url.searchParams;

      if (debouncedSearchInput) {
        params.append('search', debouncedSearchInput);
      }

      params.append('pageNumber', page.toString());
      params.append('pageSize', LIMIT.toString());

      const httpResponse = await fetch(url);
      const responseContent = await httpResponse.json();

      const result: ResponseModel<any[]> = new ResponseModel<any[]>();
      Object.assign(result, { data: [] }, responseContent);

      if (!httpResponse.ok) {
        throw new Error(`${result.errorCode}: ${result.message}`);
      }

      if (page === 1) setSemanticOptions([]);

      setSemanticsMap((prev) => {
        result.data.forEach(({ id, semantics }) => prev.set(id, semantics));

        return prev;
      });
      setSemanticOptions((prev) => [
        ...prev,
        ...transformToSelectOptions(result?.data || []),
      ]);
      setTotalItems(result?.totalCount || 0);
    } catch (error) {
      console.log(
        `Error trying to connect to the ${route} service. Error: ${error}`
      );
    } finally {
      setIsFetchingSemantics(false);
    }
  }, [page, debouncedSearchInput]);

  useEffect(() => {
    if (totalItems === 0) return;
    if (!isFetchingSemantics) {
      setHasMore(semanticOptions?.length < totalItems);
    }
  }, [semanticOptions, totalItems, isFetchingSemantics, setHasMore]);

  useEffect(() => {
    fetchAndSetSemantics();
  }, [page, fetchAndSetSemantics]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchInput(searchValue);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchValue]);

  const onSearchChange = (search: string) => {
    setSearchInput(search);
    setSearchValue(search);
  };

  return (
    <div>
      <Select
        options={semanticOptions}
        selected={selectedOption}
        placeholder='Select a semantic'
        handleSelect={handleSelect}
        isFetchingOptions={isFetchingSemantics}
        lastOptionRef={lastEntryRef}
        isSearchable={true}
        searchInput={searchInput}
        setSearchInput={onSearchChange}
      />

      {/* DropDown button para elegir entre el formulario o el modo textual */}
      <div>
        <DropdownButton size="sm" title="Mode" variant="primary" id="modeDropdown" className="mb-3">
          <Dropdown.Item onClick={handleSwitchToForm}>Visual Editor</Dropdown.Item>
          <Dropdown.Item onClick={handleSwitchToJson}>Textual editor</Dropdown.Item>
        </DropdownButton>

        {viewMode === "form" ? (
          <VisualSemanticEditor />
        ) : (
          <SourceCode code={semantics} dispatcher={setSemantics} />
        )}
      </div>
    </div>
  );
}
