const mongoose = require('mongoose');

const OrgUserSchema = new mongoose.Schema({
  active: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  org: { type: mongoose.Schema.Types.ObjectId, ref: 'Org' },
}, { timestamps: true });

OrgUserSchema.index({ user: true, org: true, unique: true });

module.exports = mongoose.model('OrgUser', OrgUserSchema);
