const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const RoomSchema = new mongoose.Schema({
  flag: { type: String, required: true },
  name: { type: String, required: true },
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    index: true,
    required: true,
  },
  peerLimit: { type: Number, default: 8 },
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

RoomSchema.plugin(URLSlugs('name', { index: false, indexUnique: false }));
RoomSchema.index({ slug: true, org: true, unique: true });

module.exports = mongoose.model('Room', RoomSchema);
