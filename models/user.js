const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]


});
usersSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(user.password, salt);
        user.password = hashpassword;
        next();
    } catch (err) {
        return next(err);
    }
});
usersSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
}
const User = mongoose.model('User', usersSchema);
module.exports = User;