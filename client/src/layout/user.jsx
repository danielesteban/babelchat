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
import { showSettings, signout, toggleAudio } from '@/actions/user';
import API from '@/services/api';
import Video from '@/components/room/video';
import Settings from './settings';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: #000;
  width: 100px;
  height: 100px;
  vertical-align: middle;
  box-shadow: 0 0 10px rgba(0, 0, 0, .5);
  overflow: hidden;
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
  isShowingSettings,
  profile,
  video,
  showSettings,
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
          <a onClick={showSettings}>
            <TiCog />
          </a>
          <a onClick={signout}>
            <TiEject />
          </a>
        </div>
      </Wrapper>
      {isShowingSettings ? (
        <Settings />
      ) : null}
    </div>
  ) : null
);

User.propTypes = {
  isAudioMuted: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
  isShowingSettings: PropTypes.bool.isRequired,
  profile: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  video: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  showSettings: PropTypes.func.isRequired,
  signout: PropTypes.func.isRequired,
  toggleAudio: PropTypes.func.isRequired,
};

export default connect(
  ({
    user: {
      isAudioMuted,
      isAuth,
      isShowingSettings,
      profile,
      video,
    },
  }) => ({
    isAudioMuted,
    isAuth,
    isShowingSettings,
    profile,
    video,
  }),
  {
    showSettings,
    signout,
    toggleAudio,
  }
)(User);
