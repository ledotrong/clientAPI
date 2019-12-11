const router = require('express').Router();
const skillController = require('../controllers/skillController');

//GET
router.get('/getallskills', skillController.getAllSkills);


module.exports = router;