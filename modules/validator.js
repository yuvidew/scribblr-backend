const {
    body,
    validationResult,
    param,
    query
} = require("express-validator");

module.exports = {
    validatorCreateProfile: [
        body("fullname")
            .notEmpty()
            .withMessage("Full name is required")
            .isLength({ min: 2, max: 100 })
            .withMessage("Full name must be between 2 and 100 characters"),

        body("gender")
            .notEmpty()
            .withMessage("Gender is required")
            .isIn(["Male", "Female", "Other"])
            .withMessage("Gender must be Male, Female, or Other"),

        body("phone_number")
            .notEmpty()
            .withMessage("Phone number is required")
            .isMobilePhone()
            .withMessage("Invalid phone number"),

        body("country")
            .notEmpty()
            .withMessage("Country is required")
            .isLength({ max: 50 })
            .withMessage("Country must be less than 50 characters"),

        body("date_of_birth")
            .notEmpty()
            .withMessage("Date of birth is required")
            .isDate({ format: "YYYY-MM-DD" })
            .withMessage("Date of birth must be in YYYY-MM-DD format"),

        (req, res, next) => {
            const error = validationResult(req);

            if (!error.isEmpty())
                return res.status(400).send({
                    code: 400,
                    message: error.array()[0].msg,
                });

            next();
        },
    ],

    validatorSignUp: [
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Name is required")
            .isLength({
                min: 3,
            })
            .withMessage("Name must be at least 3 characters long."),

        body("email").trim().isEmail().withMessage("Invalid email format."),
        body("profile_id").notEmpty()
            .withMessage("Profile_id is required")
            .isInt()
            .withMessage("Invalid Profile_id"),


        body("password")
            .trim()
            .isLength({
                min: 8,
            })
            .withMessage("Password must be at least 8 characters long."),
        (req, res, next) => {
            const error = validationResult(req);

            if (!error.isEmpty())
                return res.status(400).send({
                    code: 400,
                    message: error.array()[0].msg,
                });

            next();
        },
    ],
    validatorSignIn: [
        body("email").trim().isEmail().withMessage("Invalid email format."),

        body("password")
            .trim()
            .isLength({
                min: 8,
            })
            .withMessage("Password is required."),

        (req, res, next) => {
            const error = validationResult(req);

            if (!error.isEmpty())
                return res.status(400).send({
                    code: 400,
                    message: error.array()[0].msg,
                });

            next();
        },
    ],
    validatorFollowUser: [
        body("user_profile_id")
            .notEmpty()
            .withMessage("user_id is required.")
            .isInt({ min: 1 })
            .withMessage("user_id must be a valid integer."),

        body("following_profile_id")
            .notEmpty()
            .withMessage("following_profile_id is required.")
            .isInt({ min: 1 })
            .withMessage("following_profile_id must be a valid integer."),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({
                    code: 400,
                    message: errors.array()[0].msg,
                });

            next();
        },
    ],
    validatorUserInterestTopics: [
        body("user_id")
            .notEmpty()
            .withMessage("user_id is required.")
            .isInt({ min: 1 })
            .withMessage("user_id must be a valid integer."),

        body("topics")
            .isArray({ min: 1 })
            .withMessage("topics must be a non-empty array."),

        body("topics.*")
            .isString()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage("Each topic must be a string between 2 and 50 characters."),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: errors.array()[0].msg,
                });
            }
            next();
        },
    ]

}