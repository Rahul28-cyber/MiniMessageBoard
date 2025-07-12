const express = require('express')
const fs = require('fs')
const app = express()
const indexRouter = require('./routes/route')

app.set('view engine','ejs')
app.set('views','./views')
app.use(express.urlencoded({extended:false}))

app.use('/', indexRouter)


app.listen(3000, ()=>{
    console.log("Listening on http://localhost:3000")
})