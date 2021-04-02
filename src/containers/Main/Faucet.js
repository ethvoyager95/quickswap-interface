import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Form, Select, Dropdown, Menu, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import MainLayout from 'containers/Layout/MainLayout';
import { promisify } from 'utilities';
import Button from '@material-ui/core/Button';
import * as constants from 'utilities/constants';
import LoadingBar from 'react-top-loading-bar';

const FaucetWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  height: 100%;
  flex: 1;
  padding: 20px;
  input {
    width: 100%;
    height: 42px;
  }

  .header {
    font-size: 36px;
    font-weight: 600;
    color: var(--color-text-main);
    margin-top: 100px;
    margin-bottom: 60px;
    text-align: center;

    @media only screen and (max-width: 768px) {
      font-size: 28px;
      margin-top: 0px;
    }
  }

  .forgot-pwd-form {
    display: flex;

    @media only screen and (max-width: 768px) {
      flex-direction: column;
    }

    .ant-form-item {
      margin: 0;
      width: 500px;
      height: 50px;

      @media only screen and (max-width: 768px) {
        width: 350px;
      }
    }

    .token-menu {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-left: 10px;
      margin-top: 0;

      @media only screen and (max-width: 768px) {
        margin-top: 20px;
        padding-left: 0;
      }

      .ant-select-selection--single {
        height: 42px;
        padding: 5px;
      }
    }
  }

  .bottom {
    color: var(--color-text-main);
    padding: 30px 0;

    .title {
      font-size: 24px;
      font-weight: 600;
    }

    .description {
      margin-top: 10px;
      font-size: 16px;
      font-weight: normal;
      text-align: center;
    }
  }

  .button-section {
    margin: 20px 0;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  .button {
    width: 150px;
    height: 40px;
    border-radius: 5px;
    background-color: var(--color-blue);
    box-shadow: 0px 4px 13px 0 rgba(39, 126, 230, 0.64);
    .MuiButton-label {
      font-size: 15px;
      font-weight: 500;
      color: var(--color-white);
      text-transform: capitalize;

      @media only screen and (max-width: 1440px) {
        font-size: 12px;
      }
    }
  }
`;

const { Option } = Select;

const tokenList = [
  {
    key: 'usdc',
    name: 'USDC',
    values: [100, 200, 500]
  },
  {
    key: 'usdt',
    name: 'USDT',
    values: [100, 200, 500]
  },
  {
    key: 'busd',
    name: 'BUSD',
    values: [100, 200, 500]
  },
  {
    key: 'strk',
    name: 'STRK',
    values: [100, 200, 500]
  },
  {
    key: 'wbtc',
    name: 'WBTC',
    values: [100, 200, 500]
  },
  {
    key: 'comp',
    name: 'COMP',
    values: [100, 200, 500]
  },
  {
    key: 'uni',
    name: 'UNI',
    values: [100, 200, 500]
  },
  {
    key: 'link',
    name: 'LINK',
    values: [100, 200, 500]
  }
];

function Faucet({ form, getFromFaucet, history }) {
  const { getFieldDecorator } = form;
  const [selectedAsset, setSelectedAsset] = useState(tokenList[0]);
  const [progress, setProgress] = useState(0);

  const handleMenuClick = (e, symbol) => {
    form.validateFields((err, values) => {
      setProgress(0);
      if (!err) {
        setProgress(90);
        promisify(getFromFaucet, {
          address: values.address,
          asset: symbol,
          amountType: e.key
        })
          .then(res => {
            setProgress(100);
            let fromAddress;
            if (symbol === 'strk') {
              fromAddress = process.env.REACT_APP_ENV
                ? process.env.REACT_APP_TEST_STRK_TOKEN_ADDRESS
                : process.env.REACT_APP_MAIN_STRK_TOKEN_ADDRESS;
            } else if (symbol === 'eth') {
              fromAddress = process.env.REACT_APP_ENV
                ? process.env.REACT_APP_TEST_ETH_TOKEN_ADDRESS
                : process.env.REACT_APP_MAIN_ETH_TOKEN_ADDRESS;
            } else {
              fromAddress = constants.CONTRACT_TOKEN_ADDRESS[symbol].address;
            }
            message.success(`Funding request for ${fromAddress} into ${values.address}`);
          })
          .catch(error => {
            setProgress(100);
            if (error.data && error.data.message) {
              message.error(error.data.message);
            }
          });
      }
    });
  };

  const tokenMenu = useCallback(() => {
    return (
      <Menu onClick={e => handleMenuClick(e, selectedAsset.key)}>
        <Menu.Item key="low">
          {selectedAsset.values[0]} {selectedAsset.name}s
        </Menu.Item>
        <Menu.Item key="medium">
          {selectedAsset.values[1]} {selectedAsset.name}s
        </Menu.Item>
        <Menu.Item key="high">
          {selectedAsset.values[2]} {selectedAsset.name}s
        </Menu.Item>
      </Menu>
    );
  }, [selectedAsset]);

  const onTokenChange = value => {
    setSelectedAsset(tokenList.find(item => item.key === value));
  };

  return (
    <MainLayout isHeader={false}>
      <div className="flex just-center align-center">
        <FaucetWrapper className="flex flex-column align-center just-center">
          <p className="header">Strike Ethereum Faucet</p>
          <Form className="forgot-pwd-form">
            <Form.Item>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: 'Address is required!'
                  }
                ]
              })(<Input placeholder="Input your Ethereum address..." />)}
            </Form.Item>
            <div id="token-menu" className="token-menu">
              <Select
                defaultValue={selectedAsset.key}
                style={{ width: 120, marginRight: 10 }}
                getPopupContainer={() => document.getElementById('token-menu')}
                dropdownMenuStyle={{
                  backgroundColor: '#FFFFFF'
                }}
                onChange={onTokenChange}
              >
                {tokenList.map(item => (
                  <Option className="menu-item" value={item.key} key={item.key}>
                    {item.name}
                  </Option>
                ))}
              </Select>
              <ButtonWrapper>
                <Dropdown overlay={tokenMenu} placement="bottomCenter">
                  <Button className="fill-btn next-btn button">
                    Give Me {selectedAsset.name}
                  </Button>
                </Dropdown>
              </ButtonWrapper>
            </div>
          </Form>
          <LoadingBar
            color="#277ee6"
            progress={progress}
            onLoaderFinished={() => {
              setProgress(0);
            }}
          />
        </FaucetWrapper>
      </div>
    </MainLayout>
  );
}

Faucet.propTypes = {
  form: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getFromFaucet: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
  const { getFromFaucet } = accountActionCreators;

  return bindActionCreators(
    {
      getFromFaucet
    },
    dispatch
  );
};

export default compose(
  withRouter,
  Form.create({ name: 'faucet-form' }),
  connectAccount(undefined, mapDispatchToProps)
)(Faucet);
