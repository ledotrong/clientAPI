const Socket = require('./models/Socket');
const jwt = require('jsonwebtoken');
exports.socketio = function (socket){
    socket.on("Client-login", async (data)=>{
        var verify = jwt.verify(data, process.env.TOKEN_SECRET);
        console.log("verify",verify);
        console.log(socket.adapter.rooms, socket.id);
        const temp = await Socket.update({userID: verify.userID},{$set:{socketID: socket.id}});
        if (!temp) socket.emit("Change-socketid-failed");
        else socket.emit("Change-socketid-sucessfully");
      });
      socket.on("Client-send-message", async (data) =>{
        console.log("sockettttt", data)
        const temp = await Socket.find({userID: data.userID});
        console.log(temp)
        if (!temp) console.log("socket Client send message failed");
        else {
          var user = {
            name: data.name,
            picture: data.picture,
            userID: data.id
          }
          console.log("send");
        socket.broadcast.in(temp[0].socketID).emit("Client-send-message", {user, message: data.message});
      }})
}