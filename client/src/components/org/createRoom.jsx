import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiPlus } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import styled from 'styled-components';
import { hide } from '@/actions/dialog';
import { createRoom } from '@/actions/org';
import Button from '@/components/ui/button';
import Dialog from '@/components/ui/dialog';
import Form from '@/components/ui/form';
import Tabs from '@/components/ui/tabs';
import Countries from '@/locales/countries';
import API from '@/services/api';

const Users = styled.div`
  height: 200px;
  overflow-y: scroll;
  border: 1px solid #ccc;
  > label {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #bbb;
    > input {
      margin: 0 0.5rem;
      width: 1rem;
      height: 1rem;
    }
    > img {
      width: 32px;
      height: 32px;
      border-radius: 16px;
      margin-right: 0.5rem;
      vertical-align: middle;
    }
  }
`;

class CreateRoom extends PureComponent {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { type: 'public' };
  }

  onSubmit(e) {
    const { users, hide, createRoom } = this.props;
    const { type } = this.state;
    const { target: form } = e;
    e.preventDefault();
    const payload = {
      type,
      flag: form.flag.value,
      name: form.name.value,
    };
    if (!payload.flag || !payload.name) {
      return;
    }
    switch (type) {
      case 'public':
        payload.peerLimit = parseInt(form.peerLimit.value, 10);
        if (!payload.peerLimit) {
          return;
        }
        break;
      case 'private':
        payload.users = users.reduce((users, { _id }) => ([
          ...users,
          ...(form[`user::${_id}`].checked ? [_id] : []),
        ]), []);
        if (!payload.users.length) {
          return;
        }
        break;
      default:
        break;
    }
    createRoom(payload)
      .then(() => hide('Org.CreateRoom'));
  }

  render() {
    const { users } = this.props;
    const { type } = this.state;
    return (
      <Dialog
        id="Org.CreateRoom"
      >
        <Tabs>
          <div
            className={type === 'public' ? 'active' : ''}
            onClick={() => this.setState({ type: 'public' })}
          >
            <Translate value="Org.CreateRoom.publicRoom" />
          </div>
          <div
            className={type === 'private' ? 'active' : ''}
            onClick={() => this.setState({ type: 'private' })}
          >
            <Translate value="Org.CreateRoom.inviteOnly" />
          </div>
        </Tabs>
        <Form onSubmit={this.onSubmit}>
          <div>
            <label>
              <Translate value="Org.CreateRoom.flag" />
            </label>
            <select name="flag" defaultValue="gb" required>
              {Countries.map(({ code, name }) => (
                <option
                  key={code}
                  value={code}
                >
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>
              <Translate value="Org.CreateRoom.name" />
            </label>
            <input
              type="text"
              name="name"
              required
              autoFocus
            />
          </div>
          {type === 'public' ? (
            <div>
              <label>
                <Translate value="Org.CreateRoom.peerLimit" />
              </label>
              <input
                type="number"
                name="peerLimit"
                min="2"
                max="8"
                defaultValue="4"
                required
              />
            </div>
          ) : null}
          {type === 'private' ? (
            <div>
              <label>
                <Translate value="Org.CreateRoom.users" />
              </label>
              <Users>
                {(
                  users
                    .filter(({ isRequest }) => (!isRequest))
                    .map(({
                      _id,
                      name,
                    }) => (
                      <label key={_id}>
                        <input
                          type="checkbox"
                          name={`user::${_id}`}
                        />
                        <img
                          src={`${API.baseURL}user/${_id}/photo?auth=${API.token}`}
                        />
                        {name}
                      </label>
                    ))
                )}
              </Users>
            </div>
          ) : null}
          <div className="submit">
            <Button
              type="submit"
            >
              <TiPlus />
              <Translate value="Org.CreateRoom.submit" />
            </Button>
          </div>
        </Form>
      </Dialog>
    );
  }
}

CreateRoom.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    isRequest: PropTypes.bool,
    name: PropTypes.string.isRequired,
  })).isRequired,
  createRoom: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
};

export default connect(
  ({ org: { users } }) => ({ users }),
  {
    createRoom,
    hide,
  }
)(CreateRoom);
