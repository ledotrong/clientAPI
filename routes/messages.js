const router = require('express').Router();
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');

//GET
router.get('/getmessage', authController.verifyToken, authController.getUser, messageController.getMessage);
router.get('/get4messages', authController.verifyToken, messageController.get4Messages);

//POST
router.post('/addmessage', authController.verifyToken, messageController.addMessage);
router.post('/seenmessages', authController.verifyToken, messageController.SeenMessages);
module.exports = router;