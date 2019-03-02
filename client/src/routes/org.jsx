import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  TiGroup,
  TiMessages,
  TiPlus,
  TiUpload,
} from 'react-icons/ti';
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

const Scroll = styled.div`
  display: flex;
  width: 100%;
  overflow-y: auto;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 0 150px rgba(0, 0, 0, .15);
`;

const uploadButton = `
  > button {
    position: absolute;
    bottom: 0;
    left: 0;
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

const Cover = styled.div`
  flex-shrink: 0;
  background: #eee;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${props => props.cover});
  width: 100%;
  height: 300px;
  position: relative;
  ${uploadButton}
`;

const Grid = styled.div`
  display: flex;
  height: 100%;
  > div, > ul {
    &:nth-child(1) {
      flex-shrink: 0;
      width: 200px;
    }
    &:nth-child(2) {
      width: calc(100% - 200px);
    }
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.div`
  position: relative;
  > img {
    width: 200px;
    height: 200px;
    background: #ccc;
    overflow: hidden;
    vertical-align: middle;
  }
  ${uploadButton}
`;

const Name = styled.div`
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid #aaa;
  font-size: 2.5em;
  padding: 2rem 1rem;
`;

const Actions = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
  > button {
    width: 100%;
    margin: 0 0 0.5rem;
    justify-content: flex-start;
  }
`;

class Org extends PureComponent {
  componentWillMount() {
    this.fetch();
  }

  componentDidUpdate({ isAuth: wasAuth }) {
    const { isAuth } = this.props;
    if (wasAuth !== isAuth) {
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
      <Scroll>
        <Wrapper>
          <Cover cover={`${API.baseURL}org/${id}/cover`}>
            {isAdmin ? (
              <Button
                type="button"
                onClick={() => this.updateImage('cover')}
              >
                <TiUpload />
              </Button>
            ) : null}
          </Cover>
          <Grid>
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
              {isAdmin ? (
                <Actions>
                  <Button
                    type="button"
                  >
                    <TiGroup />
                    <Translate value="Org.manageStudents" />
                  </Button>
                  <Button
                    type="button"
                  >
                    <TiPlus />
                    <Translate value="Org.addToYourWebsite" />
                  </Button>
                  <Button
                    type="button"
                  >
                    <TiMessages />
                    <Translate value="Org.createRoom" />
                  </Button>
                </Actions>
              ) : null}
            </Info>
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
            {!isAuth ? (
              <div>
                <Login />
              </div>
            ) : null}
          </Grid>
        </Wrapper>
      </Scroll>
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
