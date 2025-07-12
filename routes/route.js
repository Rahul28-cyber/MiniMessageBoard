const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

file = path.join(__dirname,'/messages.txt')


router.get('/',(req,res)=>{
    fs.readFile(file,'utf-8',(err,data)=>{
    if(err)
        console.log(err)
    const text = JSON.parse(data)
    res.render('htmlpage', {title:'Mini Message Board',messages:text})
})
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

    fs.readFile(file,'utf-8',(err,data)=>{
        let messages = []
        if(!err){
            try{
                messages = JSON.parse(data)
            }
            catch(err){
                console.log(err)
            }
        }
        messages.push(newMessage)

        fs.writeFile(file, JSON.stringify(messages, null, 2), (err) => {
      if (err) console.log('Error writing file:', err);
      res.redirect('/');
        })
    })
})

module.exports = router