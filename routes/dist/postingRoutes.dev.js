"use strict";

var express = require("express");

var postingController = require("../controllers/postingController");

var authenticate = require("../middlewares/authenticate");

var uploadImage = require("../middlewares/uploadImage");

var router = express.Router();
router.post('/postingNew', authenticate, postingController.createPosting);
router.get('/getAllPostings', postingController.getAllPostings);
router.get('/getPostingByUserId', authenticate, postingController.getAllPostings);
router.get('/getPostingById/:id', postingController.getPostingById);
router.put('/updatePosting/:id', postingController.updatePosting);
router["delete"]('/deletePosting/:id', postingController.deletePosting);
router.get('/getAllPostingByUserId', authenticate, postingController.getPostingByUserId);
module.exports = router;