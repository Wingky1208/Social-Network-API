const mongoose = require('mongoose');
const moment = require('moment');


const reactionSchema = new mongoose.Schema({
    reactionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        max: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => moment(timestamp).format('MMMM Do YYYY, h:mm:ss a'),
    },
    username: {
        type: String,
        required: true,
    },
})


module.exports = reactionSchema;