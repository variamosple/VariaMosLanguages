import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Form, Row, Spinner } from 'react-bootstrap';
import { PagedModel } from '../../../Domain/Core/Entity/PagedModel';
import { ResponseModel } from '../../../Domain/Core/Entity/ResponseModel';
import { Language } from '../../../Domain/ProductLineEngineering/Entities/Language';
import { getServiceUrl } from '../LanguageManager/index.utils';
import { PublicLanguagesList } from './PublicLanguagesList';

export class LanguagesFilter extends PagedModel {
  constructor(
    public name?: string,
    public userId?: string,
    pageNumber?: number,
    pageSize?: number
  ) {
    super(pageNumber, pageSize);
  }
}

const defaultFormValue = Object.freeze({ name: '' });

export interface PublicLanguagesContainerProps {
  loadDataOnInit?: boolean;
  onLanguageClick?: (language: Language) => void;
}

export const PublicLanguagesContainer: FC<PublicLanguagesContainerProps> = ({
  loadDataOnInit = true,
  onLanguageClick = () => {},
}) => {
  const [languagesFilter, setLanguagesFilter] = useState(new LanguagesFilter());
  const [isLoading, setIsloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [formValue, setFormValue] = useState({ ...defaultFormValue });

  const loadLanguages = (filter: LanguagesFilter = new LanguagesFilter()) => {
    setIsloading(true);
    setLanguagesFilter(filter);

    // Todo move to a service
    const route = getServiceUrl('v2', 'languages');
    const url = new URL(route);
    const params = url.searchParams;
    if (filter.name) {
      params.append('name', filter.name);
    }
    params.append('pageNumber', filter.pageNumber.toString());
    params.append('pageSize', filter.pageSize.toString());

    fetch(url)
      .then(async (httpResponse) => {
        const responseContent = await httpResponse.json();
        const result: ResponseModel<Language[]> = new ResponseModel<
          Language[]
        >();
        Object.assign(result, { data: [] }, responseContent);

        if (!httpResponse.ok) {
          throw new Error(`${result.errorCode}: ${result.message}`);
        }

        setLanguages(result.data);
        setTotalPages(Math.ceil((result.totalCount || 0) / 20));
      })
      .catch((error) => {
        console.log(
          `Error trying to connect to the ${route} service. Error: ${error}`
        );
        setLanguages([]);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  const onPageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    loadLanguages(
      Object.assign(new LanguagesFilter(), languagesFilter, { pageNumber })
    );
  };

  const onClear = () => {
    setFormValue({ ...defaultFormValue });
  };

  const onReset = () => {
    setFormValue({ ...defaultFormValue });
    setCurrentPage(1);
    loadLanguages(new LanguagesFilter());
  };

  const hanldeOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormValue((currentValue) => ({ ...currentValue, [name]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filterValues = {};
    Object.entries(formValue)
      .filter(([_, value]) => value !== null && value !== undefined)
      .forEach(([key, value]) => (filterValues[key] = value));

    setCurrentPage(1);
    loadLanguages(
      Object.assign(
        new LanguagesFilter(),
        { ...languagesFilter, pageNumber: 1 },
        filterValues
      )
    );
  };

  useEffect(() => {
    if (loadDataOnInit) {
      loadLanguages();
    }
  }, [loadDataOnInit]);

  if (isLoading) {
    return (
      <div className='w-100 text-center'>
        <Spinner
          animation='border'
          role='status'
          variant='primary'
          className='mx-3'
        >
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Row className='mb-3'>
          <Col xs={12} sm lg={9}>
            <Form.Control
              name='name'
              type='text'
              placeholder='Find a language...'
              value={formValue.name}
              onChange={hanldeOnChange}
            />
          </Col>

          <Col xs={12} sm='auto' lg={3} className='mt-2 mt-sm-0 text-center'>
            <ButtonGroup className='d-flex w-100'>
              <Button
                type='button'
                onClick={onClear}
                disabled={isLoading}
                className='flex-fill'
              >
                Clear
              </Button>
              <Button
                type='button'
                onClick={onReset}
                disabled={isLoading}
                className='flex-fill'
              >
                Reset
              </Button>
              <Button type='submit' disabled={isLoading} className='flex-fill'>
                Filter
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>

      <PublicLanguagesList
        languages={languages}
        onLanguageClick={onLanguageClick}
        currentPage={currentPage}
        setCurrentPage={onPageChange}
        totalPages={totalPages}
      />
    </div>
  );
};
