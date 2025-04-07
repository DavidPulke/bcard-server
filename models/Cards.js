const { Schema, model } = require("mongoose");



const cardSchema = new Schema({
    userId: {
        type: String,
        default: "Developer"
    },
    title: {
        type: String,
        minlength: 2,
        maxlength: 256,
        required: true
    },
    subtitle: {
        type: String,
        minlength: 2,
        maxlength: 256,
        required: true
    },
    description: {
        type: String,
        minlength: 2,
        maxlength: 1024,
        required: true
    },
    phone: {
        type: String,
        minlength: 9,
        maxlength: 11,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 40,
        required: true,
        unique: true
    },
    web: {
        type: String,
    },
    image: {
        type: {
            url: {
                type: String,
            },
            alt: {
                type: String,
                maxlength: 256,
            },
        }
    },
    address: {
        type: {
            state: {
                type: String,
            },
            country: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            street: {
                type: String,
                required: true,
            },
            houseNumber: {
                type: Number,
                required: true,
            },
            zip: {
                type: Number,
            },
        },
    },
    likes: {
        type: [String],
        default: []
    },
    bizNumber: {
        type: Number,
    }
});


const Card = model("cards", cardSchema);
module.exports = Card;