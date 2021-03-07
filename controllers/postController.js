const { validationResult } = require('express-validator')
const readingTime = require('reading-time')
const Post = require('../models/Post')
const Profile = require('../models/Profile')
const Flash = require("../utils/Flash")
const errorFormatter = require('../utils/validationErrorFormatter')

exports.createPostGetControler = (req, res, next) => {

    res.render('pages/post/createPost.ejs',
        {
            title: 'Create A New Post',
            error: {},
            flashMessage: Flash.getMessage(req),
            value: {}
        }
    )
}

exports.createPostPostControler = async (req, res, next) => {
    let { title, body, tags } = req.body
    let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty) {
        return res.render('pages/post/createPost.ejs',
            {
                title: 'Create A New Post',
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req),
                value: {
                    title,
                    body,
                    tags
                }
            }
        )
    }
    if (tags) {
        tags = tags.split(',')
    }

    let readTime = readingTime(body).text

    let post = new Post({
        title,
        body,
        tags,
        author: req.user._id,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: []
    })

    if (req.file) {
        post.thumbnail = `uploads/${req.file.filename}`
    }

    try {
        let createdPost = await post.save()
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $push: { 'posts': createdPost } }
        )
        req.flash('success', 'Post Created Successfully')
        return res.redirect(`/posts/edit/${createdPost._id}`)
    } catch (e) {
        next(e)
    }


}