// Connect to socket.io server
const socket = io();
// Connect to peerjs server
let myPeer = new Peer({
    host: '/',
    path: '/peerjs-server',
    port: 3001,
    debug: 3
});
// Keep track of data connections with peers
const peers = {};


// When myPeer connected to peerjs server, join socket.io room
myPeer.on('open', (clientId) => {
    logMessage(`myPeer ID is: ${clientId}`);
    logMessage(`myPeer requesting to join ${ROOM_ID}`);
    socket.emit('join-room', ROOM_ID, clientId);
});
socket.on('client-added', () => {
    logMessage('myPeer successfully joined room');
});
myPeer.on('connection', (connection) => {
    logMessage('myPeer established a new connection from a remote peer');
    //add to peers
});
myPeer.on('close', () => {
    logMessage('myPeer closed');
    myPeer.destroy();
    peers = {};
});
myPeer.on('disconnected', () => {
    logMessage('myPeer disconnected');
});
// Handle peerjs errors
myPeer.on('error', (error) => {
    logMessage(error);
});


// When new client joined room, connect to new client (peer)
socket.on('client-joined', clientId => {
    logMessage(`Client ${clientId} connected to my room`);
    connectToPeer(clientId);
});
// Close peer connections when clients leave
socket.on('client-left', clientId => {
    if (peers[clientId]) peers[clientId].close();
    logMessage(`Client ${clientId} left`);
});


// Display events
let logMessage = (message_content) => {
    let messages = document.getElementById('messages');
    let message = document.createElement('p');
    message.textContent = message_content;
    messages.appendChild(message);
};


// Initiate peer to peer connections
let connectToPeer = (peerId) => {
    logMessage(`myPeer connecting to ${peerId}...`);
    let connection = myPeer.connect(peerId);

    // When myPeer successfully connected to new peer
    connection.on('open', () => {
        logMessage(`myPeer successfully connected to ${peerId}`);
    });

    // When myPeer receives data
    connection.on('data', (data) => {
        logMessage(`myPeer received ${data}`);
    });

    // When myPeer closed connection with new peer
    connection.on('close', () => {
        logMessage(`myPeer closed connection with ${peerId}`);
    });

    // When error
    connection.on('error', (error) => {
        logMessage(error);
    });

    // Keep track of peer connections
    peers[peerId] = connection;
};
