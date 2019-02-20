import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Canvas from '@/components/room/canvas';
import Events from '@/components/room/events';
import Peers from '@/components/room/peers';

const Room = ({ hasJoined, slug }) => (
  <div>
    {hasJoined ? (
      <Canvas />
    ) : null}
    <Events slug={slug} />
    <Peers />
  </div>
);

Room.propTypes = {
  hasJoined: PropTypes.bool.isRequired,
  slug: PropTypes.string.isRequired,
};

export default connect(
  ({
    room: { hasJoined },
  }, {
    match: { params: { slug } },
  }) => ({
    hasJoined,
    slug,
  })
)(Room);
