const mongoose= require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim:true
    },
    completed: {
        type: Boolean,
        default:false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, //using user.js object id
        required: true,
        ref: 'User' //reference from user.js
    }

},{
    timestamps: true
})

const Task = mongoose.model('Task',taskSchema)


module.exports= Task