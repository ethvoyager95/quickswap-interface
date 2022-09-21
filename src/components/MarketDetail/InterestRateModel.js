import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import BigNumber from 'bignumber.js';
import { withRouter } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { connectAccount } from 'core';
import {
  getSbepContract,
  getInterestModelContract,
  methods,
  multicall
} from 'utilities/ContractService';
import { checkIsValidNetwork } from 'utilities/common';

const InterestRateModelWrapper = styled.div`
  margin: 10px -20px 10px;

  .title {
    font-weight: 900;
    font-size: 17px;
    color: var(--color-text-main);
    margin-bottom: 10px;
  }

  .description {
    font-weight: 900;
    color: var(--color-text-secondary);
    margin-bottom: 50px;
  }

  .percent-wrapper {
    position: relative;
    width: 100%;
    .line {
      width: calc(100% - 60px);
      height: 2px;
      margin-left: 30px;
      background-color: var(--color-blue);
    }

    .current-percent {
      position: absolute;
      font-size: 12px;
      color: var(--color-blue);
      &::before {
        position: absolute;
        content: ' ';
        width: 2px;
        margin-left: 1px;
        height: 20px;
        top: 5px;
        background-color: var(--color-blue);
      }
      p {
        margin-top: 30px;
        margin-left: -20px;
        font-weight: bold;
      }
    }

    .ticker-percent {
      position: absolute;
      top: -25px;
      margin-left: -18px;
      color: var(--color-blue);
      font-size: 14px;
    }

    .ticker-line {
      position: absolute;
      width: 2px;
      height: 90%;
      background-color: var(--color-white);

      &::before {
        position: absolute;
        content: ' ';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        top: -3px;
        left: -3px;
        z-index: 10;
        background-color: var(--color-blue);
      }
      &::after {
        position: absolute;
        content: ' ';
        width: 10px;
        height: 10px;
        border-radius: 50%;
        top: -5px;
        left: -5px;
        background-color: var(--color-white);
      }
    }
  }


  .chart-wrapper {
    padding: 0 15px;
  }
  @media only screen and (max-width: 768px) {
  }
`;

let flag = false;

