const multer = require('multer');
const nocache = require('nocache');
const org = require('./org');
const room = require('./room');
const user = require('./user');
const {
  authenticate,
  requireAuth,
  requireOrgUser,
  requirePeerAuth,
} = require('../services/passport');

const preventCache = nocache();
const upload = multer({
  storage: multer.memoryStorage(),
});

module.exports = (api) => {
  /**
   * @swagger
   * /orgs:
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
    '/orgs',
    preventCache,
    requireAuth,
    org.create
  );

  /**
   * @swagger
   * /org/{slug}:
   *   get:
   *     description: Get org public data
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
   *       404:
   *         description: Org not found
   */
  api.get(
    '/org/:slug',
    preventCache,
    authenticate,
    org.get
  );

  /**
   * @swagger
   * /org/{org}:
   *   post:
   *     description: Update org data
   *     tags: [Org]
   *     parameters:
   *       - name: org
   *         in: path
   *         description: Org id
   *         required: true
   *         schema:
   *           type: string
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
   *         description: Successfully removed
   *       401:
   *         description: Invalid/expired session token
   *       404:
   *         description: Org not found
   */
  api.post(
    '/org/:org',
    preventCache,
    requireAuth,
    requireOrgUser({ admin: true }),
    org.update
  );

  /**
   * @swagger
   * /org/{org}:
   *   delete:
   *     description: Remove an organization
   *     tags: [Org]
   *     parameters:
   *       - name: org
   *         in: path
   *         description: Org id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successfully removed
   *       401:
   *         description: Invalid/expired session token
   */
  api.delete(
    '/org/:org',
    preventCache,
    requireAuth,
    requireOrgUser({ admin: true }),
    org.remove
  );

  /**
   * @swagger
   * /org/{org}/{image}:
   *   get:
   *     description: Get org image
   *     tags: [Org]
   *     security: []
   *     parameters:
   *       - name: org
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
    '/org/:org/:image(cover|logo)',
    org.getImage
  );

  /**
   * @swagger
   * /org/{org}/{image}:
   *   post:
   *     description: Update org image
   *     tags: [Org]
   *     parameters:
   *       - name: org
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
  api.post(
    '/org/:org/:image(cover|logo)',
    preventCache,
    requireAuth,
    requireOrgUser({ admin: true }),
    upload.single('image'),
    org.updateImage
  );

  /**
   * @swagger
   * /org/{org}/users:
   *   put:
   *     description: Request org access
   *     tags: [OrgUser]
   *     parameters:
   *       - name: org
   *         in: path
   *         description: Org id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successfully requested
   *       404:
   *         description: Org not found
   *       401:
   *         description: Invalid/expired session token
   */
  api.put(
    '/org/:org/users',
    preventCache,
    requireAuth,
    org.requestAccess
  );

  /**
   * @swagger
   * /org/{org}/users:
   *   get:
   *     description: Get org users
   *     tags: [OrgUser]
   *     parameters:
   *       - name: org
   *         in: path
   *         description: Org id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Org users
   *       401:
   *         description: Invalid/expired session token
   */
  api.get(
    '/org/:org/users',
    preventCache,
    requireAuth,
    requireOrgUser({ admin: true }),
    org.getUsers
  );

  /**
   * @swagger
   * /org/{org}/user/{user}/{resolution}:
   *   post:
   *     description: Resolve user access request
   *     tags: [OrgUser]
   *     parameters:
   *       - name: org
   *         in: path
   *         description: Org id
   *         required: true
   *         schema:
   *           type: string
   *       - name: user
   *         in: path
   *         description: User id
   *         required: true
   *         schema:
   *           type: string
   *       - name: resolution
   *         in: path
   *         description: approve or decline
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successfully resolved
   *       404:
   *         description: User not found
   *       401:
   *         description: Invalid/expired session token
   */
  api.post(
    '/org/:org/user/:user/:resolution(approve|decline)',
    preventCache,
    requireAuth,
    requireOrgUser({ admin: true }),
    org.resolveAccessRequest
  );

  /**
   * @swagger
   * /org/{org}/user/{user}:
   *   delete:
   *     description: Remove org user
   *     tags: [OrgUser]
   *     parameters:
   *       - name: org
   *         in: path
   *         description: Org id
   *         required: true
   *         schema:
   *           type: string
   *       - name: user
   *         in: path
   *         description: User id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successfully removed
   *       404:
   *         description: User not found
   *       401:
   *         description: Invalid/expired session token
   */
  api.delete(
    '/org/:org/user/:user/',
    preventCache,
    requireAuth,
    requireOrgUser({ admin: true }),
    org.removeUser
  );

  /**
   * @swagger
   * /org/{org}/rooms:
   *   put:
   *     description: Create a room
   *     tags: [Room]
   *     parameters:
   *       - name: org
   *         in: path
   *         description: Org id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              flag:
   *                type: string
   *                description: Room flag
   *              name:
   *                type: string
   *                description: Room name
   *              peerLimit:
   *                type: string
   *                description: Room peer limit
   *     responses:
   *       200:
   *         description: New org slug
   *       401:
   *         description: Invalid/expired session token
   */
  api.put(
    '/org/:org/rooms',
    preventCache,
    requireAuth,
    requireOrgUser({ admin: true }),
    room.create
  );

  /**
   * @swagger
   * /org/{org}/rooms:
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
    '/org/:org/rooms',
    preventCache,
    requireAuth,
    requireOrgUser(),
    room.list
  );

  /**
   * @swagger
   * /org/{org}/room/{slug}:
   *   get:
   *     description: Join a room (This is a WebSockets endpoint)
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
   *         description: Successfully joined
   *       401:
   *         description: Invalid/expired session token
   */
  api.ws(
    '/org/:org/room/:slug',
    requirePeerAuth,
    room.join
  );

  /**
   * @swagger
   * /org/{org}/room/{slug}:
   *   delete:
   *     description: Remove a room
   *     tags: [Room]
   *     parameters:
   *       - name: org
   *         in: path
   *         description: Org id
   *         required: true
   *         schema:
   *           type: string
   *       - name: id
   *         in: path
   *         description: Room slug
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successfully removed
   *       401:
   *         description: Invalid/expired session token
   */
  api.delete(
    '/org/:org/room/:slug',
    preventCache,
    requireAuth,
    requireOrgUser({ admin: true }),
    room.remove
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
   * /user/google:
   *   get:
   *     description: Get redirected to the google auth popup
   *     tags: [User]
   *     security: []
   */
  api.get(
    '/user/google',
    preventCache,
    user.loginWithGoogle
  );

  /**
   * @swagger
   * /user/google/authenticate:
   *   get:
   *     description: Google auth callback endpoint
   *     tags: [User]
   *     security: []
   */
  api.get(
    '/user/google/authenticate',
    preventCache,
    user.authenticateWithGoogle
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

  /**
   * @swagger
   * /user/{user}/photo:
   *   get:
   *     description: Get user photo
   *     tags: [User]
   *     parameters:
   *       - name: user
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
    '/user/:user/photo',
    requireAuth,
    user.getPhoto
  );
};
