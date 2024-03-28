var Mocha = require('mocha');
const glob = require('glob');
const knex = require('knex');
const knexConfig = require('../knexfile');
const migrator = knex(knexConfig.test);
const fs = require('fs');
const sqlite = require('better-sqlite3');


const dbFile = 'dev.sqlite3';

// Instantiate a Mocha instance.
var mocha = new Mocha();
var appDir = 'src'
const files = glob.sync(appDir + '/**/*')
files.forEach(file => {
    if (file.substr(-7) == 'test.js') {
        if (file != 'src/mocha.test.js') {
            mocha.addFile(file);
        }
    }
});

mocha.run().on('start', async () => {
    // mock db
    const db = new sqlite(dbFile);
    db.query = (text, params) => db.prepare(text).all(params);

    // migrate and seed
    await migrator.migrate.latest();
    await migrator.seed.run();
}).on('fail', () => {
    exitCode = 1;
}).on('end', () => {
    // remove db file
    try {
        fs.unlinkSync(dbFile);
    } catch (err) {
        console.error(err);
    }
    process.exit(0)
})
