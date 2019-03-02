import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiTick, TiTimes } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import styled from 'styled-components';
import {
  fetchUsers as fetch,
  hideUsers as hide,
  resolveRequest,
} from '@/actions/org';
import Button from '@/components/ui/button';
import Dialog from '@/components/ui/dialog';
import API from '@/services/api';

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  > div {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;    
    &:last-child {
      margin-bottom: 0;
    }
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
`;

class Users extends PureComponent {
  componentDidMount() {
    const { fetch } = this.props;
    fetch();
  }

  render() {
    const {
      list,
      isShowingUsers,
      hide,
      resolveRequest,
    } = this.props;
    if (!isShowingUsers) {
      return null;
    }
    return (
      <Dialog
        title="Org.Nav.manageUsers"
        width="512px"
        hide={hide}
      >
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
                  onClick={() => resolveRequest({ id: _id, resolution: 'decline' })}
                >
                  <TiTimes />
                  <Translate value="Org.Request.decline" />
                </Button>
                <Button
                  type="button"
                  onClick={() => resolveRequest({ id: _id, resolution: 'approve' })}
                  primary
                >
                  <TiTick />
                  <Translate value="Org.Request.approve" />
                </Button>
              </div>
            ) : null}
          </User>
        ))}
      </Dialog>
    );
  }
}

Users.propTypes = {
  isShowingUsers: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    isRequest: PropTypes.bool,
    name: PropTypes.string.isRequired,
  })).isRequired,
  hide: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired,
  resolveRequest: PropTypes.func.isRequired,
};

export default connect(
  ({
    org: {
      isShowingUsers,
      users: list,
    },
  }) => ({
    isShowingUsers,
    list,
  }),
  {
    hide,
    fetch,
    resolveRequest,
  }
)(Users);
