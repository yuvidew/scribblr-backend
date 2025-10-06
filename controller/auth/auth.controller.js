const { getDB } = require("../../db/connectDB");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createProfile = async (req, res) => {
    try {
        const { date_of_birth, fullname, gender, phone_number, country } = req.body;

        if (!req.file) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "No file uploaded",
            });
        }

        const file = bucket.file(`uploads/${Date.now()}_${req.file.originalname}`);
        await file.save(req.file.buffer, {
            metadata: { contentType: req.file.mimetype },
            resumable: false,
        });

        const image_url = await getDownloadURL(file);

        const db = getDB();

        const sql = `
            INSERT INTO profiles
                (fullname, gender, phone_number, country, date_of_birth, image_url, followers, following)
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            fullname,
            gender,
            phone_number,
            country,
            date_of_birth,
            image_url,
            0,
            0,
        ];

        const [result] = await db.execute(sql, params);

        if (result.length === 0) {
            return res.status(400).json({
                code: 400,
                message: "Failed to create profile.",
            });
        }

        return res.status(201).json({
            code: 201,
            message: "Profile is successfully created",
            profile_id: result.insertId,
        });
    } catch (error) {
        console.log("Create profile Error: ", error);
        return res.status(400).json({
            code: 400,
            message: error.message,
        });
    }
};

const onFollowPeople = async (req, res) => {
    try {
        const { user_profile_id, following_profile_id } = req.body;

        const db = getDB();

        const [existing] = await db.query(
            "SELECT * FROM user_following WHERE user_profile_id = ? AND following_profile_id = ?",
            [user_profile_id, following_profile_id]
        );

        if (existing.length > 0) {
            await db.query(
                "DELETE FROM user_following WHERE user_profile_id = ? AND following_profile_id = ?",
                [user_profile_id, following_profile_id]
            );

            return res.status(200).json({ message: "Unfollowed successfully" });
        } else {
            await db.query(
                "INSERT INTO user_following (user_profile_id, following_profile_id) VALUES (?, ?)",
                [user_profile_id, following_profile_id]
            );
            return res.status(201).json({ message: "Followed successfully" });
        }
    } catch (error) {
        console.log("Error in follow/unfollow: ", error);
        return res.status(400).json({
            code: 400,
            message: error.message,
        });
    }
};

const onSelectAllInterestTopics = async (req, res) => {
    const { user_id, topics } = req.body;

    try {
        const db = getDB();

        if (!user_id || !Array.isArray(topics) || topics.length === 0) {
            return res.status(400).json({
                code: 400,
                message: "user_id and topics array are required.",
            });
        }

        const values = topics.map((topic) => ({ user_profile_id: user_id, topic }));



        const query = `INSERT INTO user_interest_topics (user_profile_id, topic)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE topic = VALUES(topic)`;

        for (const v of values) {
            await db.query(query, [v.user_profile_id, v.topic]);
        }

        return res.status(201).json({
            code: 201,
            message: "Interest topics added successfully.",
        });
    } catch (error) {
        console.log("Error to select interest topics: ", error);
        return res.status(400).json({
            code: 400,
            message: error.message,
        });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = getDB();

        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);

        if (users.length === 0) {
            return res.status(401).json({
                code: 401,
                success: false,
                message: "This email is not exist, create account first",
            });
        }

        const user = users[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                code: 401,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.username,
            },
            process.env.JWT_SECRET
        );

        return res.status(200).json({
            success: true,
            message: "Welcome to Scribblr",
            token,
        });
    } catch (error) {
        console.log("Sign in Error: ", error);
        return res.status(400).json({
            code: 400,
            message: error.message,
        });
    }
};

const signup = async (req, res) => {
    try {
        const { username, email, password, profile_id } = req.body;

        const db = getDB();

        const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (username , email , password , profile_id) VALUES (?, ?, ?, ?)",
            [username, email, hashPassword, profile_id]
        );

        return res.status(200).json({
            code: 200,
            message: "Sign up successfully",
        });
    } catch (error) {
        console.log("Sign up Error: ", error);
        return res.status(400).json({
            code: 400,
            message: error.message,
        });
    }
};

module.exports = {
    createProfile,
    signup,
    signin,
    onFollowPeople,
    onSelectAllInterestTopics,
};
