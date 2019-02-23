const { Room } = require('../models');
const Rooms = require('../services/rooms');

module.exports.list = (req, res, next) => {
  Room
    .find()
    .select('-_id name slug')
    .then(rooms => res.json(
      rooms.map(({ _doc }) => {
        const room = Rooms(_doc.slug);
        return {
          ..._doc,
          peers: room ? room.peers.length : 0,
        };
      })
    ))
    .catch(next);
};

module.exports.join = (peer, req) => {
  const room = Rooms(req.params.slug);
  if (room) {
    room.onOpen(peer);
    return;
  }
  Room
    .findOne({ slug: req.params.slug })
    .then((room) => {
      if (!room) {
        peer.send(JSON.stringify({
          type: 'ROOM/NOT_FOUND',
        }), () => {});
        peer.close(1000);
        return;
      }
      Rooms(room).onOpen(peer);
    })
    .catch(() => {
      peer.send(JSON.stringify({
        type: 'ROOM/ERROR',
      }), () => {});
      peer.close(1000);
    });
};
