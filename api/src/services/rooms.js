const sharp = require('sharp');
const uuid = require('uuid/v4');

class Room {
  constructor(db) {
    this.db = db;
    this.peers = [];
  }

  broadcast({ event, include, exclude }) {
    const { peers } = this;
    const encoded = JSON.stringify(event);
    peers
      .filter(({ id }) => (
        (!include || ~include.indexOf(id))
        && (!exclude || exclude.indexOf(id) === -1)
      ))
      .forEach(peer => (
        peer.send(encoded, () => {})
      ));
  }

  onClose(peer) {
    const { peers } = this;
    const index = peers.findIndex(({ id }) => (id === peer.id));
    if (~index) {
      peers.splice(index, 1);
      const { _id } = peer.user;
      this.broadcast({
        event: {
          type: 'ROOM/PEER_LEAVE',
          payload: peer.id,
        },
        exclude: peers
          .filter(({ user: { _id: id } }) => id.equals(_id))
          .map(({ id }) => (id)),
      });
    }
  }

  onOpen(peer) {
    const { db, peers } = this;
    const { _id, name } = peer.user;
    peer.id = uuid();
    this.broadcast({
      event: {
        type: 'ROOM/PEER_JOIN',
        payload: {
          _id,
          name,
          peer: peer.id,
        },
      },
      exclude: peers
        .filter(({ user: { _id: id } }) => id.equals(_id))
        .map(({ id }) => (id)),
    });
    peer.send(JSON.stringify({
      type: 'ROOM/JOIN',
      payload: {
        name: db.name,
        peers: peers
          .reduce((peers, { id, user }) => {
            if (!user._id.equals(_id)) {
              peers.push({
                _id: user._id,
                name: user.name,
                peer: id,
              });
            }
            return peers;
          }, []),
        photos: db.photos.map(({ _id, origin, photo }) => ({
          _id,
          origin,
          photo: photo.toString('base64'),
        })),
      },
    }), () => {});
    peers.push(peer);
    peer.once('close', () => this.onClose(peer));
    peer.on('message', data => this.onMessage(peer, data));
  }

  onMessage(peer, data) {
    let event;
    try {
      event = JSON.parse(data);
    } catch (e) {
      return;
    }
    switch (event.type) {
      case 'ROOM/ADD_PHOTO':
        this.onAddPhoto(peer, event.payload);
        break;
      case 'ROOM/MOVE_PHOTO':
        this.onMovePhoto(peer, event.payload);
        break;
      case 'ROOM/REMOVE_PHOTO':
        this.onRemovePhoto(peer, event.payload);
        break;
      case 'ROOM/PEER_SIGNAL':
        this.onSignal(peer, event.payload);
        break;
      default:
        break;
    }
  }

  onAddPhoto({ user: { _id: creator } }, { origin, photo: buffer }) {
    const { db } = this;
    const image = sharp(Buffer.from(buffer, 'base64'));
    image
      .rotate()
      .metadata()
      .then(({ width, height }) => {
        const target = Math.min(width > height ? width : height, 512);
        return image
          .resize(width > height ? ({
            width: target,
          }) : ({
            height: target,
          }))
          .jpeg({ quality: 85 })
          .toBuffer()
          .then((photo) => {
            db.photos.push({
              creator,
              origin: width > height ? ({
                x: origin.x - (target * 0.5),
                y: origin.y - (height * target / width * 0.5),
              }) : ({
                x: origin.x - (width * target / height * 0.5),
                y: origin.y - (target * 0.5),
              }),
              photo,
            });
            return db.save();
          });
      })
      .then(({ photos }) => {
        const { _id, origin, photo } = photos[photos.length - 1];
        this.broadcast({
          event: {
            type: 'ROOM/ADD_PHOTO',
            payload: {
              _id,
              origin,
              photo: photo.toString('base64'),
            },
          },
        });
      })
      .catch(() => {});
  }

  onMovePhoto(peer, { origin, photo }) {
    const { db } = this;
    const index = db.photos.findIndex(({ _id }) => (_id.equals(photo)));
    if (~index) {
      db.photos[index].origin.x = origin.x;
      db.photos[index].origin.y = origin.y;
      db.save().catch(() => {});
      // TODO: Use the P2P channel to broadcast this action
      this.broadcast({
        event: {
          type: 'ROOM/MOVE_PHOTO',
          payload: { origin, photo },
        },
      });
    }
  }

  onRemovePhoto(peer, { photo }) {
    const { db } = this;
    const index = db.photos.findIndex(({ _id }) => (_id.equals(photo)));
    if (~index) {
      db.photos.splice(index, 1);
      db.save().catch(() => {});
      this.broadcast({
        event: {
          type: 'ROOM/REMOVE_PHOTO',
          payload: { photo },
        },
      });
    }
  }

  onSignal({ id: from }, { peer: to, signal }) {
    const { peers } = this;
    const index = peers.findIndex(({ id }) => (id === to));
    if (~index) {
      peers[index].send(JSON.stringify({
        type: 'ROOM/PEER_SIGNAL',
        payload: {
          peer: from,
          signal,
        },
      }), () => {});
    }
  }
}

const rooms = {};
module.exports = (room) => {
  if (typeof room === 'string') {
    return rooms[room];
  }
  const { slug } = room;
  rooms[slug] = new Room(room);
  return rooms[slug];
};
