#!/usr/bin/env node

const path = require('path')
const yargs = require('yargs');
const {getFileNamesInDirectory, promptUser, isFile, showFileContents} = require('./utils')
const CWD = process.cwd();

const options = yargs
    .usage("Usage: -qu query")
    .option(
        "qu", // -p
        {
            alias: 'query', // --path == -p
            describe: 'Search query',
            type: 'string',
            demandOption: false
        }).argv;

let userPath = ((process.argv[2] !== '--query') && (process.argv[2] !== '-qu'))
    ? process.argv[2]
    : '';

(async () => {
    if (userPath) {
        userPath = userPath.includes('.', 0)
            ? CWD + userPath.slice(1).replaceAll('/', '')
            : `${CWD}/${userPath.replaceAll('/', '')}`;
    }else{
        userPath = CWD;
    }
    while (true){
        const filesInCwd = await getFileNamesInDirectory(userPath);
        const userChoise = await promptUser(filesInCwd);
        if (await isFile(path.join(userPath, userChoise))) {
            return await showFileContents(path.join(userPath, userChoise),options);
        }else{
            userPath += `/${userChoise}`;
        }
    }
})();
