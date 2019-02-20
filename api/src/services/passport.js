const { unauthorized } = require('boom');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('../config');
const { User } = require('../models');

module.exports.requireAuth = (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    const [type, value] = req.headers.authorization.split(' ');
    if (type === 'Bearer') {
      token = value;
    }
  } else if (req.headers['sec-websocket-protocol']) {
    token = req.headers['sec-websocket-protocol'];
  } else if (req.query.auth) {
    token = req.query.auth;
  }
  if (!token) {
    throw unauthorized();
  }
  User
    .fromToken(token)
    .then((user) => {
      if (!user) {
        throw unauthorized();
      }
      req.user = user;
      next();
    })
    .catch(err => next(unauthorized(err)));
};

module.exports.requireSocketAuth = (ws, req, next) => {
  let token;
  if (req.headers['sec-websocket-protocol']) {
    token = req.headers['sec-websocket-protocol'];
  }
  if (!token) {
    ws.close();
    return;
  }
  User
    .fromToken(token)
    .then((user) => {
      if (!user) {
        ws.close();
        return;
      }
      ws.user = user;
      next();
    })
    .catch(() => ws.close());
};

module.exports.setup = () => {
  // Setup GoogleStrategy
  passport.use(new GoogleStrategy(config.googleAuth, (accessToken, refreshToken, profile, done) => {
    const {
      displayName: name,
      emails,
      photos,
    } = profile;
    const [email] = emails
      .filter(({ type }) => (type === 'account'))
      .map(({ value }) => (value));
    const [photo] = photos
      .map(({ value }) => (value.replace(/sz=50/, 'sz=100')));
    User
      .findOrCreate(
        { email },
        {
          email,
          name,
          photo,
        }
      )
      .then(user => done(null, user))
      .catch(done);
  }));
};
