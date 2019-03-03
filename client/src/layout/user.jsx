import PropTypes from 'prop-types';
import React from 'react';
import {
  TiCog,
  TiVolumeDown,
  TiVolumeMute,
  TiEject,
} from 'react-icons/ti';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { show as showDialog } from '@/actions/dialog';
import { signout, toggleAudio } from '@/actions/user';
import Video from '@/components/room/video';
import API from '@/services/api';
import Settings from './settings';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: #000;
  box-shadow: 0 0 10px rgba(0, 0, 0, .5);
  overflow: hidden;
  &, > img, > div > video {
    width: 100px;
    height: 100px;
  }
  > img {
    vertical-align: middle;
  }
  .actions {
    display: flex;
    position: absolute;
    bottom: -100%;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    font-size: 2em;
    color: #eee;
    transition: bottom ease-out .2s;
    will-change: bottom;
    > a {
      cursor: pointer;
      &:hover {
        background: #eee;
        color: #333;
      }
    }
  }
  &:hover .actions {
    bottom: 0;
  }
`;

const User = ({
  isAudioMuted,
  isAuth,
  profile,
  video,
  showDialog,
  signout,
  toggleAudio,
}) => (
  isAuth ? (
    <div>
      <Wrapper>
        {video && video.srcObject.getVideoTracks().length ? (
          <Video
            video={video}
          />
        ) : (
          <img
            src={`${API.baseURL}user/${profile._id}/photo?auth=${API.token}`}
          />
        )}
        <div className="actions">
          <a onClick={toggleAudio}>
            {isAudioMuted ? <TiVolumeMute /> : <TiVolumeDown />}
          </a>
          <a onClick={() => showDialog('User.Settings')}>
            <TiCog />
          </a>
          <a onClick={signout}>
            <TiEject />
          </a>
        </div>
      </Wrapper>
      <Settings />
    </div>
  ) : null
);

User.propTypes = {
  isAudioMuted: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
  profile: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  video: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  showDialog: PropTypes.func.isRequired,
  signout: PropTypes.func.isRequired,
  toggleAudio: PropTypes.func.isRequired,
};

export default connect(
  ({
    user: {
      isAudioMuted,
      isAuth,
      profile,
      video,
    },
  }) => ({
    isAudioMuted,
    isAuth,
    profile,
    video,
  }),
  {
    showDialog,
    signout,
    toggleAudio,
  }
)(User);
