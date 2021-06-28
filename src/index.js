const express= require('express')
require('./db/mongoose')
const validator= require('validator')
const User= require('./models/user')
const Task= require('./models/task')
const userRouter= require('./routers/user')
const taskRouter= require('./routers/task')


const app= express()
const port= process.env.PORT 

//creating middleware function : 
// app.use((req, res, next)=>{
//     // console.log(req.method, req.path)
//     // next()
//     if(req.method=== 'GET'){
//         res.send('get request are disabled')
//     } else {
//         next()
//     }

// })

//creating maintance middleware:
// app.use((req, res, next)=>{
    
//         res.status(503).send('Under Maintanance')

// })

//using npm multer for file uploads:
// const multer = require('multer')
// const upload = multer({
//     dest: 'images' ,  // dest-> destination and the folder name where files are saved.
//     limits:{
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('please upload a word document'))
//         }
//         // cb(new Error('file must be a PDF'))
//         cb(undefined, true)
//         // cb(undefined, false)


//     }
// })
 
// const errormiddleware = (req, res, next)=>{
//     throw new Error('from my middleware')
// }

// app.post('/upload', upload.single('upload') , (req, res)=>{  //using middleware upload.single where it takes whatever is returned to it.
//     res.send()
// },(error, req, res, next)=>{
//     res.status(400).send({error: error.message })
// })

app.use(express.json()) //This one line automatically parse the incoming json to an object and we can use it in req handler

//latest: (testing)
//using express routes:
// const router = new express.Router()
// router.get('/test', (req, res)=>{
//     res.send('This is a testing route')
// })
// app.use(router)  //regestring with express application

app.use(userRouter)
app.use(taskRouter)
//creation endpoint: 



app.listen(port, ()=>{
    console.log('The app is running in the port :' + port)
})



//checking bcryptjs: 
// const bcrypt = require( 'bcryptjs')

// const myFunction= async()=>{

//     const password= 'Amrit1234'
//     const hasedPassword= await bcrypt.hash(password, 8)   //8= no of rounds how many time the hashing algorithm is executed.

//     console.log(password)
//     console.log(hasedPassword)

//     const isMatched= await bcrypt.compare('amrit1234', hasedPassword)
//     console.log(isMatched)
// }

//tokens: 
// const jwt= require('jsonwebtoken')
// const myFunction= async()=>{
//     const token= jwt.sign({_id:'1234'}, 'thisismynewcourse', {expiresIn: '7 days'})
//     console.log(token)
   
//     const data= jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }
// myFunction()


//testing for toJSON :
// const pet={
//     name:'amrit'
// }

// pet.toJSON= function() {
//     // console.log(this)
//     // return this 
//     return {}
// }
// console.log(JSON.stringify(pet))


// const Task = require('./models/task')
// const main = async () => {
//     // const task = await Task.findById('5c2e505a3253e18a43e612e6')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('60d36dacd0582d64f1add240')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }


// main()