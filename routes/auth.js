const router = require('express').Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/addinfo', authController.addInfo);
router.post('/login', authController.login);
router.post('/activatedaccount', authController.activatedAccount);
router.post('/loginfb', authController.loginFacebook);
router.post('/logingg', authController.loginGoogle);
router.post('/registerfb', authController.addInfoFb);
router.post('/registergg', authController.addInfoGg);
router.get('/getfacebookid', authController.getFacebookId);
router.get('/getgoogleid', authController.getGoogleId);

module.exports = router;
