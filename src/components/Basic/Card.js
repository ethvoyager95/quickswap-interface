import styled from 'styled-components';

export const Card = styled.div`
  height: 100%;
  display: flex;
  border-radius: 6px;
  margin: 10px 15px;
  padding: 0px;
  flex-direction: ${({ direction }) => direction};
  justify-content: center;
`;
