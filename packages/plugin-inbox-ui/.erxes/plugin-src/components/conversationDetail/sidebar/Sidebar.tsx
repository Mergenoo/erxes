import { Tabs, TabTitle } from '@erxes/ui/src/components/tabs';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import React from 'react';
import { BasicInfo, TabContent } from './styles';

import { IUser } from '@erxes/ui/src/auth/types';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import Box from '@erxes/ui/src/components/Box';
import { __ } from '@erxes/ui/src/utils';
import CompanySection from '@erxes/ui/src/companies/components/CompanySection';
import WebsiteActivity from '@erxes/ui/src/customers/components/WebsiteActivity';
import { ICustomer } from '@erxes/ui/src/customers/types';
import { IField } from '@erxes/ui-settings/src/properties/types';
import { IConversation } from '../../../types';

const ActionSection = asyncComponent(() =>
  import(
    /* webpackChunkName:"Inbox-Sidebar-ActionSection" */ '@erxes/ui/src/customers/containers/ActionSection'
  )
);

const CustomFieldsSection = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-CustomFieldsSection" */ '@erxes/ui/src/customers/containers/CustomFieldsSection'
    ),
  { height: '200px', width: '100%', color: '#fff' }
);

const ConversationCustomFieldsSection = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-ConversationCustomFieldsSection" */ '@erxes/ui/src/inbox/containers/conversationDetail/ConversationCustomFieldsSection'
    ),
  { height: '200px', width: '100%', color: '#fff' }
);

const PortableDeals = asyncComponent(() =>
  import(
    /* webpackChunkName:"Inbox-Sidebar-PortableDeals" */ '@erxes/ui/src/deals/components/PortableDeals'
  )
);

const PortableTasks = asyncComponent(() =>
  import(
    /* webpackChunkName:"Inbox-Sidebar-PortableTasks" */ '@erxes/ui/src/tasks/components/PortableTasks'
  )
);

const PortableTickets = asyncComponent(() =>
  import(
    /* webpackChunkName:"Inbox-Sidebar-PortableTickets" */ '@erxes/ui/src/tickets/components/PortableTickets'
  )
);

const Contacts = asyncComponent(() =>
  import(
    /* webpackChunkName:"Inbox-Sidebar-Contacts" */ '@erxes/ui/src/companies/components/detail/Contacts'
  )
);

const DetailInfo = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-InfoSection" */ '@erxes/ui/src/customers/components/common/DetailInfo'
    ),
  { isBox: true }
);

const InfoSection = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-InfoSection" */ '@erxes/ui/src/customers/components/common/InfoSection'
    ),
  { withImage: true }
);

const DevicePropertiesSection = asyncComponent(() =>
  import(
    /* webpackChunkName:"Inbox-Sidebar-DevicePropertiesSection" */ '@erxes/ui/src/customers/components/common/DevicePropertiesSection'
  )
);

const TrackedDataSection = asyncComponent(() =>
  import(
    /* webpackChunkName:"Inbox-Sidebar-TrackedDataSection" */ '@erxes/ui/src/customers/components/common/TrackedDataSection'
  )
);

const TaggerSection = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-TaggerSection" */ '@erxes/ui/src/customers/components/common/TaggerSection'
    ),
  { height: '200px', width: '100%', color: '#fff' }
);

const SidebarActivity = asyncComponent(() =>
  import(
    /* webpackChunkName:"Inbox-Sidebar-SidebarActivity" */ '../../../containers/conversationDetail/SidebarActivity'
  )
);

const ConversationDetails = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-ConversationDetails" */ './ConversationDetails'
    ),
  { isBox: true }
);

type IndexProps = {
  currentUser: IUser;
  conversation: IConversation;
  customer: ICustomer;
  customerFields: IField[];
  conversationFields: IField[];
  deviceFields: IField[];
  loading: boolean;
  toggleSection: () => void;
  taggerRefetchQueries: any;
  merge?: (doc: { ids: string[]; data: ICustomer }) => void;
};

type IndexState = {
  currentTab: string;
  currentSubTab: string;
};

interface IRenderData {
  customer: ICustomer;
  fields?: IField[];
  kind: string;
  toggleSection: () => void;
}

