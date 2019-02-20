import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiSocialGooglePlus } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import styled from 'styled-components';
import { refresh } from '@/actions/session';
import Button from '@/components/ui/button';
import API from '@/services/api';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: #bebebe;
  border: 1px solid #000;
  padding: 3rem 6rem;
  > button {
    width: 100%;
    font-size: 1rem;
    align-items: center;
    justify-content: flex-start;
    > svg {
      font-size: 2rem;
      margin-right: 0.75rem;
    }
  }
`;

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  componentDidMount() {
    window.addEventListener('message', this.onMessage, false);
  }

  componentWillUnmount() {
    const { popupWatcher } = this;
    window.removeEventListener('message', this.onMessage);
    if (popupWatcher) {
      clearInterval(popupWatcher);
      delete this.popupWatcher;
    }
  }

  onMessage({ origin, data: { session } }) {
    const { popupWatcher } = this;
    const { refresh } = this.props;
    if (API.baseURL.indexOf(origin) === 0) {
      clearInterval(popupWatcher);
      delete this.popupWatcher;
      if (session) {
        refresh(session);
      }
    }
  }

  loginWithGoogle({ screenX, screenY }) {
    const w = 512;
    const h = 512;
    const left = (screenX || (window.screen.width / 2)) - (w / 2);
    const top = (screenY || (window.screen.height / 2)) - (h / 2);
    const win = window.open(
      `${API.baseURL}user/google`,
      'loginWithGoogle',
      `width=${w},height=${h},top=${top},left=${left}`
    );
    if (this.popupWatcher) {
      clearInterval(this.popupWatcher);
    }
    this.popupWatcher = setInterval(() => {
      if (!win.window) {
        clearInterval(this.popupWatcher);
        delete this.popupWatcher;
        return;
      }
      win.postMessage(true, API.baseURL);
    }, 100);
  }

  render() {
    return (
      <Wrapper>
        <Box>
          <Button
            type="button"
            onClick={this.loginWithGoogle}
          >
            <TiSocialGooglePlus />
            <Translate value="User.signIn" />
          </Button>
        </Box>
      </Wrapper>
    );
  }
}

Login.propTypes = {
  refresh: PropTypes.func.isRequired,
};

export default connect(
  () => ({}),
  {
    refresh,
  }
)(Login);
