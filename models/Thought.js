const mongoose = require('mongoose');
const moment = require('moment');


const thoughtSchema = new mongoose.Schema({
    thoughtText: {
        type: String,
        required: true,
        trim: true,
        min: 1,
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
    reaction: [reactionSchema],
})

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reaction.length
})

const Thought = mongoose.model('Thought', thoughtSchema);


module.exports = Thought;
