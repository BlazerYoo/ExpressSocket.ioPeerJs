# ExpressSocket.ioPeerJs
Demo of using Express, Socket.io, and PeerJs together

As stated here https://github.com/peers/peerjs-server/issues/192, errors occur when running your own PeerJS server along side a socket.io server with Express.js.

Here is a demo of how to run these libraries together.

`Express.js` is used to serve files.

`Socket.io` is used to use websockets and create rooms

`PeerJS` is to create make peer to peer connections (and run custom PeerJS server)

# Usage
1. `git clone https://github.com/BlazerYoo/ExpressSocket.ioPeerJs/`
2. `cd ExpressSocket.ioPeerJs`
3. `npm install`
4. `node server.js`
