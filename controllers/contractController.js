
const Contract = require('../models/Contract');
const User = require('../models/User');

exports.addContract = async (req, res) =>{
    var today = new Date();
    if (req.body.startDate <= today) res.startDate(400).json({message: "Start date of the study period must greater than today."});
    else {
        const data = new Contract({
            studentID: req.user._id,
            studentName: req.user.name,
            tutorName: req.body.tutorName,
            tutorID: req.body.tutorID,
            rentHours: req.body.rentHours,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          price: req.body.price,
          contractCreationDate: today,
        currentStatus: "request",
        statusHistory: [{
        date: today,
        content: `Student ${req.user.name} had sent request to tutor ${req.body.tutorName}.`,
        status: "request"
  }]
        });
        try {
        const contract = await data.save();
        return res.status(200).json(contract);
        }catch(err){
            return res(400).json({message: null});
        }
    }
}
exports.getContract = (req, res)=>{
    console.log("999999", req.query)
    var listContract;
    var listContract1;
    var today = new Date();
    if (req.user.role === "student")
        listContract = Contract.find({"studentID": req.user._id, "currentStatus":req.query.status});
    else listContract = Contract.find({"tutorID": req.user._id, "currentStatus":req.query.status});
    if (req.query.status === "inProcess") listContract.where("endDate").gt(today);
    if (req.query.status=== "finished") {
        if (req.user.role === "student")
        listContract1 = Contract.find({"studentID": req.user._id, "currentStatus":"inProcess"});
    else listContract1 = Contract.find({"tutorID": req.user._id, "currentStatus":"inProcess"});
    listContract.sort({contractCreationDate: -1}).exec(function (err, list){
        listContract1.where("endDate").lt(today).sort({contractCreationDate: -1}).exec(function (err1, list1){
            var kq;
            if (list && list1) {
                var temp = list1.concat(list);
                kq = temp.slice(3*req.query.current, 3+3*req.query.current);
                res.status(200).json({results: kq});
            }
            else res.status(400).json({message: "Load data failed."});
        })
    })
    
    }
    else listContract.sort({contractCreationDate: -1}).limit(3).skip(3*parseInt(req.query.current,10)).exec(function (err, list){
        console.log(list);
        if (list){
            
            res.status(200).json({results: list});
        }
    else res.status(400).json({message: "Load data failed."});
    })
}
exports.updateContract = async (req,res)=>{
    const temp = await Contract.findById(req.body._id);
    if (!temp) res.status(400).json({message: "Failed"});
    var temp1 = temp.statusHistory;
    if (req.body.status == "finished"){
        const tutor = await User.update({_id: temp.tutorID}, {$inc:{rate: req.body.rate}});
        if (!tutor) res.status(400).json({message: "Failed"});
        temp1.push({date: new Date(), content: req.body.content, status: req.body.status, rate: req.body.rate});
    }
    else temp1.push({date: new Date(), content: req.body.content, status: req.body.status});
    try {
        await Contract.updateOne({_id: req.body._id}, {$set:{currentStatus: req.body.status, statusHistory: temp1}});
        res.status(200).json({})
    }catch(err){
        res.status(400).json({message: err});
    }
}