function InterestRateModel({ settings, currentAsset, history }) {
  const [series, setSeries] = useState([
    {
      name: 'Supply Apy',
      data: []
    },
    {
      name: 'Borrow Apy',
      data: []
    }
  ]);
  const [colors, setColors] = useState(['#277ee6', '#f9053e']);
  const [options, setOptions] = useState({
    chart: {
      id: 'line-percent',
      type: 'line',
      height: '100%',
      toolbar: {
        show: false
      },
    },
    colors: ['#277ee6', '#f9053e'],
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
      style: 'hollow'
    },
    xaxis: {
      show: false,
      type: 'numeric',
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      tooltip: {
        enabled: false
      }
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter: value => {
          return `${value} %`;
        }
      }
    },
    // legend: {
    //   show: false
    // },
    yaxis: {
      show: false,
    },
    grid: {
      show: false
    }
  });

  const [graphData, setGraphData] = useState([]);
  const [tickerPos, setTickerPos] = useState(null);
  const [percent, setPercent] = useState(null);
  const [currentPercent, setCurrentPercent] = useState(0);
  const [currentPos, setCurrentPos] = useState(30);

  const getGraphData = async asset => {
    flag = true;
    const vbepContract = getSbepContract(asset);
    const interestRateModel = await methods.call(
      vbepContract.methods.interestRateModel,
      []
    );
    const interestModelContract = getInterestModelContract(interestRateModel);
    const cashValue = await methods.call(vbepContract.methods.getCash, []);
    const data = [];
    const marketInfo = settings.markets.find(
      item => item.underlyingSymbol.toLowerCase() === asset.toLowerCase()
    );
    // Get Current Utilization Rate
    const cash = new BigNumber(cashValue).div(new BigNumber(10).pow(settings.decimals[asset].token));
    const borrows = new BigNumber(marketInfo.totalBorrows2);
    const reserves = new BigNumber(marketInfo.totalReserves || 0).div(new BigNumber(10).pow(settings.decimals[asset].token));
    const currentUtilizationRate = borrows.div(cash.plus(borrows).minus(reserves));
    const tempCurrentPercent = parseInt(+currentUtilizationRate.toString(10) * 100, 10);

    setCurrentPercent(tempCurrentPercent || 0);
    const lineElement = document.getElementById('line');
    if (lineElement) {
      setCurrentPos(30 + (lineElement.clientWidth * tempCurrentPercent) / 100);
    }

    const urArray = [];
    for (let i = 1; i <= 100; i = i + 1) {
      urArray.push(i / 100);
    }

    const contractCallContext = []
    urArray.map((ur, index) => {
      contractCallContext.push(
        {
          reference: `borrowRes${index}`,
          contractAddress: interestModelContract.options.address,
          abi: interestModelContract.options.jsonInterface,
          calls: [{
            methodName: 'getBorrowRate', methodParameters: [
              new BigNumber(1 / ur - 1)
                .times(1e4)
                .dp(0)
                .toString(10),
              1e4,
              0]
          }]
        },
        {
          reference: `supplyRes${index}`,
          contractAddress: interestModelContract.options.address,
          abi: interestModelContract.options.jsonInterface,
          calls: [{
            methodName: 'getSupplyRate', methodParameters: [
              new BigNumber(1 / ur - 1)
                .times(1e4)
                .dp(0)
                .toString(10),
              1e4,
              0,
              marketInfo.reserveFactor.toString(10)]
          }]
        }
      )
    })

    const results = await multicall.call(contractCallContext)

    let borrowRes = []
    let supplyRes = []
    urArray.map((ur, index) => {
      borrowRes.push(results.results[`borrowRes${index}`].callsReturnContext[0].returnValues[0].hex)
      supplyRes.push(results.results[`supplyRes${index}`].callsReturnContext[0].returnValues[0].hex)
    })

    // const borrowRes = await Promise.all(
    //   urArray.map(ur =>
    //     methods.call(interestModelContract.methods.getBorrowRate, [
    //       new BigNumber(1 / ur - 1)
    //         .times(1e4)
    //         .dp(0)
    //         .toString(10),
    //       1e4,
    //       0
    //     ])
    //   )
    // );
    // const supplyRes = await Promise.all(
    //   urArray.map(ur =>
    //     methods.call(interestModelContract.methods.getSupplyRate, [
    //       new BigNumber(1 / ur - 1)
    //         .times(1e4)
    //         .dp(0)
    //         .toString(10),
    //       1e4,
    //       0,
    //       marketInfo.reserveFactor.toString(10)
    //     ])
    //   )
    // );

    urArray.forEach((ur, index) => {
      // supply apy, borrow apy
      const blocksPerDay = 4 * 60 * 24;
      const daysPerYear = 365;

      const mantissa = 1e18;
      const supplyBase = new BigNumber(supplyRes[index])
        .div(mantissa)
        .times(blocksPerDay)
        .plus(1);
      const borrowBase = new BigNumber(borrowRes[index])
        .div(mantissa)
        .times(blocksPerDay)
        .plus(1);
      const supplyApy = supplyBase
        .pow(daysPerYear - 1)
        .minus(1)
        .times(100);
      const borrowApy = borrowBase
        .pow(daysPerYear - 1)
        .minus(1)
        .times(100);

      data.push({
        percent: ur,
        supplyApy: supplyApy.dp(2, 1).toString(10),
        borrowApy: borrowApy.dp(2, 1).toString(10)
      });
    });
    setGraphData(data);
    setSeries([
      {
        name: 'Supply Apy',
        data: data.map(item => {
          const temp = [];
          temp.push(item.percent * 100);
          temp.push(item.supplyApy);
          return temp;
        })
      },
      {
        name: 'Borrow Apy',
        data: data.map(item => {
          const temp = [];
          temp.push(item.percent * 100);
          temp.push(item.borrowApy);
          return temp;
        })
      }
    ]);
  };

  useEffect(() => {
    if (
      currentAsset &&
      settings.markets &&
      settings.markets.length > 0 &&
      settings.decimals &&
      checkIsValidNetwork() &&
      !flag
    ) {
      getGraphData(currentAsset);
    }
  }, [settings.markets, currentAsset]);

  useEffect(() => {
    flag = false;
  }, [currentAsset]);

  const handleMouseMove = e => {
    const graphElement = document.getElementById('percent-wrapper');
    const lineElement = document.getElementById('line');
    if (graphElement && lineElement) {
      const x = e.pageX - graphElement.offsetLeft - 30;
      const tempPercent = (x * 100) / lineElement.clientWidth;
      if (tempPercent >= 0 && tempPercent <= 100) {
        setPercent(parseInt(tempPercent, 10));
        setTickerPos(e.pageX - graphElement.offsetLeft);
      } else if (tempPercent < 0) {
        setPercent(0);
      } else if (tempPercent >= 100) {
        setPercent(100);
      }
      setCurrentPos(30 + (lineElement.clientWidth * currentPercent) / 100);
    }
  };

  return (
    <InterestRateModelWrapper>
      <p className="title">Interest Rate Model</p>
      <p className="description">Utilization vs. APY</p>
      <div
        id="percent-wrapper"
        className="percent-wrapper"
        onMouseMove={handleMouseMove}
      >
        <div id="line" className="line" />
        {graphData.length !== 0 && (
          <div className="current-percent" style={{ left: currentPos || 30 }}>
            <p>Current</p>
          </div>
        )}
        <div
          className="ticker-percent"
          style={{ left: tickerPos || currentPos || 30 }}
        >
          {percent === null ? currentPercent : percent} %
        </div>
        <div
          id="ticker-line"
          className="ticker-line"
          style={{ left: tickerPos || currentPos }}
        />
        <div className="chart-wrapper">
          <Chart
            options={options}
            series={series}
            type="line"
            height="350"
            colors={colors}
          />
        </div>
      </div>
    </InterestRateModelWrapper>
  );
}

InterestRateModel.propTypes = {
  history: PropTypes.object,
  currentAsset: PropTypes.string,
  settings: PropTypes.object
};

InterestRateModel.defaultProps = {
  history: {},
  currentAsset: '',
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(
  withRouter,
  connectAccount(mapStateToProps, undefined)
)(InterestRateModel);
