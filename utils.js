const fs = require('fs');
const inquirer = require('inquirer');
const readline = require('readline');

const isFile = (filepath) => {
    return fs.lstatSync(filepath).isFile();
}

const getFileNamesInDirectory = async (directory) => {
    return await new Promise( (resolve) => {
        fs.readdir(directory, (err, data) => {
            resolve(data);
        });
    });
}

const promptUser = async (choices) => {
    const optionKey = 'optionKey';

    const result = await inquirer.prompt([{
        name: optionKey,
        type: 'list',
        message: 'Please choose a file to read',
        choices
    }])

    return result[optionKey];
}

const showFileContents = async (filepath, options) => {
    if(options.query) {
        global.searchResults = [];
        const readStream = fs.createReadStream(filepath, 'utf8')
        const rl = readline.createInterface({
            input: readStream
        });
        const line_counter = ((i = 0) => () => ++i)();

        rl.on('line', (line, lineno = line_counter()) => {
            if (line.includes(options.query)) {
                global.searchResults
                    .push(`Вхождение строки "${options.query}" в строке: "${line}" - строка № ${lineno}`);
            }
        })

        rl.on('close', () => {
            if (global.searchResults.length){
                console.log(global.searchResults);
            }else{
                console.log(`Вхождение строки "${options.query}" не обнаружено`);
            }
        });

    }else{
        return new Promise((resolve) => {
            const stream = fs.createReadStream(filepath, 'utf-8');
            stream.on('end', resolve);
            stream.pipe(process.stdout);
        })
    }
}

module.exports = {
    getFileNamesInDirectory,
    promptUser,
    showFileContents,
    isFile
}