import ModalTrigger from 'modules/common/components/ModalTrigger';
import { IButtonMutateProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import React from 'react';
import List from '../../common/components/List';
import { ICommonListProps } from '../../common/types';
import CategoryList from 'modules/settings/template/containers/productCategory/CategoryList';
import {
  Actions,
  IframePreview,
  Template,
  TemplateBox,
  Templates
} from '../styles';
import Form from './Form';
import { EMAIL_TEMPLATE_STATUSES, EMAIL_TEMPLATE_TIPTEXT } from '../constants';
import Tip from 'modules/common/components/Tip';
import Icon from 'modules/common/components/Icon';

type Props = {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  changeStatus: (_id: string, status: string) => void;
} & ICommonListProps;

class EmailTemplateList extends React.Component<Props> {
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };

  renderDisableAction = object => {
    const { changeStatus } = this.props;
    const _id = object._id;
    const isActive =
      object.status === null ||
      object.status === EMAIL_TEMPLATE_STATUSES.ACTIVE;
    const icon = isActive ? 'archive-alt' : 'redo';

    const status = isActive
      ? EMAIL_TEMPLATE_STATUSES.ARCHIVED
      : EMAIL_TEMPLATE_STATUSES.ACTIVE;

    const text = isActive
      ? EMAIL_TEMPLATE_TIPTEXT.ARCHIVED
      : EMAIL_TEMPLATE_TIPTEXT.ACTIVE;

    if (!changeStatus) {
      return null;
    }

    const onClick = () => changeStatus(_id, status);

    return (
      <Tip text={__(text)}>
        <div onClick={onClick}>
          <Icon icon={icon} /> {text}
        </div>
      </Tip>
    );
  };

  removeTemplate = object => {
    this.props.remove(object._id);
  };

  renderEditAction = object => {
    const { save } = this.props;

    const content = props => {
      return this.renderForm({ ...props, object, save });
    };

    return (
      <ModalTrigger
        enforceFocus={false}
        title="Edit"
        size="lg"
        trigger={
          <div>
            <Icon icon="edit" /> Edit
          </div>
        }
        content={content}
      />
    );
  };

  renderRow({ objects }) {
    return objects.map((object, index) => (
      <Template key={index}>
        <TemplateBox>
          <Actions>
            {this.renderEditAction(object)}
            <div onClick={this.removeTemplate.bind(this, object)}>
              <Icon icon="cancel-1" /> Delete
            </div>
            {this.renderDisableAction(object)}
          </Actions>
          <IframePreview>
            <iframe title="content-iframe" srcDoc={object.content} />
          </IframePreview>
        </TemplateBox>
        <h5>{object.name}</h5>
      </Template>
    ));
  }

  renderContent = props => {
    return <Templates>{this.renderRow(props)}</Templates>;
  };

  render() {
    return (
      <List
        formTitle="New email template"
        size="lg"
        breadcrumb={[
          { title: __('Settings'), link: '/settings' },
          { title: __('Email templates') }
        ]}
        title={__('Email templates')}
        renderForm={this.renderForm}
        rightActionBar={true}
        renderContent={this.renderContent}
        leftSidebar={<CategoryList queryParams={this.props.queryParams} />}
        {...this.props}
        queryParams={this.props.queryParams}
        history={this.props.history}
      />
    );
  }
}

export default EmailTemplateList;
