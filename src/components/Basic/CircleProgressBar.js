import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Chart from 'react-apexcharts';

const CircleProgressBarWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;

  .circle-label {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    margin: 0;
    padding: 0;
    color: var(--color-text-green);
    line-height: 1;
    white-space: normal;
    text-align: center;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);

    .percent {
      color: var(--color-text-green);
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 17px;

      @media only screen and (max-width: 1280px) {
        font-size: 18px;
      }

      @media only screen and (max-width: 992px) {
        font-size: 20px;
      }

      @media only screen and (max-width: 768px) {
        font-size: 14px;
        margin-bottom: 10px;
      }
    }

    .label {
      color: var(--color-text-main);
      font-size: 15.5px;
      font-weight: normal;

      @media only screen and (max-width: 1280px) {
        font-size: 13.5px;
      }

      @media only screen and (max-width: 992px) {
        font-size: 15.5px;
      }

      @media only screen and (max-width: 768px) {
        font-size: 10px;
      }
    }
  }
`;

const options = {
  chart: {
    height: 100,
    width: '100%',
    type: 'donut',
    toolbar: {
      show: false
    }
  },
  colors: ['#277ee6', '#435fbd'],
  labels: ['Borrow', 'Supply'],
  legend: {
    show: false
  },
  tooltip: {
    enabled: false
  },
  dataLabels: {
    enabled: false
  },
  noData: {
    text: 'Loading...'
  },
  plotOptions: {
    pie: {
      donut: {
        size: '85%',
        labels: {
          show: false
        }
      },
      expandOnClick: false
    }
  }
};

function CircleProgressBar({ label, percent, borrow, supply }) {
  const [series, setSeries] = useState([0, 0]);

  useEffect(() => {
    const temp = [];
    if (!Number(supply) && !Number(borrow)) {
      setSeries([1, 0]);
    } else {
      temp.push(Number(supply));
      temp.push(Number(borrow));
      setSeries(temp);
    }
  }, [borrow, supply]);

  return (
    <CircleProgressBarWrapper>
      <Chart options={options} series={series} type="donut" />
      <div className="circle-label">
        <p className="percent">{percent}%</p>
        <p className="label">{label}</p>
      </div>
    </CircleProgressBarWrapper>
  );
}

CircleProgressBar.propTypes = {
  label: PropTypes.string,
  percent: PropTypes.number
};

CircleProgressBar.defaultProps = {
  label: 'Default Label',
  percent: 0.0
};

export default CircleProgressBar;
