#!/usr/bin/env node

const yargs = require('yargs');
const { seedCmd } = require('../cmd/seed');

const options = yargs.usage('Usage: --seed <data>').option('s', { alias: 'seed', describe: 'Seed data', type: 'string', demandOption: false }).argv;

if ('s' in options) {
    seedCmd(options.seed);
}
