const express = require("express");
const { validatorCreateProfile, validatorSignUp, validatorSignIn, validatorFollowUser, validatorUserInterestTopics } = require("../modules/validator");
const { createProfile, signup, signin, onFollowPeople, onSelectAllInterestTopics } = require("../controller/auth/auth.controller");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// start profile apis
router.post("/profile/create-profile", upload.single("file"), validatorCreateProfile, createProfile);
// end profile apis

// start to authentication
router.post("/auth/sign-up",  validatorSignUp, signup);
router.post("/auth/sign-in",  validatorSignIn, signin);
// end to authentication

// start to follow and unfollow 
router.post("/user/follow-unfollow" ,validatorFollowUser , onFollowPeople )
// end to follow and unfollow 

// start to insert topics
router.post("/user/add-interested-topics" , validatorUserInterestTopics , onSelectAllInterestTopics)
// end to insert topics

module.exports = router;
