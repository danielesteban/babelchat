const { Room } = require('../models');
const Rooms = require('../services/rooms');

module.exports.list = (req, res, next) => {
  // Fetch the room list from the db
  Room
    .find()
    .select('-_id flag name peerLimit slug')
    .then(rooms => res.json(
      rooms.map(({ _doc }) => {
        const room = Rooms(_doc.slug);
        return {
          ..._doc,
          // Append current peer count
          // from the room service
          peers: room ? room.peers.length : 0,
        };
      })
    ))
    .catch(next);
};

module.exports.join = (peer, req) => {
  // Monitor if the peer closes the connection
  // While we are loading the room
  let hasClosed = false;
  const onClose = () => {
    hasClosed = true;
  };
  peer.once('close', onClose);

  // Load the room
  (new Promise((resolve) => {
    // Check if the room is already loaded
    const room = Rooms(req.params.slug);
    if (room) {
      resolve(room);
      return;
    }
    // Room it's not loaded
    // Fetch it from the db
    resolve(
      Room
        .findOne({ slug: req.params.slug })
        .then((room) => {
          if (!room) {
            // Room doesn't exists
            throw new Error('NOT_FOUND');
          }
          // Load room
          return Rooms(room);
        })
    );
  }))
    .then((room) => {
      // Check if the room is already full
      if (room.peers.length >= room.db.peerLimit) {
        throw new Error('FULL_ROOM');
      }
      // Check if the peer is still connected
      if (!hasClosed) {
        // Stop monitoring the connection
        peer.off('close', onClose);
        // Delegate the peer connection to the room service
        room.onOpen(peer);
      }
    })
    .catch(err => (
      // Send back error to peer
      peer.send(JSON.stringify({
        type: 'ROOM/ERROR',
        payload: err.message,
      }), () => (
        // Close the connection
        peer.close(1000)
      ))
    ));
};
