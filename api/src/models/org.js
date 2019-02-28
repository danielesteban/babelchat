const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const OrgSchema = new mongoose.Schema({
  cover: Buffer,
  logo: Buffer,
  name: { type: String, required: true },
}, { timestamps: true });

OrgSchema.plugin(URLSlugs('name'));

module.exports = mongoose.model('Org', OrgSchema);
