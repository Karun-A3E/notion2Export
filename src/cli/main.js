#!/usr/bin/env node

const DatabaseAPI = require('./API/dbAPI');
const PageAPI = require('./API/pageAPI');
const file_handler = require('./modules/files-handler')
const path =require('path')
const yargs = require('yargs');
const fs = require('fs')
yargs
  .scriptName('notion')
  .usage('$0 [options]')
  .option('o', {
    alias: 'output',
    describe: 'Specify the output file for the response',
    type: 'string',
  })
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
        try {
        const response = await DatabaseAPI.responseDatabase(databaseID);
        try {
          await DatabaseAPI.establishSettings(null,databaseID)
        } catch (error) {
          
        }
         if (argv.output) {
          fs.writeFileSync(argv.output, JSON.stringify(response), 'utf8');
          console.log(`Response written to ${argv.output}`);
        }
          process.exit(0);
        } catch (err) {
          console.error(err);
          process.exit(1);
        }
          
      })
      .command('read', 'Read data from a database', (yargs) => {
        yargs
          .option('id', {
            describe: 'The ID of the database',
            type: 'string',
          })
          .option('name', {
            describe: 'The name of the database',
            type: 'string',
          })
          .option('page', {
            describe: 'The page number',
            type: 'number',
          })
          .option('extract', {
            describe: 'Enable data extraction',
            type: 'boolean',
          })
          .check((argv) => {
            if (!argv.id && !argv.name) {
              throw new Error('Please provide either --id or --name');
            }
            if (argv.id && argv.name) {
              throw new Error('Please provide either --id or --name, not both');
            }
            return true;
          });
      }, async (argv) => {
        const databaseID = argv.id;
        const databaseName = argv.name;
        const page = argv.page==null ? undefined : argv.page; 
        const shouldExtract = argv.extract; 
        try {
          const response = await DatabaseAPI.readDatabase(databaseID, databaseName, page, true,shouldExtract);

          if (argv.output) {
            fs.writeFileSync(argv.output, JSON.stringify(response), 'utf8');
            console.log(`Response written to ${argv.output}`);
          }
                process.exit(0);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      })
      .command('cache', 'Cache database information', (yargs) => {
        yargs.option('list', {
          describe: 'List cached databases',
          type: 'boolean',
        });
      }, async (argv) => {
        if (argv.list) {
          const filePath = path.resolve(__dirname, './.cache/databaseKey.json');
          let existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          console.log(existingData)
        } 
      })
      .command('config', 'Edit the Settings of the Database Properties', (yargs) => {
        yargs
          .option('id', {
            describe: 'The ID of the database',
            type: 'string',
          })
          .option('name', {
            describe: 'The name of the database',
            type: 'string',
          })
          .option('settings', {
            describe: 'The name of the database',
            type: 'string',
          })
          .check((argv) => {
            if (!argv.id && !argv.name) {
              throw new Error('Please provide either --id or --name');
            }
            return true;
          });
      }, async (argv) => {
          if(argv.settings){
            DatabaseAPI.confgSettings(argv.settings,argv.name,argv.id)
          }
           DatabaseAPI.establishSettings(argv.name,argv.id);
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
  .command('setup <cmd>', 'Setting Up Files', (yargs) => {
    yargs
      .command('required', 'Download ENV', (yargs) => {
      }, async (argv) => {
        console.log('Setting Up');
        file_handler.required_files()
      })
  })
  .help()
  .argv;


