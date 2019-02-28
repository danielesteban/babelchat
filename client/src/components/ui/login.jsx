import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiSocialGooglePlus } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { refreshSession } from '@/actions/user';
import Button from '@/components/ui/button';
import API from '@/services/api';

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
    const { onSession, refreshSession } = this.props;
    if (API.baseURL.indexOf(origin) === 0) {
      clearInterval(popupWatcher);
      delete this.popupWatcher;
      if (session) {
        refreshSession(session);
        if (onSession) {
          onSession(session);
        }
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
    const { icon: Icon, label } = this.props;
    return (
      <Button
        type="button"
        onClick={this.loginWithGoogle}
      >
        <Icon />
        <Translate value={label} />
      </Button>
    );
  }
}

Login.defaultProps = {
  icon: TiSocialGooglePlus,
  label: 'User.signIn',
  onSession: undefined,
};

Login.propTypes = {
  icon: PropTypes.func,
  label: PropTypes.string,
  onSession: PropTypes.func,
  refreshSession: PropTypes.func.isRequired,
};

export default connect(
  () => ({}),
  {
    refreshSession,
  }
)(Login);
