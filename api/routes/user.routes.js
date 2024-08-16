const upassport = require('passport');
const needsAuth = upassport.authenticate('user', { session: false });
const express = require('express');
const { uploadMultiple } = require('../controllers/user');
const router = express.Router();

router.post('/upload/multiple',uploadMultiple);

module.exports=router;