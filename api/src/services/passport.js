const { unauthorized } = require('boom');
const { param } = require('express-validator/check');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config');
const { OrgUser, User } = require('../models');
const { checkValidationResult } = require('../services/errorHandler');

const authenticate = (req, state, next) => {
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
    next();
    return;
  }
  User
    .fromToken(token)
    .then((user) => {
      if (user) {
        state.user = user;
      }
      next();
    })
    .catch(next);
};

module.exports.authenticate = (req, res, next) => (
  authenticate(req, req, next)
);

module.exports.requireAuth = (req, res, next) => (
  authenticate(req, req, (err) => {
    if (err || !req.user) {
      next(unauthorized(err));
      return;
    }
    next();
  })
);

module.exports.requireOrgUser = ({
  admin = false,
  active = true,
} = {}) => ([
  param('org')
    .isMongoId(),
  checkValidationResult,
  (req, res, next) => {
    const { org } = req.params;
    OrgUser
      .findOne({
        ...(admin ? { admin: true } : {}),
        ...(active ? { active: true } : {}),
        user: req.user._id,
        org,
      })
      .select('-_id active admin')
      .then((isOrgUser) => {
        if (!isOrgUser) {
          throw unauthorized();
        }
        req.org = org;
        if (isOrgUser.active) {
          req.user.isOrgUser = true;
        }
        if (isOrgUser.admin) {
          req.user.isOrgAdmin = true;
        }
        next();
      })
      .catch(next);
  },
]);

module.exports.requirePeerAuth = (peer, req, next) => (
  authenticate(req, peer, (err) => {
    if (err || !peer.user) {
      // Send back error to peer
      peer.send(JSON.stringify({
        type: 'ROOM/ERROR',
        payload: 'UNAUTHORIZED',
      }), () => (
        // Close the connection
        peer.close(1000)
      ));
      return;
    }
    next();
  })
);

module.exports.setup = () => {
  // Setup GoogleStrategy
  passport.use(new GoogleStrategy(config.googleAuth, (accessToken, refreshToken, profile, done) => {
    const {
      displayName: name,
      emails,
      photos,
    } = profile;
    const [email] = emails
      .map(({ value }) => (value));
    const [photo] = photos
      .map(({ value }) => (value));
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
