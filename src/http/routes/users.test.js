require('dotenv').config();
var assert = require('assert');
const request = require('supertest');
const token = require('../../helper/token');

superadminToken = token.generateToken({ id: 1, email: 'superadmin@test.com' }).accessToken;
userToken = token.generateToken({ id: 3, email: 'user@test.com' }).accessToken;

describe('Users Route', function () {
    let app;

    before('Mock app', async function () {
        // init app
        app = require('../../app');
    });

    describe('Test Users List', function () {
        it('Should unauthorized get user list', async () => {
            let status = await userListUnauthorized();
            assert.equal(status, 401);
        });

        it('Should success get user list', async () => {
            let status = await userListSuccess();
            assert.equal(status, 200);
        });

        it('Should unauthorized get user list has no permission', async () => {
            let status = await userListUnauthorizedHasNoPermission();
            assert.equal(status, 403);
        });

        async function userListUnauthorized() {
            const { status } = await request(app).get('/users');
            return status;
        }

        async function userListSuccess() {
            const { status } = await request(app).get('/users').set('Authorization', `Bearer ${superadminToken}`);
            return status;
        }

        async function userListUnauthorizedHasNoPermission() {
            const { status } = await request(app).get('/users').set('Authorization', `Bearer ${userToken}`);
            return status;
        }

    });
});
