import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiPlus, TiUpload } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import styled from 'styled-components';
import {
  fetch,
  reset,
  updateImage,
} from '@/actions/org';
import Rooms from '@/components/org/rooms';
import Button from '@/components/ui/button';
import Login from '@/components/ui/login';
import API from '@/services/api';

const Wrapper = styled.div`
  background: #fff;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const uploadButton = `
  > button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.25rem;
    display: flex;
    font-size: 1.5em;
    opacity: 0;
    transition: opacity ease-out .2s;
  }
  &:hover > button {
    opacity: 1;    
  }
`;

const Heading = styled.div`
  box-sizing: border-box;
  background: #eee;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${props => props.cover});
  width: 100%;
  height: 250px;
  border-bottom: 1px solid #aaa;
  position: relative;
  ${uploadButton}
`;

const Info = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-end;
  left: 0;
  bottom: 0;
`;

const Logo = styled.div`
  position: relative;
  > img {
    width: 100px;
    height: 100px;
    border-radius: 0 4px 0 0;
    background: #ccc;
    overflow: hidden;
    border: 1px solid #aaa;
    border-bottom: 0;
    border-left: 0;
    vertical-align: middle;
  }
  ${uploadButton}
`;

const Name = styled.div`
  font-size: 2.5em;
  padding: 1rem;
`;

const Actions = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  right: 0rem;
  bottom: 0rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, ${1 / 3});
  border-radius: 4px 0 0 0;
  border: 1px solid #aaa;
  border-bottom: 0;
  border-right: 0;
`;

class Org extends PureComponent {
  componentDidMount() {
    this.fetch();
  }

  componentWillReceiveProps({ isAuth }) {
    const { isAuth: currentAuth } = this.props;
    if (isAuth !== currentAuth) {
      this.fetch();
    }
  }

  componentWillUnmount() {
    const { reset } = this.props;
    reset();
  }

  fetch() {
    const {
      match: { params: { slug } },
      fetch,
      history,
    } = this.props;
    fetch(slug)
      .catch(() => (
        history.replace('404')
      ));
  }

  updateImage(image) {
    const {
      updateImage,
    } = this.props;
    const input = document.createElement('input');
    input.accept = 'image/*';
    input.type = 'file';
    input.onchange = () => {
      const [file] = input.files;
      if (file) {
        updateImage({ image, blob: file })
          .then(() => (
            window.location.reload()
          ));
      }
    };
    input.click();
  }

  render() {
    const {
      hasLoaded,
      id,
      isActive,
      isAdmin,
      isAuth,
      isUser,
      match: { params: { slug } },
      name,
    } = this.props;
    if (!hasLoaded) {
      return null;
    }
    return (
      <Wrapper>
        <Heading cover={`${API.baseURL}org/${id}/cover`}>
          <Info>
            <Logo>
              <img src={`${API.baseURL}org/${id}/logo`} />
              {isAdmin ? (
                <Button
                  type="button"
                  onClick={() => this.updateImage('logo')}
                >
                  <TiUpload />
                </Button>
              ) : null}
            </Logo>
            <Name>
              { name }
            </Name>
          </Info>
          <Actions>
            {isAdmin ? (
              <Button
                type="button"
              >
                <TiPlus />
                <Translate value="Org.createRoom" />
              </Button>
            ) : null}
            {!isAuth ? <Login /> : null}
          </Actions>
          {isAdmin ? (
            <Button
              type="button"
              onClick={() => this.updateImage('cover')}
            >
              <TiUpload />
            </Button>
          ) : null}
        </Heading>
        {isUser && isActive ? <Rooms org={slug} /> : null}
        {isUser && !isActive ? (
          <div>
            Pending approval
          </div>
        ) : null}
        {isAuth && !isUser ? (
          <div>
            <a>Request approval</a>
          </div>
        ) : null}
      </Wrapper>
    );
  }
}

Org.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  /* eslint-disable react/forbid-prop-types */
  history: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
  isUser: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  fetch: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  updateImage: PropTypes.func.isRequired,
};

export default connect(
  ({
    org: {
      hasLoaded,
      id,
      isActive,
      isAdmin,
      isUser,
      name,
    },
    user: {
      isAuth,
    },
  }) => ({
    hasLoaded,
    id,
    isActive,
    isAdmin,
    isAuth,
    isUser,
    name,
  }),
  {
    fetch,
    reset,
    updateImage,
  }
)(Org);
