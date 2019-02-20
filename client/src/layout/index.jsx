import PropTypes from 'prop-types';
import React from 'react';
import LoadingBar from 'react-redux-loading-bar';
import styled from 'styled-components';
import Session from './session';

const Route = styled.div`
  display: flex;
  height: 100vh;
`;

const loadingBarStyle = {
  backgroundColor: '#bebebe',
};

const Layout = ({ children }) => (
  <div>
    <LoadingBar style={loadingBarStyle} />
    <Session />
    <Route>
      { children }
    </Route>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
