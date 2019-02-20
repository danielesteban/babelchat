const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const config = require('../config');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
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
        }) => {
          const room = new Room({ name });
          return room.save();
        })
      );
    });
  },
};

module.exports = mongoose.model('Room', RoomSchema);
