const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const { generateMessage, generateLocationMessage } = require('./utils/message')
const {Users} = require('./utils/user')
let users = new Users();

const publicPath = path.join(__dirname + '/../public')
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user connected");

    // User join 1 room 
    socket.on('join', (join) => {
        const {room,name } = join.params;
        socket.join(room)
        users.addUser(socket.id,name,room)
        io.to(room).emit('usersInRoom',{usersInRoom: users.getListOfUsersInRoom(room)})
        // Welcome to the chat app: from server to 1 client 
        socket.emit('newMessage', generateMessage('Admin', `Welcome to ${room} room`));

        // Server send message to other clients 
        socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} joined`));


    })

    //Server listen event from client and send message to other clients
    socket.on('createMessage', (message, callback) => {
        let user = users.getUserById(socket.id)

        io.to(user.room).emit('newMessage', generateMessage(message.from, message.text));
        callback('The message was sent');
    })
    // Geolocation
    socket.on('createLocationMessage', (message) => {
        let user = users.getUserById(socket.id)
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(message.from, message.latitude, message.longitude))
    })

    //Client leave the chat app
    socket.on("disconnect", () => {
        const user = users.removeUser(socket.id)
        if(user){
            io.to(user.room).emit('usersInRoom',{
                usersInRoom : users.getListOfUsersInRoom(user.room)
            })
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
        }
        console.log("User disconnected");
    });

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});