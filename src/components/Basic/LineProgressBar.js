import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Progress } from 'antd';

const LineProgressBarWrapper = styled.div`
  width: 100%;

  .label {
    font-size: 13.5px;
    font-weight: 900;
    color: var(--color-text-secondary);

    &.market {
      color: var(--color-text-main);
      font-size: 15.5px;
    }
  }

  .percent {
    font-size: 18px;
    font-weight: 900;
    color: var(--color-text-main);

    &.market {
      color: var(--color-blue);
      font-size: 14.5px;
    }
  }

  .ant-progress {
    .ant-progress-inner {
      background-color: (--color-blue);
    }
  }
`;

function LineProgressBar({ label, percent, type }) {
  return (
    <LineProgressBarWrapper>
      <div className="flex align-center just-between">
        <p className={`label ${type === 'market' ? 'market' : ''}`}>{label}</p>
        <p className={`percent ${type === 'market' ? 'market' : ''}`}>
          {percent}%
        </p>
      </div>
      <Progress
        percent={percent}
        strokeColor="#277ee6"
        strokeWidth={7}
        showInfo={false}
      />
    </LineProgressBarWrapper>
  );
}

LineProgressBar.propTypes = {
  label: PropTypes.string,
  percent: PropTypes.number,
  type: PropTypes.string
};

LineProgressBar.defaultProps = {
  label: 'Borrow Limit',
  percent: 0.0,
  type: 'borrow'
};

export default LineProgressBar;
