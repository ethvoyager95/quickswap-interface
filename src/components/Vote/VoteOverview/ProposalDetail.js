/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { getVoteContract, methods } from 'utilities/ContractService';
import { Card } from 'components/Basic/Card';
import { ColorLabel, Label } from 'components/Basic/Label';
import { useInstance } from 'hooks/useContract';
import { decodeParameters } from 'utilities/common';
import { CONTRACT_NAMES } from 'utilities/constants';

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

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: var(--color-text-main);
    }
  }
`;

function ProposalDetail({ proposalInfo, walletConnected }) {
  const instance = useInstance(walletConnected);
  const [proposalContracts, setProposalContracts] = useState([]);
  const [proposalFunctions, setProposalFunctions] = useState([]);

  useEffect(() => {
    if (proposalInfo.id) {
      const voteContract = getVoteContract(instance);
      methods
        .call(voteContract.methods.getActions, [proposalInfo.id])
        .then(res => {
          const tempProposalContracts = [];
          const tempProposalFunctions = [];
          res?.signatures?.forEach((signature, _id) => {
            // console.log(res.targets[_id]);

            tempProposalContracts.push(
              CONTRACT_NAMES[res.targets[_id].toLowerCase()] ||
                res.targets[_id].toLowerCase()
            );
            const funcName = signature.slice(0, signature.indexOf('('));

            const matches = signature.match(/\(.*?\)/);
            if (matches) {
              const types = [];
              const typesStr = matches[0].slice(1, -1);
              typesStr.split(',').forEach(item => types.push(item));

              const data = decodeParameters(types, res.calldatas[_id]);
              let updatedData = '';
              data.forEach((dataItem, dataId) => {
                if (
                  types[dataId].startsWith('uint') ||
                  types[dataId].startsWith('int')
                ) {
                  if (Array.isArray(dataItem)) {
                    const tempDataItem = [];
                    dataItem.forEach(item =>
                      tempDataItem.push(item.toString())
                    );
                    updatedData += JSON.stringify(tempDataItem).replaceAll(
                      '"',
                      ''
                    );
                  } else updatedData += dataItem.toString();
                } else if (types[dataId].startsWith('bool')) {
                  if (Array.isArray(dataItem)) {
                    const tempDataItem = [];
                    dataItem.forEach(item =>
                      tempDataItem.push(Number(item) === 0 ? 'false' : 'true')
                    );
                    updatedData += JSON.stringify(tempDataItem).replaceAll(
                      '"',
                      ''
                    );
                  } else
                    updatedData += Number(dataItem) === 0 ? 'false' : 'true';
                } else updatedData += JSON.stringify(dataItem);
                updatedData += ', ';
              });

              if (funcName === 'call') {
                tempProposalFunctions.push(
                  `${funcName}(${res.values[_id].toString()})`
                );
              } else
                tempProposalFunctions.push(
                  `${funcName}(${updatedData.slice(0, -2)})`
                );
            }
          });
          setProposalContracts(tempProposalContracts);
          setProposalFunctions(tempProposalFunctions);
        });
    }
  }, [proposalInfo, instance]);

  return (
    <Card>
      <ProposalDetailWrapper className="flex flex-column">
        <div className="section">
          <Label size="20" primary>
            <FormattedMessage id="Operation" />
          </Label>
          {(proposalContracts || []).map((contractName, idx) => (
            <div key={idx}>
              <ColorLabel size="16" color="#1ba27a">
                {contractName}
              </ColorLabel>
              .<Label size="16">{proposalFunctions[idx]}</Label>
            </div>
          ))}
        </div>
        <div className="section">
          <Label size="20" primary>
            <FormattedMessage id="Description" />
          </Label>
          <Label size="16">
            <ReactMarkdown>{proposalInfo.description}</ReactMarkdown>
          </Label>
        </div>
      </ProposalDetailWrapper>
    </Card>
  );
}

ProposalDetail.propTypes = {
  proposalInfo: PropTypes.object,
  walletConnected: PropTypes.string
};
ProposalDetail.defaultProps = {
  proposalInfo: {},
  walletConnected: ''
};
export default ProposalDetail;
