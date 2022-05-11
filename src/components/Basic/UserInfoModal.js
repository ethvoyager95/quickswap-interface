import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import closeImg from 'assets/img/close.png';
import logoImg from 'assets/img/strike_32.png';
import { connectAccount, accountActionCreators } from 'core';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import AnimatedNumber from 'animated-number-react';
import { getBigNumber } from 'utilities/common';
import commaNumber from 'comma-number';

const ModalContent = styled.div`
  border-radius: 5px;
  background-color: var(--color-bg-primary);
  padding: 0 64px 32px;
  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }
  .header {
    padding: 24px;
    font-size: 16px;
    font-weight: bold;
  }
  .header-content {
    margin-top: 16px;
    .logo-image {
      margin-bottom: 40px;
    }
  }
  .disconnect-btn {
    color: #d01f36;
    font-weight: bold;
    font-size: 17px;
  }
  .label {
    font-size: 16px;
    font-weight: normal;
    color: var(--color-text-secondary);
  }
  .value {
    font-size: 17px;
    font-weight: 900;
    color: var(--color-text-main);
  }
  .description {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media only screen and (max-width: 768px) {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 10px;
    }
  }
  .info-wrapper {
    width: 100%;
  }
`;

function UserInfoModal({ visible, onCancel, available, settings }) {
  const format = commaNumber.bindWith(',', '.');

  const formatValue = value => {
    return `$${format(
      getBigNumber(value)
        .dp(2, 1)
        .toString(10)
    )}`;
  };
  return (
    <Modal
      className="connect-modal"
      width={432}
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
        <div className="header">STRIKE Balance</div>
        <div className="flex align-center just-center header-content">
          <img src={logoImg} alt="logo" className="logo-image" />
        </div>
        <div className="flex flex-column info-wrapper">
          <div className="description">
            <p className="label">Available Credit</p>
            <p className="value">{available}</p>
          </div>
          <div className="description">
            <p className="label">Supply Balance</p>
            <p className="value">
              <AnimatedNumber
                value={getBigNumber(settings.totalSupplyBalance)
                  .dp(2, 1)
                  .toString(10)}
                formatValue={formatValue}
                duration={2000}
              />
            </p>
          </div>
          <div className="description">
            <p className="label">Borrow Balance</p>
            <p className="value">
              <AnimatedNumber
                value={getBigNumber(settings.totalBorrowBalance)
                  .dp(2, 1)
                  .toString(10)}
                formatValue={formatValue}
                duration={2000}
              />
            </p>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

UserInfoModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  settings: PropTypes.object,
  available: PropTypes.string
};

UserInfoModal.defaultProps = {
  visible: false,
  settings: {},
  onCancel: () => {},
  available: '0'
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting, getGovernanceStrike } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting,
      getGovernanceStrike
    },
    dispatch
  );
};

export default compose(connectAccount(mapStateToProps, mapDispatchToProps))(
  UserInfoModal
);
