const nocache = require('nocache');
const room = require('./room');
const user = require('./user');
const {
  requireAuth,
  requireSocketAuth,
} = require('../services/passport');

const preventCache = nocache();

module.exports = (api) => {
  /**
   * @swagger
   * /rooms:
   *   get:
   *     description: Get the rooms list
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Rooms list
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                     description: Room name
   *                   slug:
   *                     type: string
   *                     description: Room slug
   *                   peers:
   *                     type: number
   *                     description: Room peer count
   *       401:
   *         description: Invalid/expired session token
   */
  api.get(
    '/rooms',
    preventCache,
    requireAuth,
    room.list
  );

  api.ws(
    '/room/:slug',
    requireSocketAuth,
    room.join
  );

  /**
   * @swagger
   * /user:
   *   get:
   *     description: Refresh a user session
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Refreshed session
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 profile:
   *                   type: object
   *                   description: User's profile
   *                 token:
   *                   type: string
   *                   description: Refreshed user token
   *       401:
   *         description: Invalid/expired session token
   */
  api.get(
    '/user',
    preventCache,
    requireAuth,
    user.refreshSession
  );

  /**
   * @swagger
   * /user/{id}/photo:
   *   get:
   *     description: Get user photo
   *     tags: [User]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: User id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User photo
   *       401:
   *         description: Invalid/expired session token
   *       404:
   *         description: User not found
   */
  api.get(
    '/user/:id/photo',
    requireAuth,
    user.getPhoto
  );

  api.get(
    '/user/google',
    preventCache,
    user.loginWithGoogle
  );

  api.get(
    '/user/google/authenticate',
    preventCache,
    user.authenticateWithGoogle
  );
};
