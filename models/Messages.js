const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
    {
        user: {
            type:String,
            required:true,
        },
        message: {
            type:String,
            required:true
        },
        added: {
            type:String,
            required:true,
        }
    },
    {
        timestamps:true
    }
)

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;