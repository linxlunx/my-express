require('dotenv').config();

var assert = require('assert');
const request = require('supertest');

describe('Auth route', function () {
    let app;

    before('Mock app', async function () {
        // init app
        app = require('../../app');
    });

    describe('Test Auth Login', function () {
        it('Should login success', async function () {
            const req = {
                email: 'superadmin@test.com',
                password: 'test1234',
            }
            let res = await postAuthLoginSuccess(req);
            assert.equal(res, 200);
        })

        it('Should login fail', async function () {
            const req = {
                email: 'test@test.com',
                password: 'test1234',
            }
            let res = await postAuthLoginFailed(req);
            assert.equal(res, 401);
        })


        async function postAuthLoginSuccess(req) {
            const { status } = await request(app).post('/auth/login').send(req)
            return status
        }

        async function postAuthLoginFailed(req) {
            const { status } = await request(app).post('/auth/login').send(req)
            return status
        }
    });
})
