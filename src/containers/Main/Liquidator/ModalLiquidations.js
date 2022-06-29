import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import { Modal } from 'antd';
import styled from 'styled-components';

const CustomModal = styled(Modal)`
  .ant-modal-body {
    padding: 70px 60px;
  }

  .ant-modal-close:hover {
    background-color: transparent !important;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-style: normal;
    font-weight: 500;
    font-size: 31px;
    line-height: 120%;
    color: #0b0f23;
  }
`;

function ModalLiquidations({ isOpenModal, onCancel }) {
  return (
    <CustomModal visible={isOpenModal} onCancel={onCancel} footer={null}>
      <ModalContent>
        <div className="title">Recent Liquidations</div>
      </ModalContent>
    </CustomModal>
  );
}

ModalLiquidations.propTypes = {
  isOpenModal: PropTypes.bool,
  onCancel: PropTypes.func
};

ModalLiquidations.defaultProps = {
  isOpenModal: false,
  onCancel: {}
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
)(ModalLiquidations);
