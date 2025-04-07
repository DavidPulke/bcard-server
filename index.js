const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");
const cards = require("./routes/cards");
const users = require("./routes/users");
const register_login = require("./routes/register-login");
const { default: rateLimit } = require("express-rate-limit");
const { writeFile } = require('node:fs/promises');

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    limit: 200, // Limit each IP to 100 requests per `window` (here, per 24 hours).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

app.use(limiter)

// connect to database
mongoose.connect(process.env.DB).then(() => console.log(`Connected to MongoDB`)).catch((err) => console.log(err));


// logger
const logger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${duration}ms`);
    });
    next();
};

app.use(async (req, res, next) => {
    try {
        await writeFile('log', `\n${req.method} ${req.url} ${new Date()}`, {
            flag: 'a'
        })
    } catch (error) {
        console.log(error)
    }
    next()
})

app.use(logger);
app.use("/api/cards", cards);
app.use("/api/users", users);
app.use("/api/users", register_login);






app.listen(port, () => console.log(`Server started on port ${port}`));