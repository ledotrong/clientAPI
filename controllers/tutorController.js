const User = require('../models/User');

exports.searchTutorList = (req, res)=>{
    var query = User.find({role: "tutor"});
    if (req.query.skill!='null')
        query.where('skills').equals(req.query.skill);
    if (req.query.province!='null') query.where('address.province').equals(req.query.province);
    if (req.query.district!='null') query.where('address.district').equals(req.query.district);
    if (req.query.sortPrice == "Ascending") query.sort({wages: 1}).where('wages').nin(0)
    if (req.query.sortPrice == "Descending") query.sort({wages: -1}).where('wages').nin(0)
    if (req.query.sortPrice == "Negotiate") query.where('wages').equals(0);
    var query1 = User.find({role: "tutor"});
    console.log(req.query);
    if (req.query.skill!='null'){ console.log("1111");
        query1.where('skills').equals(req.query.skill);}
    if (req.query.province!='null') {console.log("2222");query1.where('address.province').equals(req.query.province);}
    if (req.query.district!='null') {console.log("3333"); query1.where('address.district').equals(req.query.district);}
    if (req.query.sortPrice == "Ascending") {console.log("444"); query1.sort({wages: 1}).where('wages').nin(0)}
    if (req.query.sortPrice == "Descending") {console.log("5555");query1.sort({wages: -1}).where('wages').nin(0)}
    if (req.query.sortPrice == "Negotiate") {console.log("6666");query1.where('wages').equals(0);}
    query.count();
    query.exec(function (err, count) {
        if (err) return res.status(400).json(err);
        query1.limit(6).skip(6*(parseInt(req.query.current,10) -1)).exec(function (err, tutorlist){
            console.log(count);
            if (err) return res.status(400).json(err);
            return res.status(200).json({tutorlist, totalPage: count});
        })
      })
}

exports.getTutorList = (req, res)=>{
    var query = User.find({role: "tutor"});
    var query1 = User.find({role: "tutor"});
    query.count();
    query.exec(function (err, count){
        if (err) return res.status(400).json(err);
        query1.limit(6).exec(function (err, tutorlist){
            if (err) return res.status(400).json(err);
            return res.status(200).json({tutorlist, totalPage: count});
        })
    })
}
exports.getTutorDetail = async(req, res)=>{
    const tutor = await User.findById(req.query._id);
    if (tutor) return res.status(200).json(tutor);
    return res.status(400).json("Load data failed");
}