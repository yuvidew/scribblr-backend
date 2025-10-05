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
}