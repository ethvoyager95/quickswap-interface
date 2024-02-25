import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import { bindActionCreators } from 'redux';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import { Icon, Progress } from 'antd';
import { connectAccount, accountActionCreators } from 'core';
import {
  getSbepContract,
  getTokenContract,
  methods
} from 'utilities/ContractService';
import { sendRepay } from 'utilities/EthContract';
import { getBigNumber, shortenNumberFormatter } from 'utilities/common';
import { SectionWrapper } from 'components/Basic/Supply/SupplySection';
import ConnectButton from 'containers/Layout/ConnectButton';
import IconQuestion from 'assets/img/question.png';
import arrowRightImg from 'assets/img/arrow-right.png';
import coinImg from 'assets/img/strike_32.png';
import { useInstance } from 'hooks/useContract';

const format = commaNumber.bindWith(',', '.');
const abortController = new AbortController();

function RepayBorrowTab({ asset, settings, setSetting, hideModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [borrowBalance, setBorrowBalance] = useState(new BigNumber(0));
  const [borrowPercent, setBorrowPercent] = useState(new BigNumber(0));
  const [newBorrowBalance, setNewBorrowBalance] = useState(new BigNumber(0));
  const [newBorrowPercent, setNewBorrowPercent] = useState(new BigNumber(0));
  const instance = useInstance(settings.walletConnected);

  const updateInfo = useCallback(() => {
    const totalBorrowBalance = getBigNumber(settings.totalBorrowBalance);
    const totalBorrowLimit = getBigNumber(settings.totalBorrowLimit);
    const tokenPrice = getBigNumber(asset.tokenPrice);
    if (amount.isZero() || amount.isNaN()) {
      setBorrowBalance(totalBorrowBalance);
      if (totalBorrowLimit.isZero()) {
        setBorrowPercent(new BigNumber(0));
        setNewBorrowPercent(new BigNumber(0));
      } else {
        setBorrowPercent(totalBorrowBalance.div(totalBorrowLimit).times(100));
        setNewBorrowPercent(
          totalBorrowBalance.div(totalBorrowLimit).times(100)
        );
      }
    } else {
      const temp = totalBorrowBalance.minus(amount.times(tokenPrice));
      setBorrowBalance(totalBorrowBalance);
      setNewBorrowBalance(temp);
      if (totalBorrowLimit.isZero()) {
        setBorrowPercent(new BigNumber(0));
        setNewBorrowPercent(new BigNumber(0));
      } else {
        setBorrowPercent(totalBorrowBalance.div(totalBorrowLimit).times(100));
        setNewBorrowPercent(temp.div(totalBorrowLimit).times(100));
      }
    }
  }, [settings.selectedAddress, amount, asset]);

  useEffect(() => {
    if (asset.stokenAddress && settings.selectedAddress) {
      updateInfo();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, updateInfo, asset]);

  /**
   * Approve underlying token
   */
  const onApprove = async () => {
    if (asset && settings.selectedAddress && asset.id !== 'eth') {
      setIsLoading(true);
      const tokenContract = getTokenContract(instance, asset.id);
      methods
        .send(
          instance,
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
   * Repay Borrow
   */
  const handleRepayBorrow = async () => {
    const appContract = getSbepContract(instance, asset.id);
    if (asset && settings.selectedAddress) {
      setIsLoading(true);
      setSetting({
        pendingInfo: {
          type: 'Repay_Borrow',
          status: true,
          amount: amount.dp(8, 1).toString(10),
          symbol: asset.symbol
        }
      });
      try {
        if (asset.id !== 'eth') {
          if (amount.eq(asset.borrowBalance)) {
            await methods.send(
              instance,
              appContract.methods.repayBorrow,
              [
                new BigNumber(2)
                  .pow(256)
                  .minus(1)
                  .toString(10)
              ],
              settings.selectedAddress
            );
          } else {
            await methods.send(
              instance,
              appContract.methods.repayBorrow,
              [
                amount
                  .times(
                    new BigNumber(10).pow(settings.decimals[asset.id].token)
                  )
                  .integerValue()
                  .toString(10)
              ],
              settings.selectedAddress
            );
          }
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
          hideModal();
        } else {
          sendRepay(
            instance,
            settings.selectedAddress,
            amount
              .times(new BigNumber(10).pow(settings.decimals[asset.id].token))
              .integerValue()
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
              hideModal();
            }
          );
        }
      } catch (error) {
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
    }
  };

  /**
   * Max amount
   */
  const handleMaxAmount = () => {
    setAmount(
      BigNumber.minimum(
        asset.walletBalance.dp(settings.decimals[asset.id].token, 0),
        asset.borrowBalance.dp(settings.decimals[asset.id].token, 0)
      )
    );
  };

  useEffect(() => {
    if (amount.isNaN()) {
      setIsEnabled(new BigNumber(asset.allowBalance || 0).isGreaterThan(0));
    } else {
      setIsEnabled(
        new BigNumber(asset.allowBalance || 0).isGreaterThan(0) &&
          new BigNumber(asset.allowBalance || 0).isGreaterThanOrEqualTo(amount)
      );
    }
  }, [asset.allowBalance, amount]);

  return (
    <SectionWrapper>
      {!settings.selectedAddress ? (
        <>
          <div className="alert">
            <img src={IconQuestion} alt="info" />
            <span>
              <FormattedMessage id="connect_wallet_repay" />
            </span>
          </div>
          <ConnectButton />
        </>
      ) : (
        <>
          <div className="header">
            {asset.id === 'eth' || isEnabled ? (
              <div className="right-header">
                {/* <div className="input-label">Amount</div> */}
                <div className="input-section">
                  <NumberFormat
                    autoFocus
                    value={amount.isZero() ? '0' : amount.toString(10)}
                    onValueChange={values => {
                      const { value } = values;
                      setAmount(new BigNumber(value));
                    }}
                    decimalScale={settings.decimals[asset.id].token}
                    isAllowed={({ value }) => {
                      return new BigNumber(value || 0).isLessThanOrEqualTo(
                        BigNumber.minimum(
                          asset.walletBalance,
                          asset.borrowBalance
                        )
                      );
                    }}
                    thousandSeparator
                    allowNegative={false}
                    placeholder="0"
                  />
                  <span
                    className="pointer max"
                    onClick={() => handleMaxAmount()}
                  >
                    <FormattedMessage id="MAX" />
                  </span>
                </div>
              </div>
            ) : (
              <div className="notification">
                <FormattedMessage
                  id="Repay_desc"
                  values={{ name: asset.name }}
                />
              </div>
            )}
          </div>
          <div className="wallet-section">
            <div className="description">
              <span className="label">
                <FormattedMessage id="Wallet_Balance" />
              </span>
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
                  <span className="label">
                    <FormattedMessage id="Borrow_APY" />
                  </span>
                </div>
                <span className="value green">
                  {asset.borrowApy &&
                    getBigNumber(asset.borrowApy)
                      .dp(2, 1)
                      .toString(10)}
                  %
                </span>
              </div>
              <div className="description">
                <div className="flex align-center">
                  <img src={coinImg} alt="asset" />
                  <span className="label">
                    <FormattedMessage id="Interest_APY" />
                  </span>
                </div>
                <span className="value">
                  {shortenNumberFormatter(
                    getBigNumber(asset.strkBorrowApy)
                      .dp(2, 1)
                      .toString(10)
                  )}
                  %
                </span>
              </div>
            </div>
            <div className="right-content">
              <div className="description">
                <span className="label">
                  <FormattedMessage id="Borrow_Balance" />
                </span>
                {amount.isZero() || amount.isNaN() ? (
                  <span className="value">
                    ${format(borrowBalance.dp(2, 1).toString(10))}
                  </span>
                ) : (
                  <div className="flex align-center just-between">
                    <span className="value">
                      ${format(borrowBalance.dp(2, 1).toString(10))}
                    </span>
                    <img
                      className="arrow-right-img"
                      src={arrowRightImg}
                      alt="arrow"
                    />
                    <span className="value">
                      ${newBorrowBalance.dp(2, 1).toString(10)}
                    </span>
                  </div>
                )}
              </div>
              <div className="description">
                <span className="label">
                  <FormattedMessage id="Borrow_Limit_Used" />
                </span>
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
                  {isLoading && <Icon type="loading" />}{' '}
                  <FormattedMessage id="Enable" />
                </Button>
              ) : (
                <Button
                  className="action-button"
                  disabled={
                    isLoading ||
                    amount.isZero() ||
                    amount.isNaN() ||
                    amount.isGreaterThan(
                      BigNumber.minimum(
                        asset.walletBalance,
                        asset.borrowBalance
                      )
                    )
                  }
                  onClick={handleRepayBorrow}
                >
                  {isLoading && <Icon type="loading" />}{' '}
                  <FormattedMessage id="Repay" />
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </SectionWrapper>
  );
}

RepayBorrowTab.propTypes = {
  asset: PropTypes.object,
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired
};

RepayBorrowTab.defaultProps = {
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
  RepayBorrowTab
);
