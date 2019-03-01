import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiGroup, TiPlus } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@/components/ui/button';
import Login from '@/components/ui/login';
import Dialog from '@/components/ui/dialog';
import Form from '@/components/ui/form';
import { showSignup, signup, hideSignup } from '@/actions/org';
import { fetchOrgs } from '@/actions/user';

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
  text-align: center;
  box-shadow: 0 0 150px rgba(0, 0, 0, .15);
`;

const Heading = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #222;
  height: 250px;
  > h2 {
    color: #fff;
    font-size: 3em;
    margin: 0 0 1.5rem;
  }
  > p {
    color: #eee;
    margin: 0;
    font-size: 1.5em;
  }
`;

const Columns = styled.div`
  display: flex;
  height: 100%;
  > div, > ul {
    &:nth-child(1) {
      width: 60%;
    }
    &:nth-child(2) {
      width: 40%;
    }
    > h3 {
      font-size: 2em;
      margin: 1.5rem 0;
    }
  }
`;

const Orgs = styled.div`
  background: #eee;
  > a {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    font-size: 1.5em;
    padding: 0.5rem 1.5rem;
    color: #000;
    text-decoration: none;
    transition: color ease-out .15s, background-color ease-out .15s;
    will-change: color, background-color;
    &:nth-child(odd) {
      background: #ddd;
    }
    &.full {
      opacity: 0.5;
      pointer-events: none;
    }
    > strong > img {
      width: 1.5rem;
      height: 1.125rem;
      margin-right: 1rem;
      vertical-align: middle;
    }
    &:hover {
      color: #eee;
      background-color: #393;
    }
  }
  > button {
    margin: 0 auto;
    width: 50%;
    font-size: 1.5em;    
    > svg {
      font-size: 2em;
    }
  }
`;

const Features = styled.ul`
  margin: 2rem 1rem;
  text-align: left;
  > li {
    padding: 0.5rem 0.5rem;
    font-size: 1.5em;
  }
`;

const CTA = styled.div`
  margin-top: auto;
  padding: 1rem 0 2rem;
  background: #393;
  color: #eee;
  > p {
    font-size: 1.5em;
  }
  > button {
    margin: 0 auto;
    font-size: 2em;
    padding: 1rem 2rem;
  }
`;

class Landing extends PureComponent {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const { fetchOrgs, isAuth } = this.props;
    if (isAuth) {
      fetchOrgs();
    }
  }

  onSubmit(e) {
    const { hideSignup, history, signup } = this.props;
    const { target: form } = e;
    e.preventDefault();
    const name = form.name.value;
    if (!name) {
      return;
    }
    signup({ name })
      .then(({ value: slug }) => (
        history.push(`/${slug}`)
      ))
      .catch(() => {})
      .finally(hideSignup);
  }

  render() {
    const {
      hideSignup,
      isAuth,
      isSigningup,
      orgs,
      showSignup,
    } = this.props;
    return (
      <Scroll>
        <Wrapper>
          <Heading>
            <h2>BabelChat</h2>
            <p>Create your own language exchange service in seconds</p>
          </Heading>
          <Columns>
            <Features>
              <li>
                1 to 1 conversations with students
              </li>
              <li>
                Group videochat rooms (up to 8 peers)
              </li>
              <li>
                Whiteboard with drag&drop image sharing
              </li>
              <li>
                Customize it with your own branding
              </li>
              <li>
                Integrate it onto your website
              </li>
              <li>
                Free unlimited rooms/students while in open alpha
              </li>
            </Features>
            <Orgs>
              <h3>Your orgs</h3>
              {isAuth ? (
                orgs.map(({ name, slug }) => (
                  <Link
                    key={slug}
                    to={{ pathname: `/${slug}` }}
                  >
                    {name}
                  </Link>
                ))
              ) : (
                <Login />
              )}
            </Orgs>
          </Columns>
          <CTA>
            <p>
              <Translate value="Org.CTA.copy" />
            </p>
            {isAuth ? (
              <Button
                type="button"
                onClick={showSignup}
              >
                <TiGroup />
                <Translate value="Org.CTA.button" />
              </Button>
            ) : (
              <Login
                icon={TiGroup}
                label="Org.CTA.button"
                onSession={showSignup}
              />
            )}
          </CTA>
          {isSigningup ? (
            <Dialog
              title="Org.Signup.title"
              hide={hideSignup}
            >
              <Form onSubmit={this.onSubmit}>
                <div>
                  <label><Translate value="Org.Signup.name" /></label>
                  <input type="text" name="name" />
                </div>
                <div className="submit">
                  <Button
                    type="submit"
                  >
                    <TiPlus />
                    <Translate value="Org.Signup.submit" />
                  </Button>
                </div>
              </Form>
            </Dialog>
          ) : null}
        </Wrapper>
      </Scroll>
    );
  }
}

Landing.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  history: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
  isAuth: PropTypes.bool.isRequired,
  isSigningup: PropTypes.bool.isRequired,
  orgs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  })).isRequired,
  fetchOrgs: PropTypes.func.isRequired,
  hideSignup: PropTypes.func.isRequired,
  showSignup: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
};

export default connect(
  ({
    org: { isSigningup },
    user: { isAuth, orgs },
  }) => ({ isAuth, isSigningup, orgs }),
  {
    fetchOrgs,
    hideSignup,
    showSignup,
    signup,
  }
)(Landing);
