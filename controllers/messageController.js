const Message = require('../models/Message');
const User = require('../models/User');
exports.getMessage = async (req, res)=>{
    var users = new Array(`${req.user._id}`, `${req.user1._id}`);
    var user={
        _id: req.user1._id,
        picture: req.user1.picture,
        name: req.user1.name
    }
    const messages = await Message.find({users: { $all: users}});
    console.log("mmmmmm", users)
    if (!messages) res.status(400).json({user, message: "Load messages failed."});
    else {
        await Message.update({_id: messages._id}, {$set: {newMessage: false}});
        res.status(200).json({user,messages});
    }
}

exports.addMessage = async (req, res)=>{
    var arr = [];
    arr.push(req.body.id);
    arr.push(req.body.userID)
    var temp ={
        users: arr,
        message: []
    }
    if (temp.users[0] == null || temp.users[1] == null) res.status(400).json({message: "userID null"});
    temp.message.push(req.body.message);
    const temp1 = await Message.findOne({users: { $all: temp.users}});
    if (!temp1){
        const message = await Message.insertMany([{users: temp.users, message: temp.message, newMessage: true, time: new Date(), numOfNewMessages: 1}]);
        if (!message) res.status(400).json({message: "Add message failed"});
        else {
            const u = await User.update({_id: `${req.body.userID}`}, {$inc:{newMessages: 1}});
             res.status(200).json({message: "Add message success"});
        }
    }
    else {
        var temp2 = temp1.message;
        temp2.push(req.body.message);
        if (temp1.message[temp1.message.length-2].author == req.body.message.author ){
        const message = await Message.update({users: { $all: temp.users}}, { $set: {message: temp2, newMessage: true, time: new Date()}, $inc: {numOfNewMessages: 1}});
        if (!message) res.status(400).json({message: "Add message failed"});
    else{
        const u = await User.update({_id:`${req.body.userID}`}, {$inc:{newMessages: 1}});
         res.status(200).json({message: "Add message success"});
    }
}
        else {
            const temp3 = await User.findByIdAndUpdate(req.body.id, {$inc: {newMessages: -temp1.numOfNewMessages}})
            const message = await Message.update({users: { $all: temp.users}}, { $set: {message: temp2, newMessage: true, time: new Date(), numOfNewMessages: 1}});
            if (!message) res.status(400).json({message: "Add message failed"});
        else{
            const u = await User.update({_id:`${req.body.userID}`}, {$inc:{newMessages: 1}});
             res.status(200).json({message: "Add message success"});
        }
        }
    }
}
exports.get4Messages = (req, res)=>{
    Message.find({users: `${req.user._id}`}).sort({time: -1}).skip(parseInt(req.query.data)).limit(4).exec(async (err, temp)=>{
    if (!temp) res.status(400).json({message: "Load messages failed"});
    else{
        console.log(temp, "temppp", req.user._id)
        var kq =[];
        for (let i=0;i<temp.length; i++){
            var id = req.user._id == temp[i].users[0]? temp[i].users[1] : temp[i].users[0];
            const user = await User.findById(id);
            if (!user) res.status(400).json({message: "Load messages failed"});
          
            var temp1 = {
                name: user.name,
                id: user._id,
                picture: user.picture,
                lastMessage: temp[i].message[temp[i].message.length -1].data.text == undefined? temp[i].message[temp[i].message.length -1].data.emoji : temp[i].message[temp[i].message.length -1].data.text,
                newMessage: temp[i].newMessage,
                lastMessageAuthor: temp[i].message[temp[i].message.length -1].author == user._id? user.name : "You"
            }
            kq.push(temp1);
        }
        res.status(200).json({data: kq, newMessages: req.user.newMessages});
    }
})
}
exports.SeenMessages = async (req, res)=>{
    const temp = await Message.findOne({users: { $all: [`${req.user._id}`,`${req.body.id}`]}});
     await Message.findOneAndUpdate({users: { $all: [`${req.user._id}`,`${req.body.id}`]}}, {$set: {newMessage: false, numOfNewMessages: 0}})
    const temp2 = await User.findByIdAndUpdate(req.user._id, {$inc: {newMessages: -temp.numOfNewMessages}})
    if (temp2) res.status(200).json({});
    else res.status(400).json({message:"Seen messages failed."})
}