/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Tooltip } from 'antd';
import MainLayout from 'containers/Layout/MainLayout';
import Overview from 'components/Dashboard/Overview';
import Market from 'components/Dashboard/Market';
import { connectAccount, accountActionCreators } from 'core';
import { Row, Column } from 'components/Basic/Style';
import Toggle from 'components/Basic/Toggle';
import { Label } from 'components/Basic/Label';
import IconQuestion from 'assets/img/question.png';
import rewardBanner from 'assets/img/reward_banner.svg';
import dividerImg from 'assets/img/divider.svg';
import { useRewardData } from 'hooks/useReward';

const DashboardWrapper = styled.div`
  height: 100%;

  .apy-toggle {
    margin: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .toggel-label {
      margin: 5px 10px;
    }
  }

  .divider {
    margin: 5px 10px;
    border-bottom: 1px solid #34384c;
  }
`;

const RewardBannerWrapper = styled.div`
  position: relative;
  background: linear-gradient(to right, #3fd5c6, #3ea7fb);
  padding: 2px;
  border-radius: 10px;
  margin: 10px 15px;
`;

const RewardBanner = styled.div`
  display: flex;
  justify-content: space-between;
  background: #141f2e;
  color: white;
  border-radius: 10px;

  .left {
    padding: 24px;

    .title {
      font-size: 18px;
      font-weight: 700;
    }

    .description {
      margin-top: 14px;
      font-size: 14px;
      color: #999;
    }

    .buttons {
      align-items: center;
      margin-top: 16px;
      gap: 24px;
    }

    .btn-calc {
      display: inline-block;
      color: white;
      border: 1px solid white;
      border-radius: 6px;
      padding: 8px 32px;
    }

    .btn-learn {
      color: white;
    }
  }

  @media screen and (max-width: 1280px) {
    .left {
      padding: 24px;

      .title {
        font-size: 20px;
      }

      .description {
        font-size: 12px;
      }

      .btn-calc {
        font-size: 14px;
        padding: 8px 20px;
      }
    }

    .rewardBannerImg {
      display: none;
    }
  }

  @media screen and (max-width: 1110px) {
    .left {
      padding: 24px;

      .title {
        font-size: 16px;
      }

      .description {
        font-size: 12px;
      }

      .btn-calc {
        font-size: 12px;
        padding: 8px 20px;
      }
    }
  }

  @media screen and (max-width: 1024px) {
    .rewardBannerImg {
      display: none;
    }
  }

  @media only screen and (max-width: 576px) {
    flex-direction: column;
  }

  .reward-info {
    min-width: 360px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .label {
        color: rgba(256, 256, 256, 0.6);
        font-size: 18px;
        font-weight: bold;
      }

      .value {
        color: white;
        font-size: 24px;
        font-weight: bold;
      }
    }

    @media only screen and (max-width: 1280px) {
      .info {
        .label {
          font-size: 18px;
        }

        .value {
          font-size: 24px;
        }
      }
    }

    @media only screen and (max-width: 1024px) {
      .info {
        .label {
          font-size: 16px;
        }

        .value {
          font-size: 24px;
        }
      }
    }

    @media only screen and (max-width: 768px) {
      gap: 20px;
      padding: 0;

      .info {
        .label {
          font-size: 16px;
        }

        .value {
          font-size: 22px;
        }
      }
    }

    @media only screen and (max-width: 576px) {
      min-width: unset;
      flex-direction: column;
      padding: 20px;
      gap: 10px;
      .info {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
      }

      .divider {
        display: none;
      }
    }
  }
`;

const SQuestion = styled.img`
  margin: 0px 20px 0px 10px;
`;

function Dashboard({ settings, setSetting }) {
  const [currentMarket, setCurrentMarket] = useState('');
  const [withSTRK, setWithSTRK] = useState(true);

  const { totalReserveReward, reserveApy } = useRewardData('');

  useEffect(() => {
    setCurrentMarket('supply');
  }, []);

  useEffect(() => {
    setSetting({
      withSTRK
    });
  }, [withSTRK]);

  return (
    <MainLayout title="Dashboard">
      <DashboardWrapper className="flex">
        <Row>
          <Column xs="12">
            <RewardBannerWrapper>
              <RewardBanner>
                <div className="left">
                  <div className="title">
                    <FormattedMessage id="Reward_Banner_Title" />
                  </div>
                  <div className="description">
                    <FormattedMessage id="Reward_Banner_Description" />
                  </div>
                  <div className="buttons flex">
                    <Link to="/vault" className="btn-calc">
                      <span>
                        <FormattedMessage id="Reward_Banner_Go" />
                      </span>
                    </Link>
                    <a
                      href="https://strike-finance.medium.com/unleashing-the-potential-of-defi-with-strike-prime-rewards-a-strategic-leap-forward-01176f33c851"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-learn"
                    >
                      <span>
                        <FormattedMessage id="Reward_Banner_Learn" />
                      </span>
                    </a>
                  </div>
                </div>
                <div className="reward-info">
                  <div className="info">
                    <div className="label">
                      <FormattedMessage id="Prime_Reward_Pool" />
                    </div>
                    <div className="value">${totalReserveReward}</div>
                  </div>

                  <img src={dividerImg} className="divider" alt="divider" />

                  <div className="info">
                    <div className="label">
                      <FormattedMessage id="Max_Prime_APR" />
                    </div>
                    <div className="value">{reserveApy}%</div>
                  </div>
                </div>
                <img
                  src={rewardBanner}
                  className="rewardBannerImg"
                  alt="reward-banner"
                />
              </RewardBanner>
            </RewardBannerWrapper>
          </Column>
          <Column xs="12">
            <div className="divider" />
          </Column>
          <Column xs="12">
            <div className="apy-toggle">
              <Label size="14" primary className="toggel-label">
                <div className="flex align-center">
                  <p className="pointer">
                    <FormattedMessage id="APY_with_STRK" />
                    &nbsp;
                    <Tooltip
                      placement="bottom"
                      title={
                        <span>
                          <FormattedMessage id="APY_with_STRK_desc" />
                        </span>
                      }
                    >
                      <SQuestion src={IconQuestion} />
                    </Tooltip>
                  </p>
                </div>
              </Label>
              <Toggle
                checked={withSTRK}
                onChecked={() => setWithSTRK(!withSTRK)}
                bgColor="#1BA27A"
              />
            </div>
          </Column>
          <Column xs="12">
            <Overview currentMarket={currentMarket} />
          </Column>
          <Column xs="12">
            <Row>
              <Column xs="12">
                <Market
                  currentMarket={currentMarket}
                  setCurrentMarket={setCurrentMarket}
                />
              </Column>
            </Row>
          </Column>
        </Row>
      </DashboardWrapper>
    </MainLayout>
  );
}

Dashboard.propTypes = {
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired
};

Dashboard.defaultProps = {
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

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Dashboard);
