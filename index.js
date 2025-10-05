require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {connectDB} = require("./db/connectDB.js");
// const router = require("./router/route")

const app = express();
const port = 2000 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors());

app.get("/" , (req , res) => res.status(200).json({
    message : "Hello From scibblr server"
}));

const start = async () => {
    try {
        await connectDB();

        app.listen(port , () => {
            console.log(`Server is running on http://localhost:${port}`)
        });
    } catch (error) {
        console.log("Failed to connect db",error);
    }
}

start();