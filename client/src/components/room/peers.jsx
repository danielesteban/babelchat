import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import API from '@/services/api';
import Video from './video';

const Listing = styled.div`
  position: absolute;
  top: 100px;
  right: 0;
  > img, > div > video {
    display: block;
    background: #000;
    width: 100px;
    height: 100px;
    vertical-align: middle;
    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
  }
`;

const Peers = ({ peers }) => (
  <Listing>
    {peers.map(({
      _id,
      peer,
      video,
    }) => (
      video && video.srcObject.getVideoTracks().length ? (
        <Video
          key={peer}
          video={video}
        />
      ) : (
        <img
          key={peer}
          src={`${API.baseURL}user/${_id}/photo?auth=${API.token}`}
        />
      )
    ))}
  </Listing>
);

Peers.propTypes = {
  peers: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    peer: PropTypes.string.isRequired,
    video: PropTypes.object,
  })).isRequired,
};

export default connect(
  ({
    room: { peers },
  }) => ({
    peers,
  })
)(Peers);
