const router = require('express').Router();
const authController = require('../controllers/authController');

//GET
router.get('/getfacebookid', authController.getFacebookId);
router.get('/getgoogleid', authController.getGoogleId);

//POST
router.post('/register', authController.register);
router.post('/addinfo', authController.addInfo);
router.post('/login', authController.login);
router.post('/activatedaccount', authController.activatedAccount);
router.post('/loginfb', authController.loginFacebook);
router.post('/logingg', authController.loginGoogle);
router.post('/registerfb', authController.addInfoFb);
router.post('/registergg', authController.addInfoGg);
router.post('/updateavatar', authController.updateAvatar);
router.post('/updateinfo', authController.updateInfo);

module.exports = router;
