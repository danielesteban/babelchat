import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { withRouter } from 'react-router';
import WebSocket from 'reconnecting-websocket';
import Peer from 'simple-peer';
import {
  addPhoto,
  join,
  movePhoto,
  removePhoto,
  reset,
  peerJoin,
  peerLeave,
  peerPointer,
  peerSignal,
  peerStream,
} from '@/actions/room';
import { startStream } from '@/actions/user';
import * as types from '@/actions/types';
import API from '@/services/api';

class Events extends Component {
  constructor(props) {
    super(props);
    this.onMessage = this.onMessage.bind(this);
  }

  componentWillMount() {
    const {
      match: { params: { slug } },
      settings: {
        audioInput,
        videoInput,
      },
      startStream,
    } = this.props;

    // Connect to room server
    this.connectToServer(slug);

    // Open audio+video stream
    navigator.mediaDevices.getUserMedia({
      audio: audioInput ? { deviceId: { exact: audioInput } } : true,
      video: {
        width: 640,
        height: 640,
        ...(videoInput ? { deviceId: { exact: videoInput } } : { facingMode: 'user' }),
      },
    })
      .then(startStream)
      .catch(() => {
        // Failed to get video stream.. Try with just audio
        navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        })
          .then(startStream)
          .catch(() => {});
      });
  }

  componentWillReceiveProps({ match: { params: { slug } } }) {
    const {
      match: { params: { slug: currentSlug } },
      reset,
    } = this.props;
    if (currentSlug !== slug) {
      reset();
      this.connectToServer(slug);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    const { socket } = this;
    const { hideLoading, reset } = this.props;
    if (socket.readyState === WebSocket.CONNECTING) {
      hideLoading();
    }
    socket.close(1000);
    reset();
  }

  onMessage({ data }) {
    const { socket } = this;
    const {
      addPhoto,
      history,
      join,
      movePhoto,
      peerJoin,
      peerLeave,
      peerSignal,
      removePhoto,
    } = this.props;
    let event;
    try {
      event = JSON.parse(data);
    } catch (e) {
      return;
    }
    switch (event.type) {
      case types.ROOM_ADD_PHOTO:
        addPhoto(event.payload);
        break;
      case types.ROOM_MOVE_PHOTO:
        movePhoto(event.payload);
        break;
      case types.ROOM_REMOVE_PHOTO:
        removePhoto(event.payload);
        break;
      case types.ROOM_JOIN:
        join({
          ...event.payload,
          peers: event.payload.peers.map(peer => this.connectToPeer(peer, true)),
          socket,
        });
        break;
      case types.ROOM_PEER_JOIN:
        peerJoin(this.connectToPeer(event.payload));
        break;
      case types.ROOM_PEER_LEAVE:
        peerLeave(event.payload);
        break;
      case types.ROOM_PEER_SIGNAL:
        peerSignal(event.payload);
        break;
      case types.ROOM_ERROR:
      case types.ROOM_NOT_FOUND:
        history.replace('/404');
        break;
      default:
        break;
    }
  }

  connectToServer(room) {
    const {
      hideLoading,
      showLoading,
    } = this.props;
    if (this.socket) {
      if (this.socket.readyState === WebSocket.CONNECTING) {
        hideLoading();
      }
      this.socket.close(1000);
    }
    showLoading();
    this.socket = new WebSocket(
      `${API.baseURL.replace(/http/, 'ws')}room/${room}`,
      API.token
    );
    this.socket.onopen = () => {
      this.socket.onclose = null;
      this.socket.onerror = null;
      hideLoading();
    };
    this.socket.onmessage = this.onMessage;
  }

  connectToPeer(peer, initiator = false) {
    const { socket } = this;
    const { stream, peerPointer, peerStream } = this.props;
    peer.connection = new Peer({
      initiator,
      stream,
    });
    peer.connection.on('signal', (signal) => {
      socket.send(JSON.stringify({
        type: 'ROOM/PEER_SIGNAL',
        payload: {
          peer: peer.peer,
          signal,
        },
      }));
    });
    peer.connection.on('data', ({ buffer }) => (
      peerPointer({ peer: peer.peer, pointer: [...(new Int32Array(buffer))] })
    ));
    peer.connection.on('stream', stream => (
      peerStream({ peer: peer.peer, stream })
    ));
    return peer;
  }

  render() {
    return null;
  }
}

Events.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  history: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  settings: PropTypes.shape({
    audioInput: PropTypes.string.isRequired,
    videoInput: PropTypes.string.isRequired,
  }).isRequired,
  stream: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  addPhoto: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
  join: PropTypes.func.isRequired,
  movePhoto: PropTypes.func.isRequired,
  removePhoto: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  peerJoin: PropTypes.func.isRequired,
  peerLeave: PropTypes.func.isRequired,
  peerPointer: PropTypes.func.isRequired,
  peerSignal: PropTypes.func.isRequired,
  peerStream: PropTypes.func.isRequired,
  showLoading: PropTypes.func.isRequired,
  startStream: PropTypes.func.isRequired,
};

export default withRouter(connect(
  ({ user: { settings, stream } }) => ({ settings, stream }),
  {
    addPhoto,
    hideLoading,
    join,
    movePhoto,
    removePhoto,
    reset,
    peerJoin,
    peerLeave,
    peerPointer,
    peerSignal,
    peerStream,
    showLoading,
    startStream,
  }
)(Events));
