const io = require('socket.io')
const app = require('./app');

const socketServer = io(app);

const DATABASE = {
    storage: {},
    connections: 0,
    createUser(data) {
        this.storage[data.socket] = data.name;
        return data.name;
    },
    setConnections(data) {
        if (!data){
            this.connections++;
        }else {
            this.connections--;
        }
    }
};

socketServer.on('connection', function (socket) {
    socket.on('CLIENT_MSG', (data) => {
        socketServer.emit('SERVER_MSG', {
            msg: data.msg.split('').reverse().join(''),
            user: DATABASE.storage[data.socketId]
        });
    });

    socket.on('USER_CONNECTED', async function (data) {
        DATABASE.setConnections();
        DATABASE.createUser( {socket: socket.id, name: 'User-'+getRandomString(5)});
        socket.broadcast.emit('SERVER_MSG', {
            msg: `${DATABASE.storage[data.socketId]} was Connected*****`,
            user: '*****SERVER'
        });
        socket.emit('CREATED_NAME', {
            username: DATABASE.storage[data.socketId],
            token: data.socketId
        });
        socketServer.emit('USER_UPDATE_COUNT', {
            cnt: DATABASE.connections
        });
    });

    socket.on('USER_DISCONNECTED', async function (data) {
        socket.broadcast.emit('SERVER_MSG', {
            msg: `${DATABASE.storage[data.socketId]} was Disconnected*****`,
            user: '*****SERVER'
        });
        delete DATABASE.storage[socket.id];
        DATABASE.setConnections('disconnected');
        socketServer.emit('USER_UPDATE_COUNT', {
            cnt: DATABASE.connections
        });
        socket.disconnect();
    });
});

app.listen(3030, () => {
    console.log('Server started on port 3030');
});


const getRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}