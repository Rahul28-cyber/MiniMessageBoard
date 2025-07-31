const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const Message = require('../models/Messages')
const User = require('../models/User')
const passport = require('passport')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
require('dotenv').config();



function isauthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

router.get('/',isauthenticated,async (req,res)=>{
    const messages = await Message.find()
    res.render('htmlpage', {title:'Mini Message Board',messages,user:req.user})
})
router.get('/user', isauthenticated, async (req,res)=>{
    const messages = await Message.find({user:req.user.username})
    res.render('YourPost', {title:'Mini Message Board',messages,user:req.user})
})
router.get('/new',isauthenticated,(req,res)=>{
    res.render('form',{title:'Mini Message Board'})
})
router.post('/new',isauthenticated, async (req,res)=>{
    const name = req.user.username
    const msg = req.body.textarea

    try {
        const newMsg = new Message({
        user:name,
        message:msg,
        added: new Date()
    })
    await newMsg.save();
    res.redirect('/');
    } catch (error) {
        console.log(error)
    }

})
router.get('/login', (req,res)=>{
    res.render('login')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',      
  failureRedirect: '/login', 
  failureFlash: true
}))


router.get('/register', (req,res)=>{
    res.render("register")
})
router.post('/register', async (req,res)=>{
    const usr = req.body.username
    const email = req.body.email
    const pass = req.body.password

    const existsUser = await User.findOne({username:usr})
    const existsEmail = await User.findOne({email:email})
    if(existsUser || existsEmail){
        req.flash('error', "Username or E-mail already exists!");
        res.redirect('/register');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = Date.now() + 1000*60*15  // for 15 minutes

    try {
        const newuser = new User({
            username:usr,
            email:email,
            password:pass,
            verificationToken:verificationToken,
            tokenExpires:tokenExpires
        });

        // E-mail Transporter
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const isDev = process.env.NODE_ENV !== 'production';
        const baseurl = isDev ? 'http://localhost:3000' : process.env.BASE_URL;
        const verificationUrl = `${baseurl}/verify/${verificationToken}`;

        await transporter.sendMail({
            from : `"MiniBoard" ${process.env.EMAIL_USER}`,
            to: email,
            subject: 'Verify your E-mail',
            html: `<p>Click on the link to verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`
        });

        await newuser.save();

        req.flash('success',"Check your e-mail to verify the account.");
        res.redirect('/register');
    } catch (err) {
         console.log(err);
         await User.deleteOne({ email });
         res.status(500).send("Something went wrong.");
    }
});

router.get('/verify/:token', async (req,res,next)=>{
    const user = await User.findOne({
        verificationToken: req.params.token,
        tokenExpires: {$gt: Date.now()}
    });

    if(!user){
        req.flash('error', 'Invalid or expired verification link.');
        return res.redirect('/register');
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    req.login(user, (err)=>{
        if (err) return next(err);
        res.redirect('/');
    })

})

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});


module.exports = router