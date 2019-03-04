import PropTypes from 'prop-types';
import React from 'react';
import { TiTimes } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import styled from 'styled-components';
import { hide } from '@/actions/dialog';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, .75);
  z-index: 100000;
`;

const Wrapper = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  width: ${props => props.width};
  display: flex;
  flex-direction: column;
  border-radius: 2px;
`;

const Heading = styled.h2`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  margin: 0;
  font-size: 1.25em;
  padding: 0 1rem;
  background: #393;
  color: #eee;
  border-radius: 2px 2px 0 0;
  > a {
    display: flex;
    text-decoration: none;
    font-size: 1.5em;
    cursor: pointer;
  }
`;

const Content = styled.div`
  padding: 1rem;
  background: #eee;
  color: #353535;
  border-radius: 0 0 2px 2px;
`;

const Dialog = ({
  children,
  id,
  isShowing,
  title,
  width,
  hide,
}) => (isShowing ? (
  <Overlay>
    <Wrapper width={width || '400px'}>
      <Heading>
        <Translate value={title || `${id}.title`} />
        <a
          onClick={() => hide(id)}
        >
          <TiTimes />
        </a>
      </Heading>
      <Content>
        {children}
      </Content>
    </Wrapper>
  </Overlay>
) : null);

Dialog.defaultProps = {
  title: undefined,
  width: undefined,
};

Dialog.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  isShowing: PropTypes.bool.isRequired,
  title: PropTypes.string,
  width: PropTypes.string,
  hide: PropTypes.func.isRequired,
};

export default connect(
  ({ dialog }, { id }) => ({
    isShowing: dialog[id] || false,
  }),
  {
    hide,
  }
)(Dialog);
