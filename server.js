const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const { PeerServer } = require('peer');


// Set up peerjs server + handle peerjs connections
const peerServer = PeerServer({
    debug: true,
    path: '/peerjs-server',
    port: 3001
});
peerServer.on('connection', (client) => {
    console.log(`peerjs - Client connected: ${client.getId()}`);
});
peerServer.on('disconnect', (client) => {
    console.log(`peerjs - Client disconnected: ${client.getId()}`);
});


// Use EJS + static files
app.set('view engine', 'ejs');
app.use(express.static('public'));


// Generate random roomId
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
});
app.get('/:room', (req, res) => {
    res.render('room-view', { roomId: req.params.room });
});


// Handle socket.io connections
io.on('connection', socket => {

    // Client connected to socket.io server
    console.log('socket.io - A client connected');

    // Client emitted join-room
    socket.on('join-room', (roomId, clientId) => {
        console.log(`socket.io - Client ${clientId} requested to join room ${roomId}`);

        // Add client to assigned room
        socket.join(roomId);
        console.log(`socket.io - Client ${clientId} added to room ${roomId}`);
        socket.emit('client-added');

        // Alert clients in room that new client joined
        socket.to(roomId).emit('client-joined', clientId);
        console.log(`socket.io - Clients alerted that client ${clientId} added to room ${roomId}`);
        
        // Client disconnected from socket.io server
        socket.on('disconnect', () => {
            console.log(`socket.io - Client ${clientId} disconnected`);
            socket.to(roomId).emit('client-left', clientId);
            console.log(`socket.io - Client disconnected: ${clientId}`)
        });
    });
});


// Start server
server.listen(process.env.PORT || 3000, () => {
    console.log(`App started listening on port  ${server.address().port}`);
});
