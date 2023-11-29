import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import { compose } from 'recompose';
import { connectAccount } from 'core';
import LineProgressBar from 'components/Basic/LineProgressBar';
import { getBigNumber } from 'utilities/common';

const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 24px;
  }

  .available {
    .credit-text {
      font-size: 13.5px;
      font-weight: 900;
      color: var(--color-text-secondary);
    }

    .usd-price {
      font-size: 28.5px;
      font-weight: 900;
      color: var(--color-text-main);
      @media only screen and (max-width: 768px) {
        font-size: 18px;
      }
    }
  }

  .progress {
    width: 100%;
  }
`;

const format = commaNumber.bindWith(',', '.');
const abortController = new AbortController();

function BorrowLimit({ settings }) {
  const [available, setAvailable] = useState('0');
  const [borrowPercent, setBorrowPercent] = useState('0');

  useEffect(() => {
    const totalBorrowBalance = getBigNumber(settings.totalBorrowBalance);
    const totalBorrowLimit = getBigNumber(settings.totalBorrowLimit);
    const total = BigNumber.maximum(totalBorrowLimit, 0);
    setAvailable(total.dp(2, 1).toString(10));
    setBorrowPercent(
      total.isZero() || total.isNaN()
        ? 0
        : totalBorrowBalance
            .div(total)
            .times(100)
            .dp(0, 1)
            .toString(10)
    );
    return function cleanup() {
      abortController.abort();
    };
  }, [
    settings.totalBorrowBalance,
    settings.totalBorrowLimit,
    settings.selectedAddress
  ]);

  return (
    <CardWrapper>
      <div className="available">
        <div className="credit-text">Available Credit</div>
        <div className="usd-price">${format(available)}</div>
      </div>
      <div className="progress">
        <LineProgressBar
          label="Borrow Limit"
          percent={Number(borrowPercent)}
          borrowLimit={format(
            new BigNumber(available)
              .times(80)
              .div(100)
              .dp(2)
              .toString(10)
          )}
        />
      </div>
    </CardWrapper>
  );
}

BorrowLimit.propTypes = {
  settings: PropTypes.object
};

BorrowLimit.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(BorrowLimit);
