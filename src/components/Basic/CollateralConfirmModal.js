import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal, Spin, Icon } from 'antd';
import closeImg from 'assets/img/close.png';
import logoImg from 'assets/img/logo.png';

const ModalContent = styled.div`
  border-radius: 6px;

  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }

  .logo-text {
    width: 110px;
    margin-top: 84px;
    margin-bottom: 48px;
  }
  .title {
    font-size: 24.5px;
    color: var(--color-text-main);
  }

  .voting-spinner {
    color: var(--color-blue);
    margin-top: 54px;
    margin-bottom: 40px;
  }

  .confirm-text {
    font-size: 21px;
    color: var(--color-text-secondary);
    margin-bottom: 104px;
  }
`;

const antIcon = <Icon type="loading" style={{ fontSize: 64 }} spin />;
function CollateralConfirmModal({ visible, isCollateralEnalbe, onCancel }) {
  return (
    <Modal
      className="collateral-confirm-modal"
      width={532}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <ModalContent className="flex flex-column align-center just-center">
        <img
          className="close-btn pointer"
          src={closeImg}
          alt="close"
          onClick={onCancel}
        />
        <img src={logoImg} alt="logo" className="logo-text" />
        <p className="title">
          {isCollateralEnalbe ? (
            <FormattedMessage id="Disable_as_collateral" />
          ) : (
            <FormattedMessage id="Enable_as_collateral" />
          )}
        </p>
        <Spin className="voting-spinner" indicator={antIcon} />
        <p className="confirm-text">
          <FormattedMessage id="Confirm_the_transaction" />
        </p>
      </ModalContent>
    </Modal>
  );
}

CollateralConfirmModal.propTypes = {
  visible: PropTypes.bool,
  isCollateralEnalbe: PropTypes.bool,
  onCancel: PropTypes.func
};

CollateralConfirmModal.defaultProps = {
  visible: false,
  isCollateralEnalbe: true,
  onCancel: () => {}
};

export default CollateralConfirmModal;
