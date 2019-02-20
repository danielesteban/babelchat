import styled from 'styled-components';

export default styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  margin: 0;
  background-color: ${props => (props.primary ? '#eee' : '#333')};
  color: ${props => (props.primary ? '#333' : '#eee')};
  border: 1px solid #151515;
  border-radius: 2px;
  outline: 0;
  font-family: inherit;
  font-size: inherit;
  font-weight: 700;
  transition: background-color ease-out .2s, opacity ease-out .2s;
  will-change: background-color, opacity;
  cursor: pointer;
  > span {
    margin-left: 0.5rem;
  }
  &:hover {
    background-color: ${props => (props.primary ? '#fff' : '#555')};
  }
`;
