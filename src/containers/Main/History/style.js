import { Table } from 'antd';
import styled from 'styled-components';

export const TabsWrapper = styled.div`
  display: flex;
  gap: 45px;
  align-items: center;
  font-style: normal;
  font-weight: 900;
  font-size: 25px;
  line-height: 27px;
  color: #0b0f23;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0 16px 20px;

  div {
    opacity: 0.5;
    padding-bottom: 8px;
    cursor: pointer;
  }

  .active {
    opacity: 1;
    border-bottom: 3px solid #107def;
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
  justify-content: flex-end;
  align-items: center;
  font-style: normal;
  font-weight: 900;
  font-size: 16px;
  line-height: 24px;
  color: rgba(11, 15, 35, 0.5);
  margin: 0 16px 28px;

  .text-blue {
    color: #107def;
    font-weight: 900;
  }

  img {
    margin-left: 12px;
  }

  @media only screen and (max-width: 768px) {
    font-size: 14px;
    line-height: 22px;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;

    img {
      width: 15px;
      height: 15px;
    }
  }
`;

export const THeadWrapper = styled.div`
  display: flex;
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
  overflow-x: auto;

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
        }
      }
    }
  }

  .ant-table-tbody {
    tr {
      td {
        font-weight: normal;
        text-align: right;

        &:nth-child(1) {
          text-align: left;
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
    background: #e0effa;
    border-radius: 5px;
    padding: 4px 14px;
    text-align: center;
    font-style: normal;
    font-weight: 900;
    font-size: 12px;
    line-height: 19px;
    color: #107def;
  }
`;

export const Value = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: #000000;
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
    background: #107def;
    border-radius: 8px;
    width: 99px;
    height: 40px;
    color: #ffffff;

    &:hover {
      opacity: 0.8;
      background: #107def;
      color: #ffffff;
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
    background: #107def;
    border-radius: 8px;
    width: 140px;
    height: 40px;
    color: #ffffff;

    &:hover {
      opacity: 0.8;
      background: #107def;
      color: #ffffff;
    }
  }

  .input-address {
    width: 308px;
  }
`;

export const PaginationWrapper = styled.div`
  text-align: right;
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
      width: 108px;
    }
  }
`;
