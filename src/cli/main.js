#!/usr/bin/env node

const DatabaseAPI = require('./API/dbAPI');
const PageAPI = require('./API/pageAPI');
const yargs = require('yargs');
const fs = requier('fs')
yargs
  .scriptName('notion')
  .usage('$0 [options]')
  .command('db <cmd>', 'Interact with databases', (yargs) => {
    yargs
      .command('append', 'Append data to a database', (yargs) => {
        yargs.option('id', {
          describe: 'The ID of the database',
          type: 'string',
          demandOption: true,
        });
      }, async (argv) => {
        const databaseID = argv.id;
          const response = await DatabaseAPI.responseDatabase(databaseID);
      })
      .command('read', 'Read data from a database', (yargs) => {
        yargs.option('id', {
          describe: 'The ID of the database',
          type: 'string',
          demandOption: true,
        });
      }, async (argv) => {
        const databaseID = argv.id;
        const response = await DatabaseAPI.readDatabase(databaseID)

      })
      .command('cache', 'Cache database information', (yargs) => {
        yargs.option('id', {
          describe: 'The ID of the database',
          type: 'string',
          demandOption: true,
        });
        yargs.option('list', {
          describe: 'List cached databases',
          type: 'boolean',
        });
      }, async (argv) => {
        if (argv.list) {
          const filePath = path.resolve(__dirname, './.cache/databaseKey.json');
          let existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          console.log(existingData)
        } else {
          const databaseID = argv.id;
          console.log('Listing Specific Database')
        }
      });
  })
  .command('pg <cmd>', 'Interact with pages', (yargs) => {
    yargs
      .command('read', 'Read page content', (yargs) => {
        yargs.option('id', {
          describe: 'The ID of the page',
          type: 'string',
          demandOption: true,
        });
      }, async (argv) => {
        const pageID = argv.id;
        console.log('Page Read')
      })
      .command('cache', 'Cache page information', (yargs) => {
        yargs.option('id', {
          describe: 'The ID of the page',
          type: 'string',
          demandOption: true,
        });
      });
  })
  .help()
  .argv;
