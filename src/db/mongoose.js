const mongoose = require('mongoose')
// const validator =  require('validator')

// connecting to the database: 
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true   ,
    useFindAndModify: false //because of the deprecated error  

})

//setting up the model for mongoose with field required for us : 
// const User= mongoose.model('User',{
//     name: {
//         type: String,
//         required:true,
//         trim: true
//     },
//     password:{
//         type: String,
//         requires: true,
//         trim: true,
//         minlength: 7,
//         validate(value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error ('password cannot contain "password" ')
//             }
//         }
//     },
//     email:{
//         type: String,
//         required:true,
//         trim:true,  //removing unnecessary spaces. 
//         lowercase:true,  //automatically converts to lowercase
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('Invalid Email')
//             }

//         }
//     },
//     age: {
//         type: Number,
//         default:0, 
//         validate(value){
//             if(value < 0){
//                 throw new Error('Age must be a positive number')
//             }

//         }
//     }

// })

// //inserting fields: 
// const me = new User ({
//     name: '   Samina   ',
//     email:'    SAMINA@GMAIL.COM     ',
//     password: 'asdfghjk'
// })

// //saving into database: 
// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('error!!',error)
// })

// const tasks = mongoose.model('tasks',{
//     description: {
//         type: String,
//         required: true,
//         trim:true
//     },
//     completed: {
//         type: Boolean,
//         default:false
//     }

// })

// const work = new tasks({
//     description: '     playing football'
    
// })
// work.save().then(()=>{
//     console.log(work)
// }).catch((error)=>{
//     console.log('Unable to create', error)
// })