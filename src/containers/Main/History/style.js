import { Table } from 'antd';
import styled from 'styled-components';
import { renderBgColor, renderColor } from './helper';

export const TabsWrapper = styled.div`
  display: flex;
  gap: 45px;
  align-items: center;
  font-style: normal;
  font-weight: 900;
  font-size: 16px;
  line-height: 20px;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-text-secondary);
  margin: 0 16px;
  padding-top: 20px;

  div {
    padding-bottom: 8px;
    cursor: pointer;
  }

  .active {
    color: var(--color-text-main);
    border-bottom: 1px solid white;
  }

  @media only screen and (max-width: 768px) {
    font-style: normal;
    font-weight: 900;
    font-size: 18px;
    line-height: 28px;
    justify-content: space-between;

    div {
      padding: 0 16px;
    }
  }
`;

export const SDivFlex = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #0b0f23;
  margin: 0 16px 28px;
  gap: 16px;
  flex-wrap: wrap;

  .title {
    font-style: normal;
    font-weight: 900;
    font-size: 14px;
    line-height: 22px;
    display: flex;
    align-items: center;
    color: #0b0f23;
  }
`;

export const THeadWrapper = styled.div`
  display: flex;
  justify-content: ${props => (props.txHash ? 'flex-start' : 'flex-end')};
  align-items: center;
  gap: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #9d9fa7;
`;

export const STable = styled(Table)`
  background: #ffffff;
  border-radius: 5px;
  padding-left: 40px;
  padding-right: 40px;
  margin: 0 16px 20px;
  overflow-x: ${props => (props.dropdownOpen ? 'visible' : 'auto')};

  @media only screen and (max-width: 768px) {
    margin-right: ${props => (props.dropdownOpen ? '0' : '16px')};
  }

  @media only screen and (max-width: 1295px) {
    table {
      padding-right: 40px;
    }
  }

  .ant-table-thead {
    tr {
      th {
        color: var(--color-text-secondary);
        font-size: 16px;
        line-height: 24px;
        font-weight: normal;
        background: var(--color-bg-primary);
        text-align: right;

        &:nth-child(1) {
          text-align: left;
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }
      }
    }
  }

  .ant-table-tbody {
    tr {
      td {
        font-weight: normal;
        text-align: right;
        white-space: nowrap;

        &:nth-child(1) {
          text-align: left;
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }
      }
    }
    tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background: #ffffff;
    }
  }
`;

export const Hash = styled.a`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: #107def;
  cursor: pointer;
`;

export const Method = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: ${props => renderBgColor(props.action)};
    border-radius: 5px;
    padding: 4px 14px;
    text-align: center;
    font-style: normal;
    font-weight: 900;
    font-size: 12px;
    line-height: 19px;
    color: ${props => renderColor(props.action)};

    img {
      height: 16px;
    }
  }
`;

export const Value = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: #000000;
  text-transform: ${props => (props.uppercase ? 'uppercase' : 'lowercase')};
`;

export const SButton = styled.button`
  background-color: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: transparent !important;
  }
`;

export const DropdownBlock = styled.div`
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 20px;

  .item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;

    div {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #141414;
    }
  }

  button {
    border-radius: 8px;
    width: 100%;
    height: 40px;

    &:hover {
      opacity: 0.8;
    }
  }

  .button-filter {
    background: #107def;
    color: #ffffff;
    font-weight: 900;

    &:hover {
      background: #107def;
      color: #ffffff;
    }
  }

  .button-clear {
    background: #ffffff;
    color: #f84960;
    border: 2px solid #f84960;
    font-weight: 900;

    &:hover,
    &:active,
    &:visited,
    &:focus {
      background: #ffffff !important;
      color: #f84960;
      border: 2px solid #f84960 !important;
    }

    &:disabled {
      color: rgba(0, 0, 0, 0.25) !important;
      background-color: #d3d3d3 !important;
      border: none !important;
    }
  }

  input {
    line-height: 1.5;
    text-overflow: ellipsis;
    touch-action: manipulation;
    outline: none;
    box-sizing: border-box;
    margin: 0;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: 'tnum', 'tnum';
    position: relative;
    display: inline-block;
    width: 100%;
    height: 32px;
    padding: 4px 11px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    transition: all 0.3s;
    width: 215px;

    &:focus {
      border-color: #40a9ff;
      border-right-width: 1px !important;
      outline: 0;
      box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
    }

    &:hover {
      border-color: #40a9ff;
      border-right-width: 1px !important;
    }
  }
`;

export const DropdownAddress = styled.div`
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 30px;

  button {
    border-radius: 8px;
    width: 100%;
    height: 40px;

    &:hover {
      opacity: 0.8;
    }
  }

  .button-filter {
    background: #107def;
    color: #ffffff;
    font-weight: 900;

    &:hover {
      background: #107def;
      color: #ffffff;
    }
  }

  .button-clear {
    background: #ffffff;
    color: #f84960;
    border: 2px solid #f84960;
    font-weight: 900;

    &:hover,
    &:active,
    &:visited,
    &:focus {
      background: #ffffff !important;
      color: #f84960;
      border: 2px solid #f84960 !important;
    }

    &:disabled {
      color: rgba(0, 0, 0, 0.25) !important;
      background-color: #d3d3d3 !important;
      border: none !important;
    }
  }

  .input-address {
    width: 308px;
  }
`;

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 16px 50px;

  .ant-pagination-item {
    border: none;
  }

  .ant-pagination-next .ant-pagination-item-link {
    border: none;
  }

  .ant-pagination-prev .ant-pagination-item-link {
    border: none;
  }

  .ant-pagination-item-active {
    border: 1px solid #107def;
  }
  .text-blue {
    color: #107def;
    font-weight: 900;
  }
  .export-csv {
    align-self: flex-start;
  }
  img {
    margin-left: 12px;
  }

  @media only screen and (max-width: 768px) {
    font-size: 14px;
    line-height: 22px;

    img {
      width: 15px;
      height: 15px;
    }
  }
`;

export const NoData = styled.div`
  display: flex;
  flex-direction: column;
  margin: 100px auto;
  gap: 24px;
  align-items: center;

  div {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 27px;
    color: #9d9fa7;
  }

  @media only screen and (max-width: 768px) {
    div {
      font-weight: 900;
      font-size: 12px;
      line-height: 19px;
    }
    img {
      width: 200px;
    }
  }
`;

export const SBoxFlex = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const SImg = styled.img`
  margin-right: 6px;
  width: 28px;
  height: 28px;
`;

export const DivFlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

export const TagFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  display: flex;
  align-items: center;
  color: #6d6f7b;
  background: #f9f9f9;
  border-radius: 20px;

  img {
    cursor: pointer;
  }
`;
