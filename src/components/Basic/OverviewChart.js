import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import { connectAccount } from 'core';
import moment from 'moment';
import { currencyFormatter } from 'utilities/common';

const ChartWrapper = styled.div`
  width: 100% + 40px;
  margin: -10px -20px 10px;
`;

function OverviewChart({ marketType, data, graphType }) {
  const [areaSeries, setAreaSeries] = useState([
    {
      name: marketType === 'supply' ? 'Supply APY' : 'Borrow APY',
      data: []
    }
  ]);
  const [barSeries, setBarSeries] = useState([
    {
      name: marketType === 'supply' ? 'Total Supply' : 'Total Borrow',
      data: []
    }
  ]);
  const [areaOptions, setAreaOptions] = useState({
    chart: {
      id: 'yt',
      group: 'marketinfo',
      animations: {
        enabled: false
      },
      height: 160,
      toolbar: {
        show: false
      }
    },
    colors: ['#00E396'],
    dataLabels: {
      enabled: false
    },
    xaxis: {
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
    yaxis: {
      show: false
    },
    tooltip: {
      shared: false,
      y: {
        formatter: value => {
          return `${value} %`;
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
    grid: {
      show: false
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 1.5,
      dashArray: 0
    }
  });

  const [barOptions, setBarOptions] = useState({
    chart: {
      id: 'tw',
      group: 'marketinfo',
      animations: {
        enabled: false
      },
      height: 160,
      toolbar: {
        show: false
      }
    },
    colors: ['#546E7A'],
    dataLabels: {
      enabled: false
    },
    xaxis: {
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
    yaxis: {
      show: false
    },
    tooltip: {
      shared: false,
      y: {
        formatter: value => {
          return currencyFormatter(value);
        }
      }
    },
    grid: {
      show: false
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 1.5,
      dashArray: 0
    }
  });

  useEffect(() => {
    if (marketType === 'supply') {
      setAreaOptions({
        ...areaOptions,
        colors: ['#277ee6']
      });
      setBarOptions({
        ...barOptions,
        colors: ['#277ee6']
      });
    } else {
      setAreaOptions({
        // ...areaOptions,
        colors: ['#f9053e']
      });
      setBarOptions({
        // ...barOptions,
        colors: ['#f9053e']
      });
    }

    setAreaSeries([
      {
        name: marketType === 'supply' ? 'Supply APY' : 'Borrow APY',
        data: data.map(item => {
          const temp = {};
          temp.x = moment(item.createdAt).format('LLL');
          if (marketType === 'supply') {
            temp.y = item.supplyApy.toFixed(2);
          } else {
            temp.y = item.borrowApy.toFixed(2);
          }
          return temp;
        })
      }
    ]);

    if (graphType === 'composed') {
      setBarSeries([
        {
          name: marketType === 'supply' ? 'Total Supply' : 'Total Borrow',
          data: data.map(item => {
            const temp = {};
            temp.x = moment(item.createdAt).format('LLL');
            if (marketType === 'supply') {
              temp.y = item.totalSupply.toFixed(2);
            } else {
              temp.y = item.totalBorrow.toFixed(2);
            }
            return temp;
          })
        }
      ]);
    }
  }, [data, marketType]);

  return (
    <ChartWrapper>
      {graphType !== 'composed' && areaSeries[0].data.length !== 0 && (
        <div id="aa">
          <ReactApexChart
            id="area-datetime"
            options={areaOptions}
            series={areaSeries}
            type="area"
            height={180}
          />
        </div>
      )}
      {graphType === 'composed' && areaSeries[0].data.length !== 0 && barSeries[0].data.length !== 0 && (
        <div id="aa">
          <ReactApexChart
            id="area-datetime"
            options={areaOptions}
            series={areaSeries}
            type="area"
            height={180}
          />
        </div>
      )}
      {graphType === 'composed' && areaSeries[0].data.length !== 0 && barSeries[0].data.length !== 0 && (
        <div id="bb">
          <ReactApexChart
            id="bar-datetime"
            options={barOptions}
            series={barSeries}
            height={180}
            type="area"
          />
        </div>
      )}
    </ChartWrapper>
  );
}

OverviewChart.propTypes = {
  settings: PropTypes.object,
  marketType: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      apy: PropTypes.number
    })
  )
};

OverviewChart.defaultProps = {
  marketType: 'supply',
  data: [],
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(
  OverviewChart
);
