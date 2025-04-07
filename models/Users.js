const { required } = require("joi");
const { Schema, model } = require("mongoose");



const userSchema = new Schema({
    name: {
        type: {
            first: {
                type: String,
                minlength: 2,
                maxlength: 256,
                required: true
            },
            middle: {
                type: String,
                default: "-",
                maxlength: 256
            },
            last: {
                type: String,
                minlength: 2,
                maxlength: 256,
                required: true
            },
        }
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
    password: {
        type: String,
        minlength: 7,
        required: true
    },
    image: {
        type: {
            url: {
                type: String,
                minlength: 14,
            },
            alt: {
                type: String,
                minlength: 2,
                maxlength: 256,
            },
        }
    },
    address: {
        type: {
            state: {
                type: String,
                minlength: 2,
                maxlength: 256,
            },
            country: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 256,
            },
            city: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 256,
            },
            street: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 256,
            },
            houseNumber: {
                type: Number,
                required: true,
                maxlength: 256,
            },
            zip: {
                type: Number,
                minlength: 2,
                maxlength: 256,
                required: true
            },
        },
    },
    isBusiness: {
        type: Boolean,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    loginAttempts: {
        type: [Date],
        default: []
    }


});


const User = model("users", userSchema);
module.exports = User;