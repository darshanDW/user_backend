const mongoose = require('mongoose');
const User = require('./user');
const { stringifyMessage } = require('graphql-ws');
const commentSchema = new mongoose.Schema({
    text: String,
    date: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0

    },
    comment: [commentSchema]


});


const Post = mongoose.model('Post', postSchema);
module.exports = Post;
