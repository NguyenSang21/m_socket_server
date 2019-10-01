const express = require('express')
const app = express()
const port = 2020
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ioClient = require('socket.io-client');

let file_data = []

/*** connect to file server ***/
const socketClient = ioClient.connect("http://localhost:2019/", {
  reconnection: true
});

/*Receive requests from file server*/
socketClient.on('connect', () => {
  console.log("listening file server ...")
  socketClient.on('receive_file_info',  (data) => {
    console.log("CHANGE==", data)
    file_data = data.data // save data
  });
})

/*** socket of master server ***/
server.listen(port, () => console.log(`App listening on port ${port}!`));

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

io.on('connection', (socket) => {
  socket.emit('file_data', {data: file_data})
  // set 10s send data
  setInterval(() => {
    socket.emit('file_data', {data: file_data})
  }, 10000)

})