import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import WebSocket from 'reconnecting-websocket';
import Peer from 'simple-peer';
import {
  addPhoto,
  join,
  removePhoto,
  reset,
  peerJoin,
  peerLeave,
  peerSignal,
  peerStream,
  startStream,
} from '@/actions/room';
import * as types from '@/actions/types';
import API from '@/services/api';

class Events extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  componentWillMount() {
    const {
      slug,
      hideLoading,
      showLoading,
      startStream,
    } = this.props;

    // Connect to room server
    showLoading();
    this.socket = new WebSocket(
      `${API.baseURL.replace(/http/, 'ws')}room/${slug}`,
      API.token
    );
    this.socket.onopen = () => {
      this.socket.onclose = null;
      this.socket.onerror = null;
      hideLoading();
    };
    this.socket.onmessage = this.onMessage;

    // Open audio+video stream
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: 'user',
        width: 640,
        height: 640,
      },
    })
      .then(startStream)
      .catch((err) => { console.log(err); });

    document.addEventListener('dragover', Events.onDragOver, false);
    document.addEventListener('drop', this.onDrop, false);
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
    document.removeEventListener('dragover', Events.onDragOver);
    document.removeEventListener('drop', this.onDrop);
  }

  static onDragOver(e) {
    e.preventDefault();
  }

  onDrop(e) {
    const { socket } = this;
    const {
      clientX,
      clientY,
      dataTransfer: { files: [file] },
    } = e;
    e.preventDefault();
    if (!file) {
      return;
    }
    const origin = {
      x: clientX - (window.innerWidth * 0.5),
      y: clientY - (window.innerHeight * 0.5),
    };
    const reader = new FileReader();
    reader.onload = () => {
      socket.send(JSON.stringify({
        type: 'ROOM/ADD_PHOTO',
        payload: {
          origin,
          photo: reader.result.substr(reader.result.indexOf('base64') + 7),
        },
      }));
    };
    reader.readAsDataURL(file);
  }

  onMessage({ data }) {
    const { socket } = this;
    const {
      addPhoto,
      join,
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
      default:
        break;
    }
  }

  connectToPeer(peer, initiator = false) {
    const { socket } = this;
    const { stream, peerStream } = this.props;
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
  slug: PropTypes.string.isRequired,
  stream: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  addPhoto: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
  join: PropTypes.func.isRequired,
  removePhoto: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  peerJoin: PropTypes.func.isRequired,
  peerLeave: PropTypes.func.isRequired,
  peerSignal: PropTypes.func.isRequired,
  peerStream: PropTypes.func.isRequired,
  showLoading: PropTypes.func.isRequired,
  startStream: PropTypes.func.isRequired,
};

export default connect(
  ({ room: { stream } }) => ({ stream }),
  {
    addPhoto,
    hideLoading,
    join,
    removePhoto,
    reset,
    peerJoin,
    peerLeave,
    peerSignal,
    peerStream,
    showLoading,
    startStream,
  }
)(Events);
