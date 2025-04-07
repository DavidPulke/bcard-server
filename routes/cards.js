const express = require("express");
const Card = require("../models/Cards");
const User = require("../models/Users");
const Joi = require("joi");
const router = express.Router();
const cardSchema = require("../scripts/cardSchema");
const auth = require("../middlewares/auth");
const initialCards = require("../scripts/initialCards");



router.get("/", async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).send(cards);
    } catch (error) {
        res.status(400).send(error);
    }
});




// add business card
router.post('/', auth, async (req, res) => {
    try {

        // check if the user is business or admin
        const user = await User.findById(req.payload._id);
        if (!user.isBusiness && !user.isBusiness) return res.status(401).send("Most be a business account or an admin");

        // validate the body
        const { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);


        // check if the card is already exists in the DB
        let card = await Card.findOne({ email: req.body.email })
        if (card) return res.status(400).send("card is already exists");

        // save the card in the DB
        card = new Card(req.body)

        await card.save()
        res.status(201).send("Card as been added successfuly")
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
        for (let card of initialCards) {
            let dbcard = await Card.findOne({ email: card.email });
            if (dbcard) return res.status(400).send("card is already exists in the DB");

            // create card & encrypt password
            dbcard = new Card(card)
            await dbcard.save()
        };
        res.status(201).send("success")


    } catch (error) {
        res.status(400).send(error)
    }
});


// get card by id
router.get("/:id", auth, async (req, res) => {
    try {
        // 1. check for the card in the DB
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(400).send("User Not Found");

        // 2. return the user without the password
        res.status(200).send(card)

    } catch (error) {
        res.status(400).send(error)
    }
});


// update card
router.put("/", async (req, res) => {
    try {
        // validate the body
        const { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // check if card is exists
        let card = await Card.findOneAndUpdate({ email: req.body.email }, req.body);
        if (!card) return res.status(400).send("card does not exists");

        await card.save()
        res.status(200).send(card)

    } catch (error) {
        res.status(400).send(error)
    }
});



// delete card
router.delete("/:id", auth, async (req, res) => {
    try {
        // 1. check if the card is admin
        if (!req.payload.isAdmin && !req.payload.isBusiness) return res.status(401).send("Authorization faild");

        // 2. check if the card exists
        const card = await Card.findByIdAndDelete(req.params.id);
        if (!card) return res.status(400).send("card Not Found");

        res.status(200).send("card As Been Deleted");
    } catch (error) {
        res.status(400).send(error)
    }
});




// patch biz number
router.patch("/bizNumber/:id", auth, async (req, res) => {
    try {
        if (!req.payload.isAdmin) return res.status(401).send("Authorizition error Most be an admin");

        // validate the body
        const { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // get user card
        let card = await Card.findOne({ _id: req.params.id })
        if (!card) return res.status(400).send("card does not exists");

        // check if BizNumber is already in use
        let bizNumber = await Card.findOne({ bizNumber: req.body.bizNumber });
        if (bizNumber) return res.status(400).send("This BizNumber is already in use");

        card.bizNumber = req.body.bizNumber
        await card.save()
        res.status(200).send(card)

    } catch (error) {
        res.status(400).send(error)
    }
});


// like a card
router.patch("/:id", auth, async (req, res) => {
    try {

        // get the card
        let card = await Card.findOne({ _id: req.params.id })
        if (!card) return res.status(400).send("card does not exists");

        // check for the user
        let user = await User.findOne({ _id: req.payload._id });
        if (!user) return res.status(400).send("User not found");

        // check if user is already liked the card
        let result = card.likes.find(x => x == user._id);

        if (result) {
            card.likes.slice(result, 1);
            await card.save();
            return res.status(200).send("Unlike the business card successfuly")
        }

        card.likes.push(user._id);
        await card.save()
        res.status(200).send(card)

    } catch (error) {
        res.status(400).send(error)
    }
});

// get all user cards
router.get("/my-cards/:id", auth, async (req, res) => {
    try {
        // get the user cards

        const cards = await Card.find({ userId: req.params.id }, { _id: 0 });
        if (!cards) return res.status(404).send("No cards found");
        return res.status(200).send(cards);

    } catch (error) {
        res.status(400).send(error)
    }
})








module.exports = router;