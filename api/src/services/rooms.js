const uuid = require('uuid/v4');

class Room {
  constructor(meta) {
    this.meta = meta;
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
    const { meta, peers } = this;
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
        meta,
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
      case 'ROOM/PEER_SIGNAL':
        this.onSignal(peer, event.payload);
        break;
      default:
        break;
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
