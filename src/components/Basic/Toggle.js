import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch } from 'antd';

const ToggleWrapper = styled.div`
  height: 15px;
  margin-top: -9px;

  .ant-switch {
    background-color: #34384c;
    border-color: #34384c;
    height: 14px;
    &::after {
      background-color: var(--color-dark-grey);
      margin-top: -4px;
    }
  }

  .ant-switch-checked {
    background-color: #1962f0;
    border-color: #1962f0;
    height: 14px;
    &::after {
      background-color: var(--color-blue);
    }
  }
`;

function Toggle({ checked, onChecked }) {
  return (
    <ToggleWrapper onClick={e => e.stopPropagation()}>
      <Switch checked={checked} onChange={onChecked} />
    </ToggleWrapper>
  );
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChecked: PropTypes.func
};

Toggle.defaultProps = {
  checked: true,
  onChecked: () => {}
};

export default Toggle;
