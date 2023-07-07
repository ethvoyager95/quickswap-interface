import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { Icon, Progress } from 'antd';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import {
  getTokenContract,
  getSbepContract,
  methods
} from 'utilities/ContractService';
import commaNumber from 'comma-number';
import { sendSupply } from 'utilities/EthContract';
import coinImg from 'assets/img/strike_32.png';
import arrowRightImg from 'assets/img/arrow-right.png';
import { getBigNumber, shortenNumberFormatter } from 'utilities/common';
import styled from 'styled-components';

export const SectionWrapper = styled.div`
  .wallet-section {
  }

  .header {
    display: flex;
    padding: 0px !important;

    @media only screen and (max-width: 768px) {
      flex-direction: column;
    }

    .right-header {
      width: 100%;
      position: relative;

      @media only screen and (max-width: 768px) {
        width: 100%;
      }

      .input-label {
        font-size: 16px;
        color: #c5cbd4;
      }

      .input-section {
        display: flex;
        align-items: center;

        input {
          width: 100%;
          border: none;
          height: 48px;
          font-size: 15px;
          font-weight: 900;
          color: var(--color-text-main);
          background-color: var(--color-bg-main);
          border-radius: 5px;
          border: solid 1px var(--color-bg-main);
          padding: 0 48px 0 24px;
          &:focus {
            outline: none;
          }
        }
        .max {
          position: absolute;
          right: 10px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          color: var(--color-text-main);
          background: linear-gradient(
            242deg,
            #246cf9 0%,
            #1e68f6 0.01%,
            #0047d0 100%,
            #0047d0 100%
          );
          border-radius: 6px;
          padding: 4px 10px;
        }
      }
    }
    .notification {
      width: 100%;
      align-items: center;
      position: relative;
      margin: 15px auto;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      color: #39496a;
    }
  }

  .body {
    .left-content {
      margin-top: 20px;
      width: 100%;
    }

    .right-content {
      margin-top: 20px;
      width: 100%;
    }
  }

  .description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;

    img {
      width: 25px;
      height: 25px;
      margin-right: 20px;
    }

    .label {
      font-size: 16px;
      color: #c5cbd4;
    }

    .value {
      font-size: 17px;
      font-weight: 900;
      color: #39496a;

      &.green {
        color: #1ba27a;
      }
    }

    .arrow-right-img {
      height: 10px;
      width: 15px;
      margin: 0 10px;
    }
  }

  .footer {
    padding: 20px 30px;

    .button-section {
      display: flex;
      justify-content: center;

      .action-button {
        width: 248px;
        height: 41px;
        border-radius: 5px;
        background-color: var(--color-blue);
        background: linear-gradient(
          242deg,
          #246cf9 0%,
          #1e68f6 0.01%,
          #0047d0 100%,
          #0047d0 100%
        );

        .MuiButton-label {
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          text-transform: capitalize;
        }
      }
    }
  }
`;

const format = commaNumber.bindWith(',', '.');
const abortController = new AbortController();

