const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const config = require('../config');

const RoomSchema = new mongoose.Schema({
  flag: { type: String, required: true },
  name: { type: String, required: true },
  peerLimit: { type: Number, default: 16 },
  photos: [{
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    origin: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    photo: { type: Buffer, required: true },
  }],
}, { timestamps: true });

RoomSchema.plugin(URLSlugs('name'));

RoomSchema.statics = {
  populate() {
    const Room = this;
    Room.find().countDocuments().then((count) => {
      if (count > 0) {
        return;
      }
      Promise.all(
        config.defaultRooms.map(({
          flag,
          name,
          peerLimit,
        }) => {
          const room = new Room({ flag, name, peerLimit });
          return room.save();
        })
      );
    });
  },
};

module.exports = mongoose.model('Room', RoomSchema);
