const express = require('express');
const router = express.Router();
const User = require('./../models/user');
var MailChecker = require('mailchecker');
const { jam, generateToken } = require('./../jwt');

router.post('/registration', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'incomplete information' });
        }

        if (!MailChecker.isValid(email)) {
            return res.status(400).json({ error: 'invalid email' });

        }

        const checkuser = await User.findOne({ email: email });
        if (checkuser) {
            return res.status(400).json({ error: 'user already present try to login' });
        }
        const response = await new User({ username, email, password }).save();
        const payload = {
            id: response.id,
            username: response.username
        }
        const token = generateToken(payload);
        res.status(200).json({ response, token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });

    }
});

router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'fill email or password' });

        }

        if (!MailChecker.isValid(email)) {
            return res.status(400).json({ error: 'invalid email' });

        }
        const checkuser = await User.findOne({ email: email });
        if (!checkuser || !(await checkuser.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const payload = {
            id: checkuser.id,
            username: checkuser.username
        }
        const token = generateToken(payload);


        res.status(200).json({ checkuser, token });
    }
    catch (err) {
        res.status(500).json({
            error: "internal server problem"

        })

    }
});

router.post('/forgot_password', async (req, res) => {
    try {
        const { email, newpassword } = req.body;
        if (!email || !newpassword) {
            return res.status(400).json({ error: 'incomplete info' });

        }
        if (!MailChecker.isValid(email)) {
            return res.status(400).json({ error: 'invalid email' });

        }
        const checkuser = await User.findOne({ email: email }
        );

        if (!checkuser) {
            return res.status(400).json({ error: 'user not found try to register' });

        }
        checkuser.password = newpassword;
        await checkuser.save();

        res.status(200).json({ message: 'Password updated' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({

            error: "internal server problem"

        })

    }
});
module.exports = router;
