const express = require('express');
const router = express.Router();
const User = require('./../models/user');
var MailChecker = require('mailchecker');

router.post('/registration', async (req, res) => {
    try {
        //for demo storing plain text password in database but we should store using hash
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

        res.status(200).json({ response });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });

    }
});

router.post('/login', async (req, res) => {
    try {
        let { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'fill username or password' });

        }

        const checkuser = await User.findOne({ username: username, password: password });
        if (!checkuser) {
            return res.status(400).json({ error: 'user not found try to register' });

        }



        res.status(200).json({ checkuser });
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
