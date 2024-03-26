var express = require('express');
const JsonResponse = require('../../helper/response');
const { isLoggedin, hasPermissionTo } = require('../middleware/auth');
const { userPaginate, userGetByID, userCreate, userGetByEmail, userUpdate } = require('../../services/users');
const { userListQuery, userCreateBody } = require('../params/users');
const { validate } = require('../params/validator');
var router = express.Router();

// logged in middleware for accessing this route group
router.use(isLoggedin)

/**
 * @openapi
 * /users/me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: My Detail
 *     responses:
 *       200:
 *         description: User Detail
*/
router.get('/me', function (req, res, next) {
  return JsonResponse(res, 200, 'User data', req.user, {});
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: Get User By ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         require: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: User Detail
*/
router.get("/:id", hasPermissionTo("users-read"), async function (req, res, next) {
  try {
    let user = await userGetByID(req.params.id)
    return JsonResponse(res, 200, 'User Detail', user, {});
  } catch (err) {
    return JsonResponse(res, 404, '', {}, {});
  }

})

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: Update User
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         require: true
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *               fullname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated user
*/
router.put("/:id", hasPermissionTo("users-update"), async function (req, res, next) {
  if (req.body.password != "") {
    if (req.body.password != req.body.confirm_password) {
      return JsonResponse(res, 409, 'Password not match', {}, {});
    }
  }

  try {
    let user = await userGetByID(req.params.id)
    try {
      let exist = await userGetByEmail(req.body.email)
      if (exist.id != user.id) {
        return JsonResponse(res, 409, 'Email already exist', {}, {});
      }
    } catch (err) { }
    let updated = await userUpdate(req.params.id, req.body.username, req.body.email, req.body.password, req.body.fullname);
    return JsonResponse(res, 200, 'Successfully updated user', updated, {})
  } catch (err) {
    console.log(err)
    return JsonResponse(res, 404, '', {}, {});
  }
})

/**
 * @openapi
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: User List
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page
 *         schema:
 *           type: integer
 *           format: int64
 *       - name: limit
 *         in: query
 *         description: Limit
 *         schema:
 *           type: integer
 *           format: int64
 *       - name: q
 *         in: query
 *         description: Search Query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User Detail
*/
router.get("", hasPermissionTo("users-read"), userListQuery(), validate, async function (req, res, next) {
  let users = await userPaginate(req.query.page, req.query.limit, req.query.q);
  return JsonResponse(res, 200, 'User list', users.data, users.meta);
});

/**
 * @openapi
 * /users:
 *   post:
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: Create User
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *               fullname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully created user
*/
router.post("", hasPermissionTo("users-create"), userCreateBody(), validate, async function (req, res, next) {
  if (req.body.password != req.body.confirm_password) {
    return JsonResponse(res, 409, 'Password not match', {}, {});
  }

  try {
    let exist = await userGetByEmail(req.body.email)
    if (exist) {
      return JsonResponse(res, 409, 'Email already exist', {}, {});
    }
  } catch (err) {
    let user = await userCreate(req.body.username, req.body.email, req.body.password, req.body.fullname);
    return JsonResponse(res, 200, 'User Created', user, {});
  }
});


module.exports = router;
