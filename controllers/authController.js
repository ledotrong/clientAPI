const User = require('../models/User');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const passport = require('passport');
const {
  registerValidation,
  updateValidation, 
  addInfoValidation,
  registerFbGgValidation

} = require('../models/validation');
const helpers = require('../helpers');
// REGISTER
exports.register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // Kiem tra email bi trung?
  const userCheck = await User.findOne({ email: req.body.email });
  if (userCheck) {console.log('Email already exists'); return res.status(400).json('Email already exists');}

  // Ma hoa mat khau
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    name: "undefined",
    address: "undefined"
  });
console.log(newUser);
  try {
    const savedUser = await newUser.save();
    helpers.SendVerifyAccountMail("localhost:3001", newUser.email, newUser._id, function (error, key) {
      if (!error) 
          //return res.status(500).send('Unknown error. Please try again.');
            res.status(200).send('Email was sent successfully. Please check your email to validate account.');
  });
    res.json({ newUser: newUser._id });
  } catch (err) {
    console.log(err)
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

      if (!user.activated) {
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
      }

      else return res.json({
        message: info.message,
        user: {
          date: user.date,
          email: user.email,
          name: user.name,
          role: user.role,
          picture: user.picture,
          skills: user.skills,
          address: user.address,
          current: 3
        },
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
  const newUser = {
    name: req.body.name,
    skills: req.body.skills,
    address: req.body.address,
  };
  const { error } = addInfoValidation(newUser);
  if (error) return res.status(400).json(error.details[0].message);
  
  try {
    const addInfo = await User.updateOne(
      { _id: req.body.id },
      { $set: newUser }
    );
    res.json(addInfo);
  } catch (err) {
    console.log(err.response);
    console.log("abc",err);
    res.status(400).json(err);
  }
}

exports.addInfoFb = async (req, res) => {
 
  const newUser = {
    role: req.body.role,
    skills: req.body.skills,
    address: req.body.address
  };
  const { error } = registerFbGgValidation(newUser);
  if (error) return res.status(400).json(error.details[0].message);
 newUser.activated = true;
 
  try {
    const addInfo = await User.updateOne(
      { 'facebookProvider.id': req.body.fbid },
      { $set: newUser }
    );
    res.json(addInfo);
  } catch (err) {
    res.status(400).json(err);
  }
}

exports.addInfoGg = async (req, res) => {
  const newUser = {
    role: req.body.role,
    skills: req.body.skills,
    address: req.body.address
  };
  const { error } = registerFbGgValidation(newUser);
  if (error) return res.status(400).json(error.details[0].message);
  newUser.activated = true;
  try {
    const addInfo = await User.updateOne(
      { 'googleProvider.id': req.body.fbid },
      { $set: newUser }
    );
    res.json(addInfo);
  } catch (err) {
    res.status(400).json(err);
  }
}

exports.activatedAccount = async (req, res) => {
  const newUser = {
    activated: true
  };
  try {
    console.log("hello", req.body.id);
    const activated = await User.updateOne(
      { _id: req.body.id },
      { $set: newUser }
    );
    res.status(200).json(activated);
  } catch (err) {
    res.status(400).json(err);
  }
}
exports.loginFacebook = (req, res, next) =>{
  passport.authenticate('facebook-token', (err, user, info) => {
      if (err || !user) {
          return res.status(401).json('User Not Authenticated');
      }
      const token = JWT.sign({_id: user._id}, process.env.TOKEN_SECRET);
      return res.status(200).json({name: user.name, email: user.email,picture:user.picture, skills: user.skills, address: user.address, role: user.role, activated: user.activated, token});
  })(req, res, next);
}
exports.loginGoogle = (req, res, next)=>{
  passport.authenticate('google-token', (err, user, info) => {
      if (err || !user) {
          return res.status(401).json('User Not Authenticated');
      }
      const token = JWT.sign({_id: user._id}, process.env.TOKEN_SECRET);
      return res.status(200).json({name: user.name, email: user.email,picture:user.picture,skills: user.skills, address: user.address, role: user.role, activated: user.activated, token});
  })(req, res, next);
}
exports.getFacebookId = async (req, res) => {
  const user = await User.findById(req.query.id);
  if (user) res.status(200).json({facebookId: user.facebookProvider.id});
  else res.status(200).json("Failed");
}
exports.getGoogleId = async (req, res) => {
  const user = await User.findById(req.query.id);
  if (user) res.status(200).json({googleId: user.googleProvider.id});
  else res.status(200).json("Failed");
}
