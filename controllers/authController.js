const User = require('../models/User');
const Socket = require('../models/Socket');
const forgotPassword = require('../models/ForgotPassword');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const passport = require('passport');
const {
  registerValidation,
  updateValidation,
  addInfoValidation,
  registerFbGgValidation,
  changePasswordValidation
} = require('../models/validation');

const helpers = require('../helpers');

// REGISTER
exports.register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // Kiem tra email bi trung?
  const userCheck = await User.findOne({ email: req.body.email });
  if (userCheck) {
    console.log('Email already exists');
    return res.status(400).json('Email already exists');
  }

  // Ma hoa mat khau
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    name: 'undefined',
    wages: 0,
    newMessages: 0
  });
  console.log(newUser);
  try {
    const savedUser = await newUser.save();
    helpers.SendVerifyAccountMail(
      'tutorweb.herokuapp.com' /*'localhost:3000'*/,
      newUser.email,
      newUser._id,
      newUser.role,
      function(error, key) {
        if (!error)
          //return res.status(500).send('Unknown error. Please try again.');
          res
            .status(200)
            .send(
              'Email was sent successfully. Please check your email to validate account.'
            );
      }
    );
    res.json({ newUser: newUser._id });
  } catch (err) {
    console.log(err);
    res.status(400).json(err.errors.address.validatorError);
  }
};

// LOGIN
exports.login = async (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user: user
      });
    }

    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }

      // Token chứa ID và Role
      const token = JWT.sign(
        { userID: user._id, role: user.role },
        process.env.TOKEN_SECRET
      );

      if (user.status === "inactive") {
        return res.json({
          message: info.message,
          user: {
            email: user.email,
            name: user.name,
            role: user.role,
            current: 1
          },
          token
        });
      } else if (user.status === "banned"){
        return res.status(400).json({message: "Account has been banned", user: null});
      }else
        return res.json({
          message: info.message,
          user: {
            date: user.date,
            email: user.email,
            name: user.name,
            role: user.role,
            picture: user.picture,
            skills: user.skills,
            address: user.address,
            wages: user.wages,
            current: 3
          },
          newMessages: user.newMessages,
          token
        });
    });
  })(req, res);
};

