//Напишите программу, которая находит в этом файле все записи с ip-адресами 89.123.1.41 и 34.48.240.111,
// а также сохраняет их в отдельные файлы с названием “%ip-адрес%_requests.log”.

const fs = require('fs');
const path = require('path');
const {EOL} = require('os');
const { Transform } = require('stream');

let buff;

const readStream = new fs.ReadStream(path.join(__dirname, './access.log'), 'utf8');
const writeStream1 = fs.createWriteStream('./176.212.24.22_requests.log')
const writeStream2 = fs.createWriteStream('./89.123.1.41_requests.log')

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        let transformedChunk = buff + chunk;

        transformedChunk = chunk.toString().replace(/89.123.1.41/gm, '[start]89.123.1.41').replace(/^\d.+$/gm, '').replace(/\n/g, '').replace(/"curl\/7.47.0"/gm, `"curl/7.47.0"[end]${EOL}`);

        let lastEnd = transformedChunk.lastIndexOf('[end]');
        let string = transformedChunk.substr(0,lastEnd);

        buff = transformedChunk.substr(lastEnd);

        this.push(string);
    }
});

readStream.pipe(transformStream).pipe(writeStream2);

const transformStream2 = new Transform({
    transform(chunk, encoding, callback) {
        let transformedChunk = buff + chunk;
        transformedChunk = chunk.toString().replace(/176.212.24.22/gm, '[start]176.212.24.22').replace(/^\d.+$/gm, '').replace(/\n/g, '').replace(/"curl\/7.47.0"/gm, `"curl/7.47.0"[end]${EOL}`);
        let lastEnd = transformedChunk.lastIndexOf('[end]');
        let string = transformedChunk.substr(0,lastEnd);
        buff = transformedChunk.substr(lastEnd);
        this.push(string);
    }
});

readStream.pipe(transformStream2).pipe(writeStream1);
