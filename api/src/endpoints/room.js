const { unauthorized } = require('boom');
const { body, param } = require('express-validator/check');
const { Org, OrgUser, Room } = require('../models');
const Rooms = require('../services/rooms');
const { checkValidationResult } = require('../services/errorHandler');

module.exports.create = [
  param('id')
    .isMongoId(),
  body('flag')
    .not().isEmpty()
    .isLength({ min: 2, max: 2 }),
  body('name')
    .not().isEmpty()
    .isLength({ min: 1, max: 25 })
    .trim(),
  body('peerLimit')
    .optional()
    .isInt()
    .toInt(),
  checkValidationResult,
  (req, res, next) => {
    const { flag, name, peerLimit } = req.body;
    const { id: org } = req.params;
    return OrgUser
      .isOrgAdmin({
        user: req.user._id,
        org,
      })
      .then(() => {
        const room = new Room({
          flag,
          name,
          org,
          peerLimit: peerLimit ? Math.min(Math.max(peerLimit, 2), 8) : undefined,
        });
        return room
          .save();
      })
      .then(room => (
        res.json({
          flag: room.flag,
          name: room.name,
          peerLimit: room.peerLimit,
          peers: 0,
          slug: room.slug,
        })
      ))
      .catch(next);
  },
];

module.exports.list = [
  param('id')
    .isMongoId(),
  checkValidationResult,
  (req, res, next) => {
    const { id: org } = req.params;
    // Access control
    return OrgUser
      .findOne({
        active: true,
        user: req.user._id,
        org,
      })
      .then((isOrgUser) => {
        if (!isOrgUser) {
          throw unauthorized();
        }
        // Fetch the room list from the db
        return Room
          .find({ org })
          .select('-_id flag name peerLimit slug')
          .then(rooms => res.json(
            rooms.map(({ _doc }) => {
              const room = Rooms(`${org}::${_doc.slug}`);
              return {
                ..._doc,
                // Append current peer count
                // from the room service
                peers: room ? room.peers.length : 0,
              };
            })
          ));
      })
      .catch(next);
  },
];

module.exports.join = (peer, req) => {
  // Monitor if the peer closes the connection
  // While we are loading the room
  let hasClosed = false;
  const onClose = () => {
    hasClosed = true;
  };
  peer.once('close', onClose);

  const { id: org, slug } = req.params;
  // Fetch org
  Org
    .findOne({ slug: org })
    .select('_id')
    .then((org) => {
      if (!org) {
        throw new Error('NOT_FOUND');
      }
      // Access control
      return OrgUser
        .findOne({
          active: true,
          user: peer.user._id,
          org: org._id,
        })
        .then((isOrgUser) => {
          if (!isOrgUser) {
            throw new Error('UNAUTHORIZED');
          }
          // Load the room
          return new Promise((resolve) => {
            // Check if the room is already loaded
            const roomKey = `${org._id}::${slug}`;
            const room = Rooms(roomKey);
            if (room) {
              resolve(room);
              return;
            }
            // Room it's not loaded
            // Fetch it from the db
            resolve(
              Room
                .findOne({ org: org._id, slug })
                .then((room) => {
                  if (!room) {
                    // Room doesn't exists
                    throw new Error('NOT_FOUND');
                  }
                  room.key = roomKey;
                  // Load room
                  return Rooms(room);
                })
            );
          });
        });
    })
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

module.exports.remove = [
  param('id')
    .isMongoId(),
  param('slug')
    .not().isEmpty()
    .isLowercase()
    .trim(),
  checkValidationResult,
  (req, res, next) => {
    const { id: org, slug } = req.params;
    return OrgUser
      .isOrgAdmin({
        user: req.user._id,
        org,
      })
      .then(() => (
        Room
          .deleteOne({ org, slug })
          .then(() => (
            Rooms.remove(`${org}::${slug}`)
          ))
      ))
      .then(() => (
        res.status(200).end()
      ))
      .catch(next);
  },
];
