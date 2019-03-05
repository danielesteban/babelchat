const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');

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
  public: { type: Boolean, default: true },
  slug: ShortId,
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  }],
}, { timestamps: true });

RoomSchema.index({ slug: 1, org: 1 }, { unique: true });

module.exports = mongoose.model('Room', RoomSchema);
