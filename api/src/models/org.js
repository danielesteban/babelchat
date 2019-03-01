const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const sharp = require('sharp');

const OrgSchema = new mongoose.Schema({
  cover: Buffer,
  logo: Buffer,
  name: { type: String, required: true },
}, { timestamps: true });

OrgSchema.plugin(URLSlugs('name'));

OrgSchema.pre('save', function onSave(next) {
  const org = this;
  const promises = [];
  if (org.isModified('cover')) {
    promises.push(
      sharp(org.cover)
        .rotate()
        .resize(900, 300)
        .jpeg({ quality: 90 })
        .toBuffer()
        .then((cover) => {
          org.cover = cover;
        })
    );
  }
  if (org.isModified('logo')) {
    promises.push(
      sharp(org.logo)
        .rotate()
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toBuffer()
        .then((logo) => {
          org.logo = logo;
        })
    );
  }
  if (!promises.length) {
    return next();
  }
  return Promise
    .all(promises)
    .then(() => next())
    .catch(next);
});

module.exports = mongoose.model('Org', OrgSchema);
