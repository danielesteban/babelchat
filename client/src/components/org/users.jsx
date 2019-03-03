import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiTick, TiTimes, TiTrash } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import styled from 'styled-components';
import {
  fetchUsers as fetch,
  removeUser,
  resolveRequest,
} from '@/actions/org';
import Button from '@/components/ui/button';
import Dialog from '@/components/ui/dialog';
import API from '@/services/api';

const Scroll = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
  &:last-child {
    margin-bottom: 0;
  }
  > div {
    display: flex;
    align-items: center;
    > button {
      margin-left: 0.5rem;
    }
    > img {
      width: 32px;
      height: 32px;
      border-radius: 16px;
      margin-right: 0.5rem;
      vertical-align: middle;
    }
  }
  > button {
    display: none;
    padding: 0.2rem 1rem;
    font-size: 1.4rem;
  }
  &:hover > button {
    display: flex;
  }
`;

class Users extends PureComponent {
  componentDidMount() {
    const { fetch } = this.props;
    fetch();
  }

  render() {
    const {
      list,
      removeUser,
      resolveRequest,
    } = this.props;
    return (
      <Dialog
        id="Org.ManageUsers"
        width="512px"
      >
        <Scroll>
          {list.map(({
            _id,
            isRequest,
            name,
          }) => (
            <User key={_id}>
              <div>
                <img
                  src={`${API.baseURL}user/${_id}/photo?auth=${API.token}`}
                />
                {name}
              </div>
              {isRequest ? (
                <div>
                  <Button
                    type="button"
                    onClick={() => resolveRequest({ user: _id, resolution: 'decline' })}
                  >
                    <TiTimes />
                    <Translate value="Org.ManageUsers.decline" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => resolveRequest({ user: _id, resolution: 'approve' })}
                    primary
                  >
                    <TiTick />
                    <Translate value="Org.ManageUsers.approve" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => removeUser(_id)}
                >
                  <TiTrash />
                </Button>
              )}
            </User>
          ))}
        </Scroll>
      </Dialog>
    );
  }
}

Users.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    isRequest: PropTypes.bool,
    name: PropTypes.string.isRequired,
  })).isRequired,
  fetch: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  resolveRequest: PropTypes.func.isRequired,
};

export default connect(
  ({
    org: {
      users: list,
    },
  }) => ({
    list,
  }),
  {
    fetch,
    removeUser,
    resolveRequest,
  }
)(Users);
