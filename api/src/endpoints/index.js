const multer = require('multer');
const nocache = require('nocache');
const org = require('./org');
const room = require('./room');
const user = require('./user');
const {
  authenticate,
  requireAuth,
  requirePeerAuth,
} = require('../services/passport');

const preventCache = nocache();
const upload = multer({
  storage: multer.memoryStorage(),
});

module.exports = (api) => {
  /**
   * @swagger
   * /org:
   *   put:
   *     description: Create an organization
   *     tags: [Org]
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *                description: Org name
   *     responses:
   *       200:
   *         description: New org slug
   *       401:
   *         description: Invalid/expired session token
   */
  api.put(
    '/org',
    preventCache,
    requireAuth,
    org.create
  );

  /**
   * @swagger
   * /org/{slug}:
   *   get:
   *     description: Get an organization public data
   *     tags: [Org]
   *     security: []
   *     parameters:
   *       - name: slug
   *         in: path
   *         description: Org slug
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Org data
   *       401:
   *         description: Invalid/expired session token
   */
  api.get(
    '/org/:slug',
    preventCache,
    authenticate,
    org.get
  );

  /**
   * @swagger
   * /org/{id}/{image}:
   *   get:
   *     description: Get org image
   *     tags: [Org]
   *     security: []
   *     parameters:
   *       - name: id
   *         in: path
   *         description: Org id
   *         required: true
   *         schema:
   *           type: string
   *       - name: image
   *         in: path
   *         description: cover or logo
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Org image
   *       404:
   *         description: Org image not found
   */
  api.get(
    '/org/:id/:image',
    org.getImage
  );

  /**
   * @swagger
   * /org/{id}/{image}:
   *   put:
   *     description: Update org image
   *     tags: [Org]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: Org id
   *         required: true
   *         schema:
   *           type: string
   *       - name: image
   *         in: path
   *         description: cover or logo
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Successfully updated
   *       401:
   *         description: Invalid/expired session token
   */
  api.put(
    '/org/:id/:image',
    preventCache,
    requireAuth,
    upload.single('image'),
    org.updateImage
  );

  /**
   * @swagger
   * /rooms/{org}:
   *   get:
   *     description: Get an org's room list
   *     tags: [Room]
   *     parameters:
   *       - name: org
   *         in: path
   *         description: Org id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Org room list
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
    '/rooms/:org',
    preventCache,
    requireAuth,
    room.list
  );

  // Room socket
  api.ws(
    '/room/:org/:slug',
    requirePeerAuth,
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

  /**
   * @swagger
   * /user/orgs:
   *   get:
   *     description: List user orgs
   *     tags: [User]
   *     responses:
   *       200:
   *         description: User orgs list
   *       401:
   *         description: Invalid/expired session token
   */
  api.get(
    '/user/orgs',
    preventCache,
    requireAuth,
    user.listOrgs
  );

  // Google auth popup
  api.get(
    '/user/google',
    preventCache,
    user.loginWithGoogle
  );

  // Google auth callback
  api.get(
    '/user/google/authenticate',
    preventCache,
    user.authenticateWithGoogle
  );
};
