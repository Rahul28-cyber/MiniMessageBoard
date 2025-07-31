const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')
const app = express()
const indexRouter = require('./routes/route')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

require('./passport-config')(passport);

app.use(express.static('public'));
app.set('view engine','ejs')
app.set('views','./views')
app.use(express.urlencoded({extended:false}))

app.use(session({
    secret: 'notesapplication$7410', // 🔐 use environment variable in production
    resave: false,
    saveUninitialized: false
}));

app.use(flash())
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter)



mongoose.connect("mongodb+srv://hacker28101:zOK4xXQoosRakVu0@mongodb.dz23fh7.mongodb.net/?retryWrites=true&w=majority&appName=MongoDB")
.then(()=>{
    console.log("Connected to MongoDB Database!!")
    app.listen(3000, ()=>{
        console.log("Listening on http://localhost:3000")
    })
})
.catch((err)=>{
    console.log("Connection Failed!!",err)
})


