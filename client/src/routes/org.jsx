import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  TiClipboard,
  TiGroup,
  TiMessages,
  TiUpload,
} from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import styled from 'styled-components';
import { hide as hideDialog, show as showDialog } from '@/actions/dialog';
import {
  fetch,
  requestAccess,
  reset,
  updateImage,
} from '@/actions/org';
import CreateRoom from '@/components/org/createRoom';
import Rooms from '@/components/org/rooms';
import Users from '@/components/org/users';
import Button from '@/components/ui/button';
import Login from '@/components/ui/login';
import Page from '@/components/ui/page';
import API from '@/services/api';

const NavWidth = '212px';

const Layout = styled(Page)`
  flex-direction: row;
  > div {
    box-sizing: border-box;
    flex-shrink: 0;
  }
`;

const Nav = styled.div`
  display: flex;
  width: ${NavWidth};
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #222;
  color: #eee;
`;

const Content = styled.div`
  width: calc(100% - ${NavWidth});
  display: flex;
  flex-direction: column;
`;

const uploadButton = `
  > button {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0.25rem;
    display: flex;
    font-size: 1.5em;
    border-radius: 2px 0 0 0;
    opacity: 0;
    transition: opacity ease-out .2s;
  }
  &:hover > button {
    opacity: 1;    
  }
`;

const Logo = styled.div`
  position: relative;
  > img {
    width: 180px;
    height: 180px;
    background: #000;
    overflow: hidden;
    vertical-align: middle;
  }
  ${uploadButton}
`;

const Name = styled.div`
  width: 100%;
  font-size: 1.666em;
  padding: 1rem 0 0.5rem;
`;

const Url = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 0 1.5rem;
  color: #aaa;
  user-select: all;
  > a {
    font-size: 1.5em;
  }
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  > button {
    width: 100%;
    margin: 0 0 0.5rem;
    justify-content: flex-start;
    > svg {
      font-size: 1.5em;
      margin-right: 0.25rem;
    }
    .count {
      display: flex;
      margin-left: auto;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background-color: #393;
      border-radius: 9px;
      font-size: 0.85em;
      line-height: 1em;
      transition: background-color ease-out .2s;
      will-change: background-color;
      transform: translate(25%, 0);
    }
    &:hover .count {
      background-color: #111;
    }
  }
`;

const Cover = styled.div`
  flex-shrink: 0;
  background: #000;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: url(${props => props.cover});
  width: 100%;
  height: 312px;
  position: relative;
  ${uploadButton}
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
  > p {
    font-size: 1.5rem;
    color: #666;
  }
  > button > svg {
    font-size: 2em;
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
    const { hideDialog, reset } = this.props;
    reset();
    hideDialog('Org.CreateRoom');
    hideDialog('Org.ManageUsers');
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
      requestAccess,
      match: { params: { slug } },
      name,
      pendingRequests,
      showDialog,
    } = this.props;
    if (!hasLoaded) {
      return null;
    }
    return (
      <Layout>
        <Nav>
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
          <Url>
            {`${__DOMAIN__}${__BASENAME__}${slug}`}
            {isAdmin ? (
              <a onClick={() => document.execCommand('copy')}>
                <TiClipboard />
              </a>
            ) : null}
          </Url>
          {isAdmin ? (
            <Actions>
              <Button
                type="button"
                onClick={() => showDialog('Org.ManageUsers')}
              >
                <TiGroup />
                <Translate value="Org.Nav.manageUsers" />
                {pendingRequests > 0 ? (
                  <span className="count">{pendingRequests}</span>
                ) : null}
              </Button>
              <Button
                type="button"
                onClick={() => showDialog('Org.CreateRoom')}
              >
                <TiMessages />
                <Translate value="Org.Nav.createRoom" />
              </Button>
            </Actions>
          ) : null}
        </Nav>
        <Content>
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
          {isUser && isActive ? (
            <Rooms org={slug} />
          ) : null}
          {isUser && !isActive ? (
            <Section>
              <p>
                Your account is pending approval
              </p>
            </Section>
          ) : null}
          {isAuth && !isUser ? (
            <Section>
              <p>
                Your are not a student of this organization
              </p>
              <Button
                type="button"
                onClick={requestAccess}
              >
                Request access
              </Button>
            </Section>
          ) : null}
          {!isAuth ? (
            <Section>
              <p>
                Welcome, please sign-in:
              </p>
              <Login />
            </Section>
          ) : null}
          {isAdmin ? (
            <div>
              <CreateRoom />
              <Users />
            </div>
          ) : null}
        </Content>
      </Layout>
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
  pendingRequests: PropTypes.number.isRequired,
  fetch: PropTypes.func.isRequired,
  hideDialog: PropTypes.func.isRequired,
  requestAccess: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  showDialog: PropTypes.func.isRequired,
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
      pendingRequests,
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
    pendingRequests,
  }),
  {
    fetch,
    hideDialog,
    requestAccess,
    reset,
    showDialog,
    updateImage,
  }
)(Org);
