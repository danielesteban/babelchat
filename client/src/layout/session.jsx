import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import styled from 'styled-components';
import { signout } from '@/actions/session';
import API from '@/services/api';
import Video from '@/components/room/video';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  .toggle {
    > img, > div > video {
      background: #000;
      width: 100px;
      height: 100px;
      vertical-align: middle;
      box-shadow: 0 0 10px rgba(0, 0, 0, .5);
    }
  }
  .menu {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background: #eee;
    border: 1px solid #000;
    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
    z-index: 1;
    > a, > span {
      display: block;
      padding: 0.5rem 1rem;
      white-space: nowrap;
    }
    > span {
      color: #bebebe;
      border-bottom: 1px solid #bebebe;
    }
    > a {
      text-decoration: none;
      cursor: pointer;
    }
  }
  &:hover .menu {
    display: block;
  }
`;

const Session = ({
  isAuth,
  profile,
  video,
  signout,
}) => (
  isAuth ? (
    <Wrapper>
      <div className="toggle">
        {video ? (
          <Video
            video={video}
          />
        ) : (
          <img
            alt={profile.name}
            src={`${API.baseURL}user/${profile._id}/photo?auth=${API.token}`}
          />
        )}
      </div>
      <div className="menu">
        <span>{profile.name}</span>
        <a onClick={signout}>
          <Translate value="User.signOut" />
        </a>
      </div>
    </Wrapper>
  ) : null
);

Session.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  profile: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  video: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  signout: PropTypes.func.isRequired,
};

export default connect(
  ({
    session: { isAuth, profile },
    room: { video },
  }) => ({
    isAuth,
    profile,
    video,
  }),
  {
    signout,
  }
)(Session);
