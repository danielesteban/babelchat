import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiTimes } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import styled from 'styled-components';
import { hideSettings as hide, saveSettings as save } from '@/actions/user';

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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -75%);
  width: 400px;
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
  background: #151515;
  color: #eee;
  border-radius: 2px 2px 0 0;
  > a {
    display: flex;
    text-decoration: none;
    font-size: 1.5em;
    cursor: pointer;
  }
`;

const Form = styled.form`
  padding: 1rem;
  background: #eee;
  color: #353535;
  border-radius: 0 0 2px 2px;
  > div {
    margin-top: 0.5rem;
    &:first-child {
      margin-top: 0;    
    }
    > label {
      font-weight: 700;
    }
    > select {
      width: 100%;
      padding: 0.5rem;
      cursor: pointer;
    }
    > button {
      margin: 1rem auto;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    &.submit {
      display: flex;
    }
  }
`;

class Settings extends PureComponent {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {};
  }

  componentDidMount() {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        const audioInputs = devices.filter(({ kind }) => (kind === 'audioinput'));
        const videoInputs = devices.filter(({ kind }) => (kind === 'videoinput'));
        this.setState({
          audioInputs,
          videoInputs,
        });
      })
      .catch(() => {});
  }

  onSubmit(e) {
    const { hide, save } = this.props;
    e.preventDefault();
    const { target: form } = e;
    const audioInput = form.audioInput.value;
    const videoInput = form.videoInput.value;
    save({ audioInput, videoInput });
    hide();
  }

  render() {
    const {
      settings: {
        audioInput,
        videoInput,
      },
      hide,
    } = this.props;
    const {
      audioInputs,
      videoInputs,
    } = this.state;
    if (!audioInputs || !videoInputs) {
      return null;
    }
    return (
      <Overlay>
        <Wrapper>
          <Heading>
            <Translate value="User.settings" />
            <a
              onClick={() => hide()}
            >
              <TiTimes />
            </a>
          </Heading>
          <Form onSubmit={this.onSubmit}>
            <div>
              <label><Translate value="User.audioInput" /></label>
              <select name="audioInput" defaultValue={audioInput}>
                {audioInputs.map(({ deviceId, label }) => (
                  <option key={deviceId} value={deviceId}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label><Translate value="User.videoInput" /></label>
              <select name="videoInput" defaultValue={videoInput}>
                {videoInputs.map(({ deviceId, label }) => (
                  <option key={deviceId} value={deviceId}>{label}</option>
                ))}
              </select>
            </div>
            <div className="submit">
              <button type="submit">
                <Translate value="User.saveSettings" />
              </button>
            </div>
          </Form>
        </Wrapper>
      </Overlay>
    );
  }
}

Settings.propTypes = {
  settings: PropTypes.shape({
    audioInput: PropTypes.string.isRequired,
    videoInput: PropTypes.string.isRequired,
  }).isRequired,
  hide: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

export default connect(
  ({
    user: { settings },
  }) => ({
    settings,
  }),
  {
    hide,
    save,
  }
)(Settings);
