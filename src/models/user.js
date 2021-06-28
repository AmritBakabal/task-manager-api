const mongoose = require('mongoose')
const validator =  require('validator')
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken')
const Task = require( './task' )


//creating a new schema and pasting in the codes: for using middleware
const userSchema = new  mongoose.Schema({
    name: {
        type: String,
        required:true,
        trim: true
    },
    password:{
        type: String,
        requires: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error ('password cannot contain "password" ')
            }
        }
    },
    email:{
        type: String,
        unique: true,  //check if email is unique
        required:true,
        trim:true,   
        lowercase:true,  
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }

        }
    },
    age: {
        type: Number,
        default:0, 
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }

        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar: {
        type: Buffer
    }

},{
    timestamps: true
})

//virtual property : it is not actually data stored in database, it's relationship between two entities
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


//hiding tokens and password from user:
// userSchema.methods.getPublicProfile= function(){
userSchema.methods.toJSON= function(){

    const user= this
    const userObject= user.toObject()
    //using userObject we can manipulate the data:
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//for token: 
userSchema.methods.generateAuthToken= async function(){
    const user= this
    const token= jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET)

    user.tokens= user.tokens.concat({ token })  //in robo sub id is auto generated for tokens like in previous datas.
    user.save()

    return token
}

//to check email, password with user.js /routers: 
userSchema.statics.findByCredentials= async(email, password)=>{
    const user= await User.findOne({email: email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//hash the plain text password before saving:
//using function without arrow for this purpose
userSchema.pre('save', async function(next) {

    const user= this

    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password, 8)
    }

    next()

})

//delete user task when user is removed:

userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User= mongoose.model('User',userSchema)
    
    module.exports= User