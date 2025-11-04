const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, admin, getAllUsers); // add admin and protect middlewares after testing
module.exports = router;