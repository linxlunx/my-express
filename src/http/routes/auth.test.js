require('dotenv').config();

const { Pool } = require('pg');
const request = require('supertest')
const db = require('../../db');
const knex = require('knex')
const knexConfig = require('../../../knexfile');
const migrator = knex(knexConfig.staging)

describe('Auth route', function () {
    let app;

    before('Mock db connection and load app', async function () {
        const pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME + "_staging",
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });

        db.query = (text, params) => pool.query(text, params)

        app = require('../../app');
    });

    beforeEach('Create temporary tables', async function () {
        await migrator.migrate.latest();
        await migrator.seed.run();
    })

    afterEach('Drop temporary tables', async function () {
        await migrator.schema.dropTable('group_permissions');
        await migrator.schema.dropTable('user_groups');
        await migrator.schema.dropTable('permissions')
        await migrator.schema.dropTable('groups')
        await migrator.schema.dropTable('users')
        await migrator.schema.dropTable('knex_migrations_lock')
        await migrator.schema.dropTable('knex_migrations')
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
