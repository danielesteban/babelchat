import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiTrash } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchRooms as fetch, removeRoom } from '@/actions/org';

const Listing = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > a {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    font-size: 1.5em;
    padding: 1rem;
    color: #000;
    text-decoration: none;
    transition: color ease-out .15s, background-color ease-out .15s;
    will-change: color, background-color;
    &:nth-child(even) {
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
  &.admin > a {
    > svg {
      display: none;
    }
    &:hover {
      > span {
        display: none;
      }
      > svg {
        display: block;
      }
    }
  }
`;

class Rooms extends PureComponent {
  componentDidMount() {
    const { fetch } = this.props;
    fetch();
  }

  onRemove(e, slug) {
    const { removeRoom } = this.props;
    e.preventDefault();
    removeRoom(slug);
  }

  render() {
    const { isAdmin, list, org } = this.props;
    return (
      <Listing className={isAdmin ? 'admin' : null}>
        {list.map(({
          flag,
          name,
          peerLimit,
          peers,
          slug,
        }) => (
          <Link
            key={slug}
            to={{ pathname: `/${org}/${slug}` }}
            className={peers >= peerLimit ? 'full' : ''}
          >
            <strong>
              <img
                src={`${__COUNTRY_FLAGS_CDN__}${flag}.svg`}
              />
              {name}
            </strong>
            <Translate
              count={peers}
              limit={peerLimit}
              value="Rooms.peers"
            />
            {isAdmin ? (
              <TiTrash
                onClick={e => this.onRemove(e, slug)}
              />
            ) : null}
          </Link>
        ))}
      </Listing>
    );
  }
}

Rooms.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    flag: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    peerLimit: PropTypes.number.isRequired,
    peers: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
  })).isRequired,
  org: PropTypes.string.isRequired,
  fetch: PropTypes.func.isRequired,
  removeRoom: PropTypes.func.isRequired,
};

export default connect(
  ({
    org: {
      isAdmin,
      rooms: list,
    },
  }) => ({
    isAdmin,
    list,
  }),
  {
    fetch,
    removeRoom,
  }
)(Rooms);
