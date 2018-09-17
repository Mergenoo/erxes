import {
  Button,
  DataWithLoader,
  FormControl,
  ModalTrigger,
  Pagination,
  SortHandler,
  Table
} from 'modules/common/components';
import { __, confirm, router } from 'modules/common/utils';
import { CompaniesTableWrapper } from 'modules/companies/styles';
import { Wrapper } from 'modules/layout/components';
import { BarItems } from 'modules/layout/styles';
import { ManageColumns } from 'modules/settings/properties/containers';
import { TaggerPopover } from 'modules/tags/components';
import * as React from 'react';
import { withRouter } from 'react-router';
import { CompaniesMerge } from '..';
import { CompanyForm } from '../../containers';
import { ICompany } from '../../types';
import CompanyRow from './CompanyRow';
import Sidebar from './Sidebar';

type Props = {
  companies: ICompany[],
  counts: any,
  columnsConfig: any,
  history: any,
  location: any,
  loading: boolean,
  searchValue: string,
  // TODO: check is below line not throwing error ?
  toggleBulk: () => void,
  toggleAll: (targets: ICompany[], containerId: string) => void,
  bulk: any[],
  isAllSelected: boolean,
  emptyBulk: () => void
  tags: any[],
  removeCompanies: (doc: { companyIds: string[] }) => void,
  loadingTags: boolean,
  mergeCompanies: () => void,
  queryParams: any,
};

type State = {
  searchValue?: string
};

class CompaniesList extends React.Component<Props, State> {
  private timer: NodeJS.Timer

  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.searchValue
    };

    this.onChange = this.onChange.bind(this);
    this.search = this.search.bind(this);
    this.removeCompanies = this.removeCompanies.bind(this);
  }

  onChange() {
    const { toggleAll, companies } = this.props;
    toggleAll(companies, 'companies');
  }

  search(e) {
    if (this.timer) clearTimeout(this.timer);

    const { history } = this.props;
    const searchValue = e.target.value;

    this.setState({ searchValue });
    this.timer = setTimeout(() => {
      router.setParams(history, { searchValue });
    }, 500);
  }

  removeCompanies(companies) {
    const companyIds = [];

    companies.forEach(company => {
      companyIds.push(company._id);
    });

    this.props.removeCompanies({ companyIds });
  }

  moveCursorAtTheEnd(e) {
    const tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  }

  render() {
    const {
      columnsConfig,
      companies,
      history,
      location,
      loading,
      counts,
      toggleBulk,
      bulk,
      isAllSelected,
      emptyBulk,
      tags,
      loadingTags,
      mergeCompanies,
      queryParams
    } = this.props;

    const mainContent = (
      <CompaniesTableWrapper>
        <Table whiteSpace="nowrap" bordered hover>
          <thead>
            <tr>
              <th>
                <FormControl
                  checked={isAllSelected}
                  componentClass="checkbox"
                  onChange={this.onChange}
                />
              </th>
              {columnsConfig.map(({ name, label }) => (
                <th key={name}>
                  <SortHandler sortField={name} />
                  {__(label)}
                </th>
              ))}
              <th>{__('Tags')}</th>
            </tr>
          </thead>
          <tbody id="companies">
            {companies.map(company => (
              <CompanyRow
                company={company}
                columnsConfig={columnsConfig}
                isChecked={bulk.includes(company)}
                key={company._id}
                history={history}
                toggleBulk={toggleBulk}
              />
            ))}
          </tbody>
        </Table>
      </CompaniesTableWrapper>
    );

    const addTrigger = (
      <Button btnStyle="success" size="small" icon="add">
        Add company
      </Button>
    );

    const editColumns = (
      <Button btnStyle="simple" size="small">
        Edit columns
      </Button>
    );

    const mergeButton = (
      <Button btnStyle="primary" size="small" icon="shuffle">
        Merge
      </Button>
    );

    let actionBarLeft = null;

    if (bulk.length > 0) {
      const tagButton = (
        <Button btnStyle="simple" size="small" icon="downarrow">
          Tag
        </Button>
      );

      actionBarLeft = (
        <BarItems>
          <TaggerPopover
            type="company"
            successCallback={emptyBulk}
            targets={bulk}
            trigger={tagButton}
          />

          {bulk.length === 2 && (
            <ModalTrigger
              title="Merge Companies"
              size="lg"
              trigger={mergeButton}
              content={(props) => <CompaniesMerge {...props} objects={bulk} save={mergeCompanies} />}
            />
          )}

          <Button
            btnStyle="danger"
            size="small"
            icon="cancel-1"
            onClick={() =>
              confirm().then(() => {
                this.removeCompanies(bulk);
              })
            }
          >
            Remove
          </Button>
        </BarItems>
      );
    }

    const actionBarRight = (
      <BarItems>
        <FormControl
          type="text"
          placeholder={__('Type to search').toString()}
          onChange={e => this.search(e)}
          value={this.state.searchValue}
          autoFocus
          onFocus={e => this.moveCursorAtTheEnd(e)}
        />
        <ModalTrigger 
          title="Choose which column you see" 
          trigger={editColumns}
          content={(props) => (
            <ManageColumns
              {...props}
              location={location}
              history={history}
              contentType="company"
              />
            )}
          />
        <ModalTrigger 
          title="New company" 
          trigger={addTrigger} 
          size="lg"
          content={(props) => <CompanyForm  {...props} queryParams={queryParams} />}
         />
      </BarItems>
    );

    const actionBar = (
      <Wrapper.ActionBar right={actionBarRight} left={actionBarLeft} />
    );
    const breadcrumb = [{ title: __(`Companies`) + ` (${counts.all})` }];

    return (
      <Wrapper
        header={
          <Wrapper.Header breadcrumb={breadcrumb} queryParams={queryParams} />
        }
        actionBar={actionBar}
        footer={<Pagination count={counts.all} />}
        leftSidebar={
          <Sidebar counts={counts} tags={tags} loading={loadingTags} />
        }
        content={
          <DataWithLoader
            data={mainContent}
            loading={loading}
            count={companies.length}
            emptyText="No companies added yet!"
            emptyImage="/images/robots/robot-04.svg"
          />
        }
      />
    );
  }
}

export default withRouter(CompaniesList);
