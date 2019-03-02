import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiTick } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { hideSettings as hide, saveSettings as save } from '@/actions/user';
import Button from '@/components/ui/button';
import Dialog from '@/components/ui/dialog';
import Form from '@/components/ui/form';

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
    const { hide, isStreaming, save } = this.props;
    e.preventDefault();
    const { target: form } = e;
    const audioInput = form.audioInput.value;
    const videoInput = form.videoInput.value;
    save({ audioInput, videoInput });
    hide();
    if (isStreaming) {
      window.location.reload();
    }
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
      <Dialog
        title="User.settings"
        hide={hide}
      >
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
            <Button type="submit">
              <TiTick />
              <Translate value="User.saveSettings" />
            </Button>
          </div>
        </Form>
      </Dialog>
    );
  }
}

Settings.propTypes = {
  isStreaming: PropTypes.bool.isRequired,
  settings: PropTypes.shape({
    audioInput: PropTypes.string.isRequired,
    videoInput: PropTypes.string.isRequired,
  }).isRequired,
  hide: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

export default connect(
  ({
    user: { settings, stream },
  }) => ({
    isStreaming: !!stream,
    settings,
  }),
  {
    hide,
    save,
  }
)(Settings);