// UPDATE
exports.update = async (req, res) => {
  const { error } = updateValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // Ma hoa mat khau
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    picture: req.body.picture
  };

  try {
    const updatedUser = await User.updateOne(
      { _id: req.user._id },
      { $set: newUser }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addInfo = async (req, res) => {
  var newUser = {
    name: req.body.name,
    skills: Array(0),
    rate: 0,
    address: req.body.address
  };
  if (req.body.role === "tutor") {
    newUser.skills = req.body.skills
  }
  const { error } = addInfoValidation(newUser);
  if (error)return res.status(400).json(error.details[0].message);

  try {
    const addInfo = await User.updateOne(
      { _id: req.body.id },
      { $set: newUser }
    );
    var newsocket= {
      userID: req.body.id,
      socketID: null
    }
    await Socket.insertMany([{userID: newsocket.userID, socketID: newsocket.socketID}]);
    res.json(addInfo);
  } catch (err) {
    console.log(err.response);
    console.log('abc', err);
    res.status(400).json(err);
  }
};

exports.addInfoFb = async (req, res) => {
  const newUser = {
    role: req.body.role,
    skills: req.body.skills,
    address: req.body.address,
    introduction: null
  };
  const { error } = registerFbGgValidation(newUser);
  if (error) return res.status(400).json(error.details[0].message);
  newUser.status = "active";

  try {
    const addInfo = await User.updateOne(
      { 'facebookProvider.id': req.body.fbid },
      { $set: newUser }
    );
    res.json(addInfo);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addInfoGg = async (req, res) => {
  const newUser = {
    role: req.body.role,
    skills: req.body.skills,
    address: req.body.address,
    introduction: null
  };
  const { error } = registerFbGgValidation(newUser);
  if (error) return res.status(400).json(error.details[0].message);
  newUser.status = "active";
  try {
    const addInfo = await User.updateOne(
      { 'googleProvider.id': req.body.fbid },
      { $set: newUser }
    );
    res.json(addInfo);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.activatedAccount = async (req, res) => {
  const newUser = {
    status: "active"
  };
  try {
    console.log('hello', req.body.id);
    const status = await User.updateOne(
      { _id: req.body.id },
      { $set: newUser }
    );
    res.status(200).json(status);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginFacebook = (req, res, next) => {
  passport.authenticate('facebook-token', (err, user, info) => {
    if (err || !user) {
      return res.status(401).json('User Not Authenticated');
    }
    const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    return res.status(200).json({
      name: user.name,
      email: user.email,
      picture: user.picture,
      skills: user.skills,
      address: user.address,
      role: user.role,
      status: user.status,
      wages: user.wages,
      token
    });
  })(req, res, next);
};

exports.loginGoogle = (req, res, next) => {
  passport.authenticate('google-token', (err, user, info) => {
    if (err || !user) {
      return res.status(401).json('User Not Authenticated');
    }
    const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    return res.status(200).json({
      name: user.name,
      email: user.email,
      picture: user.picture,
      skills: user.skills,
      address: user.address,
      role: user.role,
      status: user.status,
      wages: user.wages,
      token
    });
  })(req, res, next);
};

exports.getFacebookId = async (req, res) => {
  const user = await User.findById(req.query.id);
  if (user) res.status(200).json({ facebookId: user.facebookProvider.id });
  else res.status(400).json('Failed');
};

exports.getGoogleId = async (req, res) => {
  const user = await User.findById(req.query.id);
  if (user) res.status(200).json({ googleId: user.googleProvider.id });
  else res.status(400).json('Failed');
};

exports.verifyToken = (req, res, next) => {
  console.log(req.body, "veri")
  passport.authenticate('jwt', { session: false },  (err, user, info) => {
    if (err || !user) {
      return  res.status(401).json("Invalid token") ;
    }
    else {
      console.log(user);
      req.user = user;
  next();
    }
  })(req)
  
}
exports.updateAvatar = async (req, res) => {
  
      try {
        const updatedAvatar = await User.updateOne(
          { _id: req.user._id },
          { $set: {picture: req.body.picture} }
        );
        res.json(updatedAvatar);
      } catch (err) {
        res.status(400).json(err);
      }
}

exports.updateInfo = async (req, res) => {
  console.log("helo",req.body);
  var newUser;
  if (req.user.role == "tutor")
     newUser = {
        name: req.body.name,
         address: req.body.address,
         skills: req.body.skills,
         introduction: req.body.introduction,
         wages: req.body.wages
      }
    else newUser={
      name: req.body.name,
         address: req.body.address,
    }
      try {
        const updatedInfo = await User.updateOne(
          { _id: req.user._id },
          { $set: newUser }
        );
        res.json(updatedInfo);
      } catch (err) {
        res.status(400).json(err);
      }
}
exports.changePassword = async (req, res) =>{
  var data = {
    password: req.body.currentPassword,
    newpassword: req.body.newPassword
  }
  var ret = bcrypt.compareSync(data.password, req.user.password);
  if (ret) {
    const { error } = changePasswordValidation(data);
    if (error) return res.status(400).json({message: error.details[0].message});
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    try {
      const kq = await User.updateOne({_id: req.user._id},{$set:{"password": hashedPassword}});
      return res.status(200).json();
      }
    catch(err){
      return res.status(400).json({message: err});
    }
  }
  else return res.status(400).json({message: "Invalid password"});
}
function makeid() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
exports.forgotPassword= async (req, res)=>{
  const user = await User.find({"email": req.body.email});
  if (user.length == 0) return res.status(400).json({message: "Can not find this email. Please try again."});
  else{
  const ForgotPassword = new forgotPassword({
    email: req.body.email,
    time: new Date(),
    status: 0,
    code: makeid()
  })
  try {
     await ForgotPassword.save();
     
    helpers.forgotPassword(
      req.body.email,
      ForgotPassword.code,
      function(error, key) {
        if (!error)
          //return res.status(500).send('Unknown error. Please try again.');
          res
            .status(200)
            .json({message:
              'Email was sent successfully. You only have 5 minutes to enter the code after email was sent. Please check your email immediately to get the code.'
            });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).json({message: err.errors.address.validatorError});
  }
}
}
exports.checkCode = async (req,res)=>{
  const {email, code} = req.body;
  const temp = await forgotPassword.findOne({email, code});
  if (!temp) res.status(400).json({message: "Invalid code"});
  else{
    if (temp.status == 1) res.status(400).json({message: "This code has been used."});
    else if (temp.status == -1) res.status(400).json({message: "This code had expired."});
    else {
    var today = new Date();
    const diffTime = Math.abs(today - temp.time);
const diffDays = diffTime/64000 ;
    if (diffDays>5) res.status(400).json({message: "This code had expired."});
    else{
      await forgotPassword.update({code},{$set: {status: 1}});
      res.status(200).json();
    }
    }
  }
}
exports.changeForgotPassword = async (req,res)=>{
  const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    try {
      const kq = await User.update({email: req.body.email},{$set:{"password": hashedPassword}});
      return res.status(200).json();
      }
    catch(err){
      return res.status(400).json({message: err});
    }
}
exports.getUserDetail = async(req, res)=>{
  const user = await User.findById(req.query._id);
  if (user) return res.status(200).json(user);
  return res.status(400).json("Load data failed");
}
exports.getUser = async(req, res, next)=>{
  const user = await User.findById(req.query.id);
  if (!user) req.user1=null;
  else {
    var user1={
      picture: user.picture,
      _id: user._id,
      name: user.name
    }
    req.user1 = user1;
  }
    next();
}