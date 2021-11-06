const fs = require('fs');
const path = require("path");

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

const showFileContents = async (response, filepath) => {
    return new Promise((resolve) => {
        const stream = fs.createReadStream(filepath, 'utf-8');
        stream.on('end', resolve);
        stream.pipe(response);
    })
}

const handlers = {
    'GET': (request, response, userPath, CWD) => {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        getManaged(response, userPath, CWD, request);
    }
}

const getManaged = async (response,userPath, CWD, request) => {
    let relPath='';

    if (userPath && !path.isAbsolute(userPath)) {
        userPath = userPath.includes('.', 0)
            ? CWD + '/' + userPath.slice(1).replaceAll('/', '')
            : `${CWD}/${userPath.replaceAll('/', '')}`;
    }else if(!userPath){
        userPath = CWD;
    }

    if((request.url !== '/') && (request.url !== '/favicon.ico')){
        userPath += request.url;
        relPath += request.url;
    }

    if (await isFile(userPath)) {
        return await showFileContents(response, userPath);
    }else{
        const filesInCwd = await getFileNamesInDirectory(userPath);
        const result = template(userPath, relPath, JSON.stringify(filesInCwd))
        response.end(result);
    }
};

const template = (path, relPath, string) => {
    let html = `<h1>Current path: ${path} </h1><hr><a href="javascript:history.back();">[Go Back]</a><hr>`;
    let arr = string.replace(/["[\]]/g, '').split(',');

    html += '<ul>';
    for (const el of arr) {
        html += `<li><a href="${relPath}/${el}">${el}</a></li>`;
    }
    html += '</ul>';
    return html;
};

module.exports = {
    handlers
}