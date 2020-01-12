

const appNamespaces = [
    {
        key: "registrationTracker",
        path: "/subject-registered",
        onConnect: (socket, context) => {
            console.log(socket.id + " is connect to /subject-registered")
        },
        onDisconnect: (socket, context) => {
            console.log(socket.id + " is disconnect to /subject-registered")
        },
        handlers: "./namespaces/registration-tracker/handlers/index"
    },
];

const configIO = (nspIO, context) => {
    nspIO.io.on('connection', function (socket) {
        nspIO.onConnect(socket, context);
        socket.on("disconnect", function () {
            nspIO.onDisconnect(socket, context);
        });
        socket.on('join', function(room) {
            console.log("room " +room)
            socket.join(room);
        });
        require(nspIO.handlers)(socket, nspIO.io, context);
    });
    return nspIO.io;
};

const createNamespaceIO = (server, context) => {
    const io = require('socket.io')(server);
    const namespacesIO = appNamespaces.map(({path, onConnect, onDisconnect, handlers, key}) => ({
        io: io.of(path),
        onConnect,
        onDisconnect,
        handlers,
        key
    }));

    return namespacesIO.reduce((result, cur) => {
        result[cur.key] = configIO(cur, context);
        return result;
    }, {})
};

module.exports = {createNamespaceIO};

