import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { getVoteContract, methods } from 'utilities/ContractService';
import { Card } from 'components/Basic/Card';
import { Label } from 'components/Basic/Label';

const ProposalDetailWrapper = styled.div`
  width: 100%;
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  padding: 27px 41px;
  color: var(--color-text-main);

  .section {
    padding: 10px 0;
    display: flex;
    flex-direction: column;

    h1, h2, h3, h4, h5, h6 {
      color: var(--color-text-main);
    }
  }
`;

function ProposalDetail({ proposalInfo }) {
  const [proposalActions, setProposalActions] = useState({});
  useEffect(() => {
    if (proposalInfo.id) {
      const voteContract = getVoteContract();
      methods
        .call(voteContract.methods.getActions, [proposalInfo.id])
        .then(res => {
          setProposalActions(res);
        });
    }
  }, [proposalInfo]);

  return (
    <Card>
      <ProposalDetailWrapper className="flex flex-column">
        <div className="section">
          <Label size="20" primary>
            Operation
          </Label>
          {(proposalActions.signatures || []).map((s, idx) => (
            <Label size="16" key={idx}>
              {s}
            </Label>
          ))}
        </div>
        <div className="section">
          <Label size="20" primary>
            Description
          </Label>
          <Label size="16">
            <ReactMarkdown source={proposalInfo.description} />
          </Label>
        </div>
      </ProposalDetailWrapper>
    </Card>
  );
}

ProposalDetail.propTypes = {
  proposalInfo: PropTypes.object
};
ProposalDetail.defaultProps = {
  proposalInfo: {}
};
export default ProposalDetail;
