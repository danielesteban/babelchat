import React from 'react';
import Canvas from '@/components/room/canvas';
import Events from '@/components/room/events';
import Peers from '@/components/room/peers';

const Room = () => (
  <div>
    <Canvas />
    <Events />
    <Peers />
  </div>
);

export default Room;
