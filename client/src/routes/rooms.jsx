import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetch } from '@/actions/rooms';

const Listing = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 512px;
  margin: 0 auto;
  background: #fff;
  > a {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    font-size: 1.5em;
    padding: 0.5rem 1rem;
    color: #000;
    text-decoration: none;
    &:hover {
      background: #bbb;
    }
  }
  > h1 {
    box-sizing: border-box;
    width: 100%;
    margin: 0 0 1rem;
    padding: 1rem;
    border-bottom: 1px solid #aaa;
  }
`;

class Rooms extends PureComponent {
  componentDidMount() {
    const { fetch } = this.props;
    fetch();
  }

  render() {
    const { list } = this.props;
    return (
      <Listing>
        <h1>Rooms</h1>
        {list.map(({ name, peers, slug }) => (
          <Link
            key={slug}
            to={{ pathname: `/${slug}` }}
          >
            <strong>
              {name}
            </strong>
            <Translate
              count={peers}
              value="Rooms.peers"
            />
          </Link>
        ))}
      </Listing>
    );
  }
}

Rooms.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    peers: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
  })).isRequired,
  fetch: PropTypes.func.isRequired,
};

export default connect(
  ({
    rooms: { list },
  }) => ({
    list,
  }),
  {
    fetch,
  }
)(Rooms);