function SupplySection({ asset, settings, setSetting }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [borrowLimit, setBorrowLimit] = useState(new BigNumber(0));
  const [borrowPercent, setBorrowPercent] = useState(new BigNumber(0));
  const [newBorrowLimit, setNewBorrowLimit] = useState(new BigNumber(0));
  const [newBorrowPercent, setNewBorrowPercent] = useState(new BigNumber(0));

  const updateInfo = useCallback(async () => {
    const totalBorrowBalance = getBigNumber(settings.totalBorrowBalance);
    const totalBorrowLimit = getBigNumber(settings.totalBorrowLimit);
    const tokenPrice = getBigNumber(asset.tokenPrice);
    const collateralFactor = getBigNumber(asset.collateralFactor);

    if (tokenPrice && !amount.isZero() && !amount.isNaN()) {
      const temp = totalBorrowLimit.plus(
        amount.times(tokenPrice).times(collateralFactor)
      );
      setNewBorrowLimit(BigNumber.maximum(temp, 0));
      setNewBorrowPercent(totalBorrowBalance.div(temp).times(100));
      if (totalBorrowLimit.isZero()) {
        setBorrowLimit(new BigNumber(0));
        setBorrowPercent(new BigNumber(0));
      } else {
        setBorrowLimit(totalBorrowLimit);
        setBorrowPercent(totalBorrowBalance.div(totalBorrowLimit).times(100));
      }
    } else if (BigNumber.isBigNumber(totalBorrowLimit)) {
      setBorrowLimit(totalBorrowLimit);
      setNewBorrowLimit(totalBorrowLimit);
      if (totalBorrowLimit.isZero()) {
        setBorrowPercent(new BigNumber(0));
        setNewBorrowPercent(new BigNumber(0));
      } else {
        setBorrowPercent(totalBorrowBalance.div(totalBorrowLimit).times(100));
        setNewBorrowPercent(
          totalBorrowBalance.div(totalBorrowLimit).times(100)
        );
      }
    }
  }, [settings.selectedAddress, amount]);

  useEffect(() => {
    setIsEnabled(asset.isEnabled);
  }, [asset.isEnabled]);

  /**
   * Get Allowed amount
   */
  useEffect(() => {
    if (asset.stokenAddress && settings.selectedAddress) {
      updateInfo();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, updateInfo]);
  /**
   * Approve underlying token
   */
  const onApprove = async () => {
    if (asset.id && settings.selectedAddress && asset.id !== 'eth') {
      setIsLoading(true);
      const tokenContract = getTokenContract(asset.id);
      methods
        .send(
          tokenContract.methods.approve,
          [
            asset.stokenAddress,
            new BigNumber(2)
              .pow(256)
              .minus(1)
              .toString(10)
          ],
          settings.selectedAddress
        )
        .then(res => {
          setIsEnabled(true);
          setIsLoading(false);
        })
        .catch(err => {
          setIsLoading(false);
        });
    }
  };

  /**
   * Supply
   */
  const handleSupply = () => {
    const appContract = getSbepContract(asset.id);

    if (asset.id && settings.selectedAddress) {
      setIsLoading(true);
      setSetting({
        pendingInfo: {
          type: 'Supply',
          status: true,
          amount: amount.dp(8, 1).toString(10),
          symbol: asset.symbol
        }
      });
      if (asset.id !== 'eth') {
        methods
          .send(
            appContract.methods.mint,
            [
              amount
                .times(new BigNumber(10).pow(settings.decimals[asset.id].token))
                .toString(10)
            ],
            settings.selectedAddress
          )
          .then(res => {
            setAmount(new BigNumber(0));
            setIsLoading(false);
            setSetting({
              pendingInfo: {
                type: '',
                status: false,
                amount: 0,
                symbol: ''
              }
            });
          })
          .catch(() => {
            setIsLoading(false);
            setSetting({
              pendingInfo: {
                type: '',
                status: false,
                amount: 0,
                symbol: ''
              }
            });
          });
      } else {
        sendSupply(
          settings.selectedAddress,
          amount
            .times(new BigNumber(10).pow(settings.decimals[asset.id].token))
            .toString(10),
          () => {
            setAmount(new BigNumber(0));
            setIsLoading(false);
            setSetting({
              pendingInfo: {
                type: '',
                status: false,
                amount: 0,
                symbol: ''
              }
            });
          }
        );
      }
    }
  };
  /**
   * Max amount
   */
  const handleMaxAmount = () => {
    let maxAmount = asset.walletBalance;
    if (asset.supplyCaps.isGreaterThan(0)) {
      if (asset.supplyCaps.isLessThan(1)) maxAmount = new BigNumber(0);
      else maxAmount = BigNumber.min(maxAmount, asset.supplyCaps);
    }
    setAmount(maxAmount);
  };

  return (
    <SectionWrapper>
      <div className="header">
        {asset.id === 'eth' || isEnabled ? (
          <div className="right-header">
            {/* <div className="input-label">Amount</div> */}
            <div className="input-section">
              <NumberFormat
                value={amount.isZero() ? '0' : amount.toString(10)}
                onValueChange={({ value }) => {
                  setAmount(new BigNumber(value));
                }}
                isAllowed={({ value }) => {
                  return new BigNumber(value || 0).isLessThanOrEqualTo(
                    asset.walletBalance
                  );
                }}
                thousandSeparator
                allowNegative={false}
                placeholder="0"
              />
              <span className="pointer max" onClick={() => handleMaxAmount()}>
                SAFE MAX
              </span>
            </div>
          </div>
        ) : (
          <div className="notification">
            To Supply {asset.name} to the Strike Protocol, you need to approve
            it first.
          </div>
        )}
      </div>
      <div className="wallet-section">
        <div className="description">
          <span className="label">Wallet Balance</span>
          <span className="value">
            {format(
              asset.walletBalance &&
                getBigNumber(asset.walletBalance)
                  .dp(2, 1)
                  .toString(10)
            )}{' '}
            {asset.symbol}
          </span>
        </div>
      </div>
      <div className="body">
        <div className="left-content">
          <div className="description">
            <div className="flex align-center">
              <img src={asset.img} alt="asset" />
              <span className="label">Supply APY</span>
            </div>
            <span className="value green">
              {asset.supplyApy &&
                getBigNumber(asset.supplyApy)
                  .dp(2, 1)
                  .toString(10)}
              %
            </span>
          </div>
          <div className="description">
            <div className="flex align-center">
              <img src={coinImg} alt="asset" />
              <span className="label">Interest APY</span>
            </div>
            <span className="value">
              {shortenNumberFormatter(
                getBigNumber(asset.strkSupplyApy)
                  .dp(2, 1)
                  .toString(10)
              )}
              %
            </span>
          </div>
        </div>
        <div className="right-content">
          <div className="description">
            <span className="label">Borrow Limit</span>
            {amount.isZero() || amount.isNaN() ? (
              <span className="value">
                ${format(borrowLimit.dp(2, 1).toString(10))}
              </span>
            ) : (
              <div className="flex align-center just-between">
                <span className="value">
                  ${format(borrowLimit.dp(2, 1).toString(10))}
                </span>
                <img
                  className="arrow-right-img"
                  src={arrowRightImg}
                  alt="arrow"
                />
                <span className="value">
                  ${format(newBorrowLimit.dp(2, 1).toString(10))}
                </span>
              </div>
            )}
          </div>
          <div className="description">
            <span className="label">Borrow Limit Used</span>
            {amount.isZero() || amount.isNaN() ? (
              <span className="value">
                {borrowPercent.dp(2, 1).toString(10)}%
              </span>
            ) : (
              <div className="flex align-center just-between">
                <span className="value">
                  {borrowPercent.dp(2, 1).toString(10)}%
                </span>
                <img
                  className="arrow-right-img"
                  src={arrowRightImg}
                  alt="arrow"
                />
                <span className="value">
                  {newBorrowPercent.dp(2, 1).toString(10)}%
                </span>
              </div>
            )}
          </div>
          {/* <Progress
            percent={newBorrowPercent.toString(10)}
            strokeColor="#d99d43"
            strokeWidth={7}
            showInfo={false}
          /> */}
        </div>
      </div>
      <div className="footer">
        <div className="button-section">
          {!isEnabled && asset.id !== 'eth' ? (
            <Button
              className="action-button"
              disabled={isLoading}
              onClick={() => {
                onApprove();
              }}
            >
              {isLoading && <Icon type="loading" />} Enable
            </Button>
          ) : (
            <Button
              className="action-button"
              disabled={
                isLoading ||
                amount.isNaN() ||
                amount.isZero() ||
                amount.isGreaterThan(asset.walletBalance) ||
                asset.supplyCaps.isEqualTo(1)
              }
              onClick={handleSupply}
            >
              {isLoading && <Icon type="loading" />} Supply
            </Button>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

SupplySection.propTypes = {
  asset: PropTypes.object,
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired
};

SupplySection.defaultProps = {
  asset: {},
  settings: {}
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

export default compose(connectAccount(mapStateToProps, mapDispatchToProps))(
  SupplySection
);
