import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch } from 'antd';

const ToggleWrapper = styled.div`
  height: 20px;

  .ant-switch {
    background-color: #34384c;
    border-color: #34384c;
    width: 24px;
    height: 20px;
    border-radius: 6px;
    padding: 0px 4px;

    &::after {
      width: 11px;
      height: 16px;
      border-radius: 6px;
      background-color: var(--color-dark-grey);
    }
  }

  .ant-switch-checked {
    background-color: ${props => props.bgColor};
    border-color: ${props => props.bgColor};
    &::after {
      background-color: var(--color-blue);
    }
  }
`;

function Toggle({ checked, onChecked, bgColor }) {
  return (
    <ToggleWrapper onClick={e => e.stopPropagation()} bgColor={bgColor}>
      <Switch checked={checked} onChange={onChecked} />
    </ToggleWrapper>
  );
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChecked: PropTypes.func,
  bgColor: PropTypes.string
};

Toggle.defaultProps = {
  checked: true,
  onChecked: () => {},
  bgColor: '#1962f0'
};

export default Toggle;
