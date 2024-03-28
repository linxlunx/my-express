var express = require('express');
const loginValidator = require('../params/auth');
const { validate } = require('../params/validator');
var router = express.Router();
const { login } = require('../../services/auth');
const JsonResponse = require('../../helper/response');
const { generateToken } = require('../../helper/token');

/**
 * @openapi
 * /auth/login:
 *   post:
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     tags:
 *       - Auth
 *     summary: Login user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
*/
router.post('/login', loginValidator(), validate, async (req, res, next) => {
    try {
        const user = await login(req.body.email, req.body.password);
        const token = generateToken({ id: user.id, email: user.email });
        return JsonResponse(res, 200, 'Login success', token, {});
    } catch (err) {
        return JsonResponse(res, 401, err.message, {}, {});
    }
});

module.exports = router;