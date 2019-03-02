import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Scroll = styled.div`
  display: flex;
  width: 100%;
  overflow-y: overlay;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1024px;
  flex-direction: column;
  background: #fff;
  margin: 0 auto;
  box-shadow: 0 0 150px rgba(0, 0, 0, .15);
`;

const Page = ({ children, className }) => (
  <Scroll>
    <Wrapper className={className}>
      {children}
    </Wrapper>
  </Scroll>
);

Page.defaultProps = {
  className: null,
};

Page.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  className: PropTypes.string,
};

export default Page;
