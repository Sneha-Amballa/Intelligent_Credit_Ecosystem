const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/user/:username', userController.getUser);
router.get('/users', userController.getAllUsers);
router.put('/user/:username', userController.updateUser);
router.delete('/user/:username', userController.deleteUser);

module.exports = router;