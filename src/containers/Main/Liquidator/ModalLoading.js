import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { CustomModal, ModalLoadingContent } from './style';
import './overide.scss';

function ModalLoading({ isOpenModal, onCancel, action }) {
  return (
    <CustomModal
      centered
      width="535px"
      visible={isOpenModal}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      loading
    >
      <ModalLoadingContent>
        <LoadingSpinner size={80} />
        <div className="title">{action}</div>
      </ModalLoadingContent>
    </CustomModal>
  );
}

ModalLoading.propTypes = {
  isOpenModal: PropTypes.bool,
  onCancel: PropTypes.func,
  action: PropTypes.string
};

ModalLoading.defaultProps = {
  isOpenModal: false,
  onCancel: {},
  action: ''
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(ModalLoading);
