/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import Overview from 'components/Dashboard/Overview';
import Market from 'components/Dashboard/Market';
import SupplyCard from 'components/Dashboard/SupplyCard';
import { connectAccount, accountActionCreators } from 'core';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Row, Column } from 'components/Basic/Style';
import BigNumber from 'bignumber.js';
import * as constants from 'utilities/constants';

const DashboardWrapper = styled.div`
  height: 100%;

  .overview-column {
    height: calc(100% - 20px);

    @media only screen and (max-width: 992px) {
      height: auto;
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 85vh;
  width: 100%;

  @media only screen and (max-width: 1440px) {
    height: 70vh;
  }
`;

const HomePageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`;

function Dashboard({ settings }) {
  const [currentMarket, setCurrentMarket] = useState('');

  useEffect(() => {
    setCurrentMarket('supply');
  }, []);

  return (
    <MainLayout title="Dashboard">
      <DashboardWrapper className="flex">
        {(!settings.selectedAddress || settings.accountLoading) && (
          <SpinnerWrapper>
            <HomePageWrapper>HOME PAGE</HomePageWrapper>
          </SpinnerWrapper>
        )}
        {settings.selectedAddress && !settings.accountLoading && (
          <Row>
            <Column xs="12" sm="12" md="5" className="overview-column">
              <Overview currentMarket={currentMarket} />
            </Column>
            <Column xs="12" sm="12" md="7">
              <Row>
                <Column xs="12">
                  <Market
                    currentMarket={currentMarket}
                    setCurrentMarket={setCurrentMarket}
                  />
                </Column>
                <Column xs="12">
                  <SupplyCard currentMarket={currentMarket} />
                </Column>
              </Row>
            </Column>
          </Row>
        )}
      </DashboardWrapper>
    </MainLayout>
  );
}

Dashboard.propTypes = {
  history: PropTypes.object,
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired
};

Dashboard.defaultProps = {
  history: {},
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
