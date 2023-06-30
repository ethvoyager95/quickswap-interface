import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import commaNumber from 'comma-number';
import { Card } from 'components/Basic/Card';
import { Row, Column } from 'components/Basic/Style';

const VotingPowerWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 14px 56px 14px 56px;
  border-radius: 5px;
  background: linear-gradient(
    242deg,
    #246cf9 0%,
    #1e68f6 0.01%,
    #0047d0 100%,
    #0047d0 100%
  );

  .title {
    font-size: 20px;
    color: var(--color-white);
    font-weight: bold;
  }

  .content {
    color: var(--color-text-main);
    font-size: 28.5px;
    font-weight: 900;
    @media only screen and (max-width: 768px) {
      font-size: 18px;
    }
  }

  span {
    color: var(--color-bg-main);
  }
`;

const format = commaNumber.bindWith(',', '.');

function VotingPower({ power }) {
  const getBefore = value => {
    const position = value.indexOf('.');
    return position !== -1 ? value.slice(0, position + 5) : value;
  };

  const getAfter = value => {
    const position = value.indexOf('.');
    return position !== -1 ? value.slice(position + 5) : null;
  };

  return (
    <Row>
      <Column sm="12" md="12">
        <Card>
          <VotingPowerWrapper className="flex flex-column">
            <p className="title">Voting Weight</p>
            <p className="content">
              {getBefore(format(power))}
              <span>{getAfter(format(power))}</span>
            </p>
          </VotingPowerWrapper>
        </Card>
      </Column>
    </Row>
  );
}

VotingPower.propTypes = {
  power: PropTypes.string
};

VotingPower.defaultProps = {
  power: '0.00000000'
};

export default VotingPower;
