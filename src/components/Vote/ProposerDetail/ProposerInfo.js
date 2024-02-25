/* eslint-disable no-useless-escape */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message, Icon } from 'antd';
import { Card } from 'components/Basic/Card';

const ProposerInfoWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  padding: 25px 40px 28px;

  .address {
    font-size: 17.5px;
    font-weight: 900;
    color: var(--color-text-main);
  }

  span {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  i {
    color: var(--color-text-main);
  }
`;

function ProposerInfo({ address, history, intl }) {
  const handleLink = () => {
    window.open(
      `${process.env.REACT_APP_ETH_EXPLORER}/address/${address}`,
      '_blank'
    );
  };
  return (
    <Card>
      <ProposerInfoWrapper className="flex flex-column">
        <div className="address">
          {`${address.substr(0, 4)}...${address.substr(address.length - 4, 4)}`}
        </div>
        <div className="flex just-between align-center">
          <span className="highlight pointer" onClick={() => handleLink()}>
            {address}
          </span>
          <CopyToClipboard
            text={address}
            onCopy={() => {
              message.success(
                intl.formatMessage({
                  id: 'Copied_address'
                })
              );
            }}
          >
            <Icon className="pointer copy-btn" type="copy" />
          </CopyToClipboard>
        </div>
      </ProposerInfoWrapper>
    </Card>
  );
}

ProposerInfo.propTypes = {
  address: PropTypes.string,
  history: PropTypes.object,
  intl: intlShape.isRequired
};

ProposerInfo.defaultProps = {
  address: '',
  history: {}
};

export default injectIntl(compose(withRouter)(ProposerInfo));
