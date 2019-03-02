import PropTypes from 'prop-types';
import React from 'react';
import LoadingBar from 'react-redux-loading-bar';
import styled from 'styled-components';
import User from './user';

const Route = styled.div`
  display: flex;
  height: 100vh;
`;

const loadingBarStyle = {
  backgroundColor: '#393',
  zIndex: 1,
};

const Layout = ({ children }) => (
  <div>
    <LoadingBar style={loadingBarStyle} />
    <Route>
      { children }
    </Route>
    <User />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
