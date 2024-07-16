const express = require('express');
const router = express.Router();

const Post = require('./../models/post');
const User = require('../models/user');

router.post('/create', async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ message: 'Input not get' });

    }

    try {
        const user = await User.findById(req.body.id);
        if (!user) {
            return res.status(400).json({ message: 'user not found' });

        }
        const post = new Post({
            User: req.body.id,

            title: req.body.title,
            description: req.body.description,

        });
        await post.save();

        res.status(200).json({ post });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }

});
router.get('/read/:id', async (req, res) => {



    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ message: 'post not found' });

        };
        res.status(200).json({ post });



    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.patch('/update/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!post) {
            return res.status(400).json({ message: 'post not found' });
        }
        res.status(200).json({ post });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(400).json({ message: 'post not found' });
        }
        res.status(200).json({ post, message: "post deleted" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/like/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ message: 'post not found' });
        }
        post.likes += 1;
        await post.save();
        res.status(200).json({ message: "post like" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/comment/:id', async (req, res) => {

    try {
        if (!req.body) {
            return res.status(400).json({ message: 'please add comment' });

        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ message: 'post not found' });
        }
        post.comment.push(req.body);
        await post.save();
        res.status(200).json({ message: "commited" });
    } catch (error) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
