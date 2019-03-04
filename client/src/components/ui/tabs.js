import styled from 'styled-components';

export default styled.div`
  box-sizing: border-box;
  display: flex;
  margin: -1rem;
  margin-bottom: 1rem;
  background-color: #111;
  color: #eee;
  height: 2.5rem;
  > div {
    display: flex;
    align-items: center;
    font-weight: 700;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;
    transition: background-color ease-out .2s;
    will-change: background-color, color;
    border-right: 1px solid #222;
    &:hover {
      background-color: #333;
    }
    &.active {
      background-color: #eee;
      color: #353535;
      cursor: default;
    }
  }
`;
