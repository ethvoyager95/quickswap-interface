import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Progress, Tooltip } from 'antd';
import safeImg from 'assets/img/safe.svg';
import IconQuestion from 'assets/img/question.png';

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

  .progress {
    width: 100%;
    position: relative;

    .limit-mark {
      position: absolute;
      left: 80%;
      top: 8px;
      width: 5px;
      height: 8px;
      background: #f9053e;
    }
  }

  .safe-line {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 10px;
    color: var(--color-text-main);
  }
`;

const SQuestion = styled.img`
  margin-left: 10px;
`;

function LineProgressBar({ label, percent, type, borrowLimit }) {
  return (
    <LineProgressBarWrapper>
      <div className="flex align-center just-between">
        <p className={`label ${type === 'market' ? 'market' : ''}`}>{label}</p>
        <p className={`percent ${type === 'market' ? 'market' : ''}`}>
          {percent}%
        </p>
      </div>
      <div className="progress">
        <Progress
          percent={percent}
          strokeColor="#277ee6"
          strokeWidth={7}
          showInfo={false}
        />
        <div className="limit-mark" />
      </div>
      {type !== 'market' && (
        <div className="safe-line">
          <img src={safeImg} alt="safe" />
          <span>Your safe limit: ${borrowLimit}</span>
          <Tooltip
            placement="bottom"
            title={
              <span>
                80% of your borrow limit. We consider borrowing above this
                threshold unsafe.
              </span>
            }
          >
            <SQuestion src={IconQuestion} />
          </Tooltip>
        </div>
      )}
    </LineProgressBarWrapper>
  );
}

LineProgressBar.propTypes = {
  label: PropTypes.string,
  percent: PropTypes.number,
  type: PropTypes.string,
  borrowLimit: PropTypes.string
};

LineProgressBar.defaultProps = {
  label: 'Borrow Limit',
  percent: 0.0,
  type: 'borrow',
  borrowLimit: '0.00'
};

export default LineProgressBar;
