import PropTypes from 'prop-types';
import React from 'react';
import Canvas from '@/components/room/canvas';
import Events from '@/components/room/events';
import Peers from '@/components/room/peers';

const Room = ({ match: { params: { slug } } }) => (
  <div>
    <Canvas />
    <Events slug={slug} />
    <Peers />
  </div>
);

Room.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Room;
