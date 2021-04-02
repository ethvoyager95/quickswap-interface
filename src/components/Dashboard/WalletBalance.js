import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import styled from 'styled-components';
import CircleProgressBar from 'components/Basic/CircleProgressBar';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import AnimatedNumber from 'animated-number-react';
import { getBigNumber } from 'utilities/common';
import Toggle from 'components/Basic/Toggle';
import { Label } from 'components/Basic/Label';

const CardWrapper = styled.div`
  width: 100%;
  padding: 24px 0 24px 45px;
  border-bottom: 1px solid #eef1fa;
  display: flex;
  justify-content: space-between;

  @media only screen and (max-width: 768px) {
    padding: 24px;
  }

  .balance-value {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    min-width: 220px;

    .label {
      font-size: 15px;
      font-weight: 900;
      color: var(--color-text-secondary);
    }

    .value {
      font-size: 25px;
      font-weight: 900;
      color: var(--color-text-main);
      margin-top: 10px;
    }
  }

  .progress {
    display: flex;
    align-items: center;
    margin: 10px 0;
    flex: 1 1 0%;
    .apy-toggle {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0;

      .toggel-label {
        margin-top: 15px;
        .emoji {
          color: transparent;
          text-shadow: 0 0 0 grey;
        }
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .label {
      font-size: 16px;
    }
    .value {
      font-size: 20px;
    }
  }

  @media only screen and (max-width: 1280px) {
    .label {
      font-size: 16px;
    }
    .value {
      font-size: 20px;
    }
  }
`;

const format = commaNumber.bindWith(',', '.');
const abortController = new AbortController();

function WalletBalance({ settings, setSetting }) {
  const [netAPY, setNetAPY] = useState('0');
  const [withSTRK, setWithSTRK] = useState(false);

  const updateNetAPY = useCallback(async () => {
    let totalSum = new BigNumber(0);
    let totalSupplied = new BigNumber(0);
    let totalBorrowed = new BigNumber(0);
    const { assetList } = settings;
    assetList.forEach(asset => {
      const {
        supplyBalance,
        borrowBalance,
        tokenPrice,
        supplyApy,
        borrowApy,
        strkSupplyApy,
        strkBorrowApy
      } = asset;
      const supplyBalanceUSD = getBigNumber(supplyBalance).times(getBigNumber(tokenPrice));
      const borrowBalanceUSD = getBigNumber(borrowBalance).times(getBigNumber(tokenPrice));
      totalSupplied = totalSupplied.plus(supplyBalanceUSD);
      totalBorrowed = totalSupplied.plus(borrowBalanceUSD);

      const supplyApyWithSTRK = withSTRK
        ? getBigNumber(supplyApy).plus(getBigNumber(strkSupplyApy))
        : getBigNumber(supplyApy);
      const borrowApyWithSTRK = withSTRK
        ? getBigNumber(strkBorrowApy).minus(getBigNumber(borrowApy))
        : getBigNumber(borrowApy).times(-1);

      // const supplyApyWithSTRK = getBigNumber(supplyApy);
      // const borrowApyWithSTRK = getBigNumber(borrowApy).times(-1);
      totalSum = totalSum.plus(
        supplyBalanceUSD
          .times(supplyApyWithSTRK.div(100))
          .plus(borrowBalanceUSD.times(borrowApyWithSTRK.div(100)))
      );
    });

    if (totalSum.isZero() || totalSum.isNaN()) {
      setNetAPY(0);
    } else if (totalSum.isGreaterThan(0)) {
      setNetAPY(
        totalSupplied.isZero()
          ? 0
          : totalSum
              .div(totalSupplied)
              .times(100)
              .dp(2, 1)
              .toString(10)
      );
    } else {
      setNetAPY(
        totalBorrowed.isZero()
          ? 0
          : totalSum
              .div(totalBorrowed)
              .times(100)
              .dp(2, 1)
              .toString(10)
      );
    }
  }, [settings.assetList, withSTRK]);

  useEffect(() => {
    if (
      settings.selectedAddress &&
      settings.assetList &&
      settings.assetList.length > 0
    ) {
      updateNetAPY();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, updateNetAPY]);

  useEffect(() => {
    setSetting({
      withSTRK
    });
  }, [withSTRK]);

  const formatValue = value => {
    return `$${format(
      getBigNumber(value)
        .dp(2, 1)
        .toString(10)
    )}`;
  };

  return (
    <CardWrapper>
      <div className="balance-value">
        <div className="wallet-balance">
          <div className="label">Supply Balance</div>
          <div className="value">
            <AnimatedNumber
              value={getBigNumber(settings.totalSupplyBalance)
                .dp(2, 1)
                .toString(10)}
              formatValue={formatValue}
              duration={2000}
            />
          </div>
        </div>
        <div className="borrow-balance">
          <div className="label">Borrow Balance</div>
          <div className="value">
            <AnimatedNumber
              value={getBigNumber(settings.totalBorrowBalance)
                .dp(2, 1)
                .toString(10)}
              formatValue={formatValue}
              duration={2000}
            />
          </div>
        </div>
      </div>
      <div className="progress">
        <CircleProgressBar
          percent={netAPY}
          width={150}
          label="Net APY"
          borrow={getBigNumber(settings.totalBorrowBalance)
            .dp(2, 1)
            .toString(10)}
          supply={getBigNumber(settings.totalSupplyBalance)
            .dp(2, 1)
            .toString(10)}
        />
        {/* <div className="apy-toggle">
          <Toggle checked={withSTRK} onChecked={() => setWithSTRK(!withSTRK)} />
          <Label size="14" primary className="toggel-label">
            {withSTRK ? (
              '🔥 APY with STRK'
            ) : (
              <div>
                <span className="emoji">🔥</span>APY without STRK
              </div>
            )}
          </Label>
        </div> */}
      </div>
    </CardWrapper>
  );
}

WalletBalance.propTypes = {
  settings: PropTypes.object
};

WalletBalance.defaultProps = {
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
  WalletBalance
);
