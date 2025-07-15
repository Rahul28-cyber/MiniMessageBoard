const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const messages = [
    {
    "user": "Alice",
    "message": "Hello everyone! This board looks great.",
    "added": "2025-06-25T22:08:00.000Z"
  },
  {
    "user": "Bob",
    "message": "Agreed, loving the message board vibe!",
    "added": "2025-06-25T18:30:00.000Z"
  }
]

file = path.join(__dirname,'/messages.txt')


router.get('/',(req,res)=>{

    res.render('htmlpage', {title:'Mini Message Board',messages})
})
router.get('/new',(req,res)=>{
    res.render('form')
})
router.post('/new',(req,res)=>{
    const name = req.body.email
    const msg = req.body.textarea

    const newMessage = {
        user:name,
        message:msg,
        added: new Date()
    }

    messages.push(newMessage)
res.redirect('/');
})

module.exports = router