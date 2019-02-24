const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const config = require('../config');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  flag: { type: String, required: true },
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
          name,
          flag,
        }) => {
          const room = new Room({ name, flag });
          return room.save();
        })
      );
    });
  },
};

module.exports = mongoose.model('Room', RoomSchema);
