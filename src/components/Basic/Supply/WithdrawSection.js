import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { Icon, Progress } from 'antd';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import { getSbepContract, methods } from 'utilities/ContractService';
import commaNumber from 'comma-number';
import coinImg from 'assets/img/strike_32.png';
import arrowRightImg from 'assets/img/arrow-right.png';
import { getBigNumber, shortenNumberFormatter } from 'utilities/common';
import { SectionWrapper } from 'components/Basic/Supply/SupplySection';

const format = commaNumber.bindWith(',', '.');
const abortController = new AbortController();

function WithdrawSection({ asset, settings, changeTab, onCancel, setSetting }) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [borrowLimit, setBorrowLimit] = useState(new BigNumber(0));
  const [borrowPercent, setBorrowPercent] = useState(new BigNumber(0));
  const [newBorrowLimit, setNewBorrowLimit] = useState(new BigNumber(0));
  const [newBorrowPercent, setNewBorrowPercent] = useState(new BigNumber(0));
  const [safeMaxBalance, setSafeMaxBalance] = useState(new BigNumber(0));

  const updateInfo = useCallback(async () => {
    const totalBorrowBalance = getBigNumber(settings.totalBorrowBalance);
    const totalBorrowLimit = getBigNumber(settings.totalBorrowLimit);
    const tokenPrice = getBigNumber(asset.tokenPrice);
    const { collateral } = asset;
    const supplyBalance = getBigNumber(asset.supplyBalance);
    const collateralFactor = getBigNumber(asset.collateralFactor);
    if (!collateral) {
      setSafeMaxBalance(supplyBalance);
      return;
    }
    const safeMax = BigNumber.maximum(
      totalBorrowLimit
        .minus(totalBorrowBalance.div(40).times(100))
        .div(collateralFactor)
        .div(tokenPrice),
      new BigNumber(0)
    );
    setSafeMaxBalance(BigNumber.minimum(safeMax, supplyBalance));

    if (tokenPrice && !amount.isZero() && !amount.isNaN()) {
      const temp = totalBorrowLimit.minus(
        amount.times(tokenPrice).times(collateralFactor)
      );
      setNewBorrowLimit(temp);
      setNewBorrowPercent(totalBorrowBalance.div(temp).times(100));
      if (totalBorrowLimit.isZero()) {
        setBorrowLimit(new BigNumber(0));
        setBorrowPercent(new BigNumber(0));
      } else {
        setBorrowLimit(totalBorrowLimit);
        setBorrowPercent(totalBorrowBalance.div(totalBorrowLimit).times(100));
      }
    } else {
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
    if (asset.stokenAddress && settings.selectedAddress) {
      updateInfo();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, updateInfo]);

  /**
   * Withdraw
   */
  const handleWithdraw = async () => {
    const { id: assetId } = asset;
    const appContract = getSbepContract(assetId);
    if (assetId && settings.selectedAddress) {
      setIsLoading(true);
      setSetting({
        pendingInfo: {
          type: 'Withdraw',
          status: true,
          amount: amount.dp(8, 1).toString(10),
          symbol: asset.symbol
        }
      });
      try {
        if (amount.eq(asset.supplyBalance)) {
          const sTokenBalance = await methods.call(
            appContract.methods.balanceOf,
            [settings.selectedAddress]
          );
          await methods.send(
            appContract.methods.redeem,
            [sTokenBalance],
            settings.selectedAddress
          );
        } else {
          await methods.send(
            appContract.methods.redeemUnderlying,
            [
              amount
                .times(new BigNumber(10).pow(settings.decimals[assetId].token))
                .integerValue()
                .toString(10)
            ],
            settings.selectedAddress
          );
        }
        setAmount(new BigNumber(0));
        setIsLoading(false);
        onCancel();
        setSetting({
          pendingInfo: {
            type: '',
            status: false,
            amount: 0,
            symbol: ''
          }
        });
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
    setAmount(safeMaxBalance);
  };

  return (
    <SectionWrapper>
      <div className="header">
        <div className="right-header">
          {/* <div className="input-label">Amount</div> */}
          <div className="input-section">
            <NumberFormat
              autoFocus
              value={amount.isZero() ? '0' : amount.toString(10)}
              onValueChange={({ value }) => {
                setAmount(new BigNumber(value));
              }}
              isAllowed={({ value }) => {
                const temp = new BigNumber(value || 0);
                const { totalBorrowLimit } = settings;
                const { tokenPrice, collateralFactor } = asset;
                return (
                  temp.isLessThanOrEqualTo(asset.supplyBalance) &&
                  getBigNumber(totalBorrowLimit).isGreaterThanOrEqualTo(
                    temp.times(tokenPrice).times(collateralFactor)
                  )
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
      </div>
      <div className="wallet-section">
        <div className="description">
          <span className="label">Protocol Balance</span>
          <span className="value">
            {format(
              asset.supplyBalance && asset.supplyBalance.dp(2, 1).toString(10)
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
          <Button
            className="action-button"
            disabled={
              isLoading ||
              amount.isNaN() ||
              amount.isZero() ||
              amount.isGreaterThan(asset.supplyBalance) ||
              newBorrowPercent.isGreaterThan(new BigNumber(100))
            }
            onClick={handleWithdraw}
          >
            {isLoading && <Icon type="loading" />} Withdraw
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

WithdrawSection.propTypes = {
  asset: PropTypes.object,
  settings: PropTypes.object,
  changeTab: PropTypes.func,
  onCancel: PropTypes.func,
  setSetting: PropTypes.func.isRequired
};

WithdrawSection.defaultProps = {
  asset: {},
  settings: {},
  changeTab: () => {},
  onCancel: () => {}
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
  WithdrawSection
);
