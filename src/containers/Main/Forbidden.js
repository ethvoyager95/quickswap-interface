import React from 'react';
import { Alert } from 'antd';
import styled from 'styled-components';
import MainLayout from 'containers/Layout/MainLayout';

const ForbiddenWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  .ant-alert-description {
    max-width: 700px;
    font-size: 20px;
    font-weight: bold;
  }
`;

function Forbidden() {
  return (
    <MainLayout isHeader={false}>
      <ForbiddenWrapper>
        <Alert
          description="You have attempted to access the Strike Decentralized App from a US IP
      address which we do not support. We apologies for any inconvenience."
          type="warning"
          showIcon
        />
      </ForbiddenWrapper>
    </MainLayout>
  );
}

export default Forbidden;
