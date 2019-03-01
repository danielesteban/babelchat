import styled from 'styled-components';

export default styled.form`
  > div {
    margin-top: 0.5rem;
    text-align: left;
    &:first-child {
      margin-top: 0;    
    }
    > label {
      display: block;
      width: 100%;
      font-weight: 700;
    }
    > input, > select {
      display: block;
      font-family: inherit;
      box-sizing: border-box;
      width: 100%;
      padding: 0.5rem;
      cursor: pointer;
      border: 1px solid #ccc;
    }
    > button {
      margin: 1rem auto;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
  }
`;
