const router = require('express').Router();
const contractController = require('../controllers/contractController');
const authController = require('../controllers/authController');

//POST
router.post('/addcontract', authController.verifyToken, contractController.addContract);
router.post('/updatecontract', authController.verifyToken, contractController.updateContract);

//GET
router.get('/getcontract',authController.verifyToken, contractController.getContract);
module.exports = router;