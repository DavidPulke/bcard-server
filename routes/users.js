const express = require("express");
const User = require("../models/Users");
const Joi = require("joi");
const initialUsers = require("../scripts/initialUsers");
const router = express.Router();
const auth = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerSchema = require("../scripts/registerSchema")




// get all users 
router.get("/", auth, async (req, res) => {
    try {
        // check if admin
        if (!req.payload.isAdmin) return res.status(401).send("User Unauthorized");

        // get the users
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send(error)
    }
});


// initial request
// request body === {"init": true} !important
router.post('/init', async (req, res) => {
    try {
        // check for the init body
        const { init } = req.body

        if (!init) return res.status(400).send("Ooops something went wrong try again");

        // check if there is already registerd users
        for (let user of initialUsers) {
            let dbuser = await User.findOne({ email: user.email });
            if (dbuser) return res.status(400).send("users already exists in the DB");

            // create user & encrypt password
            dbuser = new User(user)
            const salt = await bcrypt.genSalt(10);
            dbuser.password = await bcrypt.hash(dbuser.password, salt)
            await dbuser.save()
        }


        res.status(201).send("success")

    } catch (error) {
        res.status(400).send(error)
    }
});


// get user by id
router.get("/:id", auth, async (req, res) => {
    try {
        // 1. check for the user in the DB
        const user = await User.findById(req.params.id, { password: 0 });
        if (!user) return res.status(400).send("User Not Found");

        // 2. return the user without the password
        res.status(200).send(user)

    } catch (error) {
        res.status(400).send(error)
    }
});


// update user
router.put("/", async (req, res) => {
    try {
        // validate the body
        const { error } = registerSchema.validate();
        if (error) return res.status(400).send(error.details[0].message);

        // check if user is exists
        let user = await User.findOneAndUpdate({ email: req.body.email }, req.body);
        if (!user) return res.status(400).send("user does not exists");

        // encrypt the new password
        /*  const salt = await bcrypt.genSalt(10);
         user.password = await bcrypt.hash(user.password, salt) */


        // create token
        const token = jwt.sign({ _id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.JWTKEY);
        res.status(201).send(token)

    } catch (error) {
        res.status(400).send(error)
    }
});



// delete user
router.delete("/:id", auth, async (req, res) => {
    try {
        // 1. check if the user is admin
        if (!req.payload.isAdmin) return res.status(401).send("Authorization faild");

        // 2. check if the user exists
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(400).send("User Not Found");

        res.status(200).send("User As Been Deleted");
    } catch (error) {
        res.status(400).send(error)
    }
});


// change isBusiness status
router.patch("/:id", auth, async (req, res) => {
    try {
        // 1. check for the user in the DB
        const user = await User.findById(req.params.id, { password: 0 });
        if (!user) return res.status(400).send("User Not Found");

        // 2. change user isBusiness status
        user.isBusiness = req.body.isBusiness
        user.save();

        // 3. return the user without the password
        res.status(200).send(user)

    } catch (error) {
        res.status(400).send(error)
    }
});






module.exports = router;