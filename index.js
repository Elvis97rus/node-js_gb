#!/usr/bin/env node

const http = require('http');
const {handlers} = require("./utils");
const CWD = process.cwd();

let userPath = process.argv[2];

const server = http.createServer((
    request,
    response
) => {
    const handler = handlers[request.method];
    if (!handler) {
        response.writeHead(404, {});
        response.end();
    }

    handler(request,response, userPath, CWD);
});

server.listen({
    port: 3000,
    hostname: 'localhost'
})