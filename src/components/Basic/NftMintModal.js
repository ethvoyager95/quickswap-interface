import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'antd';
import closeImg from 'assets/img/close.png';
import { connectAccount, accountActionCreators } from 'core';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { getNFTContract, methods } from 'utilities/ContractService';
import BigNumber from 'bignumber.js';
import { nftMint } from 'utilities/EthContract';
import DegenApeLogo from 'assets/img/degen_ape_logo.svg';

const ModalContent = styled.div`
  border-radius: 5px;
  padding: 0 24px 32px;
  user-select: none;

  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }
  .header {
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      height: 48px;
    }

    span {
      font-size: 18px;
      font-weight: bold;
      background: linear-gradient(180deg, #fc7bff 1%, #4515cf 99%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .header-content {
    margin: 16px 0px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 16px;
    font-weight: bold;

    span:first-child {
      color: #1890ff;
    }
  }
  .mint-btn {
    background-color: #1890ff;
    color: white;
    width: 100%;
    padding: 5px 0px;
    font-weight: bold;
    font-size: 17px;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }
  .max-btn {
    background-color: #1890ff;
    color: white;
    padding: 5px 15px;
    font-weight: bold;
    font-size: 17px;
    border-radius: 4px;
    cursor: pointer;
  }
  .info-wrapper {
    width: 100%;
    gap: 10px;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--color-text-secondary);

    .label {
      font-size: 16px;
      font-weight: normal;
      color: #1890ff;
    }
    .value {
      font-size: 17px;
      font-weight: 900;
      color: var(--color-text-main);
    }
    .amount_area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      font-size: 17px;
      font-weight: bold;
    }
  }
`;

function NftMintModal({ visible, onCancel, settings }) {
  // const format = commaNumber.bindWith(',', '.');

  // const formatValue = value => {
  //   return `$${format(
  //     getBigNumber(value)
  //       .dp(2, 1)
  //       .toString(10)
  //   )}`;
  // };
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(1);
  const [ethBalance, setEthBalance] = useState(new BigNumber(0));
  const [price, setPrice] = useState(new BigNumber(0));
  const [totalPrice, setTotalPrice] = useState(new BigNumber(0));

  const nftContract = getNFTContract();

  const fetchEthBalance = async () => {
    const balance = await window.web3.eth.getBalance(settings.selectedAddress);
    setEthBalance(new BigNumber(balance));
  };

  useEffect(() => {
    if (window.web3.eth && settings.selectedAddress) fetchEthBalance();
  }, [settings.selectedAddress, window.web3]);

  useEffect(() => {
    const fetchMintPrice = async () => {
      if (nftContract) {
        await methods
          .call(nftContract.methods.PRICE, [])
          .then(res => {
            setPrice(new BigNumber(res));
          })
          .catch(err => {
            throw err;
          });
      }
    };
    fetchMintPrice();
  }, []);

  useEffect(() => {
    setTotalPrice(price.times(amount));
  }, [amount, price]);

  const handleMint = async () => {
    setIsLoading(true);
    await nftMint(settings.selectedAddress, totalPrice.toString(10), amount);
    fetchEthBalance();
    setIsLoading(false);
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
        <a
          className="header"
          href="https://www.degenapestrike.org/#mint"
          target="_blank"
          rel="noreferrer"
        >
          <img src={DegenApeLogo} alt="degen_ape_logo" />
          <span>Degen APE Strike Club</span>
        </a>
        <div className="flex align-center just-center header-content">
          {/* <span>Presale starts on 21th Jan at 12:00 am UTC</span> */}
          <span>6,500 NFTS</span>
        </div>
        <div className="flex flex-column info-wrapper">
          <div className="item">
            <span className="label">ETH BALANCE</span>
            <span className="value">
              {ethBalance
                .div(1e18)
                .dp(2)
                .toFormat()}{' '}
              ETH
            </span>
          </div>

          <div className="item">
            <span className="label">AMOUNT</span>
            <div className="amount_area">
              <Icon
                type="minus"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (amount > 1) setAmount(amount - 1);
                }}
              />
              <span className="label">{amount}</span>
              <Icon
                type="plus"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (amount < 30) setAmount(amount + 1);
                }}
              />
            </div>
            <Button className="max-btn" onClick={() => setAmount(30)}>
              MAX
            </Button>
          </div>

          <div className="item">
            <span className="label">TOTAL PRICE</span>
            <span className="value">
              {totalPrice
                .div(1e18)
                .dp(3)
                .toFormat()}{' '}
              ETH
            </span>
          </div>

          <Button
            disabled={isLoading || totalPrice.isGreaterThan(ethBalance)}
            className="mint-btn"
            onClick={() => handleMint()}
          >
            {isLoading && <Icon type="loading" />} MINT
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

NftMintModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  settings: PropTypes.object
};

NftMintModal.defaultProps = {
  visible: false,
  settings: {},
  onCancel: () => {}
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
  NftMintModal
);
