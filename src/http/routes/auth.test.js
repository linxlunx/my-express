require('dotenv').config();

const request = require('supertest');
const knex = require('knex');
const knexConfig = require('../../../knexfile');
const migrator = knex(knexConfig.development);
const sqlite = require('better-sqlite3');
const fs = require('fs');


describe('Auth route', function () {
    let app;

    const dbFile = 'dev.sqlite3'

    before('Mock db connection, load app, and migrate data', async function () {
        // mock db
        const db = new sqlite(dbFile);
        db.query = (text, params) => db.prepare(text).all(params);

        // init app
        app = require('../../app');

        // migrate and seed
        await migrator.migrate.latest();
        await migrator.seed.run();
    });

    after('Drop sqlite3 table', async function () {
        try {
            fs.unlinkSync(dbFile);
        } catch (err) {
            console.error(err);
        }
    })

    describe('Test Auth Login', function () {
        it('Should login success', async function () {
            const req = {
                email: 'superadmin@test.com',
                password: 'test1234',
            }
            await postAuthLoginSuccess(req);
        })

        it('Should login fail', async function () {
            const req = {
                email: 'test@test.com',
                password: 'test1234',
            }
            await postAuthLoginFailed(req);
        })


        async function postAuthLoginSuccess(req, status = 200) {
            const { body } = await request(app).post('/auth/login').send(req).expect(status)
            return body
        }

        async function postAuthLoginFailed(req, status = 401) {
            const { body } = await request(app).post('/auth/login').send(req).expect(status)
            return body
        }
    });
})