class Index extends React.Component<IndexProps, IndexState> {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'customer',
      currentSubTab: 'details'
    };
  }

  onTabClick = currentTab => {
    this.setState({ currentTab });
  };

  onSubtabClick = currentSubTab => {
    this.setState({ currentSubTab });
  };

  renderTrackedData = ({ customer, kind, toggleSection }: IRenderData) => {
    return (
      <TrackedDataSection
        customer={customer}
        collapseCallback={toggleSection}
      />
    );
  };

  renderDeviceProperties = ({
    customer,
    kind,
    fields,
    toggleSection
  }: IRenderData) => {
    if (!(kind === 'messenger' || kind === 'form')) {
      return null;
    }
    return (
      <DevicePropertiesSection
        customer={customer}
        fields={fields}
        collapseCallback={toggleSection}
        isDetail={false}
      />
    );
  };

  renderTabSubContent() {
    const { currentSubTab } = this.state;

    const {
      currentUser,
      taggerRefetchQueries,
      conversation,
      customer,
      toggleSection,
      loading,
      customerFields,
      deviceFields,
      conversationFields
    } = this.props;

    const { kind = '' } = customer.integration || {};

    if (currentSubTab === 'details') {
      return (
        <TabContent>
          <DetailInfo
            customer={customer}
            fields={customerFields}
            isDetail={false}
          />
          <CustomFieldsSection
            loading={loading}
            customer={customer}
            isDetail={false}
          />
          <Box
            title={__('Conversation details')}
            name='showConversationDetails'
            callback={toggleSection}
          >
            <ConversationDetails
              conversation={conversation}
              fields={conversationFields}
            />
            <ConversationCustomFieldsSection conversation={conversation} />
          </Box>
          <TaggerSection
            data={customer}
            type='customer'
            refetchQueries={taggerRefetchQueries}
            collapseCallback={toggleSection}
          />

          {this.renderTrackedData({ customer, kind, toggleSection })}
          {this.renderDeviceProperties({
            customer,
            kind,
            fields: deviceFields,
            toggleSection
          })}
          <WebsiteActivity urlVisits={customer.urlVisits || []} />
        </TabContent>
      );
    }

    if (currentSubTab === 'activity') {
      return (
        <SidebarActivity
          currentUser={currentUser}
          customer={customer}
          currentSubTab={currentSubTab}
        />
      );
    }

    return (
      <>
        <PortableDeals mainType='customer' mainTypeId={customer._id} />
        <PortableTickets mainType='customer' mainTypeId={customer._id} />
        <PortableTasks mainType='customer' mainTypeId={customer._id} />
      </>
    );
  }

  renderTabContent() {
    const { currentTab, currentSubTab } = this.state;
    const { customer, toggleSection } = this.props;

    if (currentTab === 'customer') {
      const detailsOnClick = () => this.onSubtabClick('details');
      const activityOnClick = () => this.onSubtabClick('activity');
      const relatedOnClick = () => this.onSubtabClick('related');

      return (
        <>
          <BasicInfo>
            <InfoSection customer={customer} hideForm={true} />
          </BasicInfo>
          <ActionSection customer={customer} />
          <Tabs full={true}>
            <TabTitle
              className={currentSubTab === 'details' ? 'active' : ''}
              onClick={detailsOnClick}
            >
              {__('Details')}
            </TabTitle>
            <TabTitle
              className={currentSubTab === 'activity' ? 'active' : ''}
              onClick={activityOnClick}
            >
              {__('Activity')}
            </TabTitle>
            <TabTitle
              className={currentSubTab === 'related' ? 'active' : ''}
              onClick={relatedOnClick}
            >
              {__('Related')}
            </TabTitle>
          </Tabs>
          {this.renderTabSubContent()}
        </>
      );
    }

    return (
      <>
        <CompanySection
          mainType='customer'
          mainTypeId={customer._id}
          collapseCallback={toggleSection}
        />
        <Contacts companies={customer.companies} customerId={customer._id} />
      </>
    );
  }

  render() {
    const { currentTab } = this.state;
    const customerOnClick = () => this.onTabClick('customer');
    const companyOnClick = () => this.onTabClick('company');

    return (
      <Sidebar full={true}>
        <Tabs full={true}>
          <TabTitle
            className={currentTab === 'customer' ? 'active' : ''}
            onClick={customerOnClick}
          >
            {__('Customer')}
          </TabTitle>
          <TabTitle
            className={currentTab === 'company' ? 'active' : ''}
            onClick={companyOnClick}
          >
            {__('Company')}
          </TabTitle>
        </Tabs>
        {this.renderTabContent()}
      </Sidebar>
    );
  }
}

export default Index;