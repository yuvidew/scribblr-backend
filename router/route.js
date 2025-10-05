const express = require("express");
const { validatorCreateProfile, validatorSignUp, validatorSignIn } = require("../modules/validator");
const { createProfile, signup, signin } = require("../controller/auth/auth.controller");
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

module.exports = router;
