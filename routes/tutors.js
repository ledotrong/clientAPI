const router = require('express').Router();
const tutorController = require('../controllers/tutorController');

//GET
router.get('/gettutorlist', tutorController.getTutorList);
router.get('/searchtutorlist', tutorController.searchTutorList);


module.exports = router;